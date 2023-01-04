const { response } = require('express')
const express = require('express') // Imports express
const morgan = require('morgan')
const cors = require('cors') // Imports cors middleware

const app = express() // Uses express fn to create an express app

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  } 
]

morgan.token('data-sent', (req, res) => { // Morgan token to display data sent in POST requests
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-sent')) // Morgan middleware fn
app.use(express.static('build')) // To show static content
app.use(cors()) // To allow requests from other origins

app.get('/', (req, res) => { // Root page
  res.send('<h1>Hello, World!</h1>')
})

app.get('/api/persons', (req, res) => { // Fetch data
  res.json(persons)
})

app.get('/info', (req, res) => { // Phonebook info
  res.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
    `
  )
})

app.get('/api/persons/:id', (req, res) => { // Single data fetch
  const id = Number(req.params.id)  
  const person = persons.find(person => person.id === id)

  person 
    ? res.json(person)
    : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => { // Deleting single data
  const id = Number(req.params.id)  
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.use(express.json()) // To access data easily

const generateNewId = () => { // Random id generator
  let id = Math.floor(Math.random() * 100)
  while (persons.find(person => person.id === id)) { // Should keep running until a unique id is found
    id = Math.floor(Math.random() * 100)
  }
  return id
}

app.post('/api/persons', (req, res) => { // Creating a new person
  const body = req.body // All info is sent in the request's body

  if (!body.name) { // No name in request
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) { // No number in request
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) { // Existing name 
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateNewId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person) // Creating new persons array
  res.json(person)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => { // Server's port
  console.log(`Server running on port ${PORT}`)
})