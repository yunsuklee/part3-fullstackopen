const express = require('express') // Imports express
const app = express() // Uses express fn to create an express app
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors') // Imports cors middleware
const Person = require('./models/person')

morgan.token('data-sent', (req, res) => { // Morgan token to display data sent in POST requests
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-sent')) // Morgan middleware fn
app.use(express.static('build')) // To show static content
app.use(express.json()) // To access data easily
app.use(cors()) // To allow requests from other origins

app.get('/', (req, res) => { // Root page
  res.send('<h1>Hello, World!</h1>')
})

app.get('/api/persons', (req, res) => { // Fetch data
  Person.find({}).then(persons => {
    res.json(persons)
  })
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
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => { // Deleting single data
  const id = Number(req.params.id)  
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

/*
const generateNewId = () => { // Random id generator
  let id = Math.floor(Math.random() * 100)
  while (persons.find(person => person.id === id)) { // Should keep running until a unique id is found
    id = Math.floor(Math.random() * 100)
  }
  return id
}
*/

app.post('/api/persons', (req, res) => { // Creating a new person
  const body = req.body // All info is sent in the request's body

  console.log(body)

  if (!body.name) { // No name in request
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) { // No number in request
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (Person.findOne({ 'name': body.name })) { // Existing name 
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => { // Server's port
  console.log(`Server running on port ${PORT}`)
})