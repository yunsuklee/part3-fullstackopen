const express = require('express') // Imports express
const app = express() // Uses express fn to create an express app
require('dotenv').config() // Imports library to handle .env
const morgan = require('morgan') // Imports middleware to handle requests
const cors = require('cors') // Imports cors middleware
const Person = require('./models/person') // Imports Mongoose person model
const { response } = require('express')

morgan.token('data-sent', (req, res) => { // Morgan token to display data sent in POST requests
  return JSON.stringify(req.body)
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  next(err)
}

app.use(express.static('build')) // To show static content
app.use(express.json()) // To access data easily
app.use(cors()) // To allow requests from other origins
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-sent')) // Morgan middleware fn

app.get('/', (req, res) => { // Root page
  res.send('<h1>Hello, World!</h1>')
})

app.get('/api/persons', (req, res) => { // Fetch data
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => { // Phonebook info
  res.send(`
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${Date()}</p>`
  )
})

app.get('/api/persons/:id', (req, res, err) => { // Single data fetch
  Person.findById(req.params.id)
    .then(person => {
      if(person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => { // Deleting single data
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
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

  if (!body.name) { // No name in request
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) { // No number in request
    return res.status(400).json({
      error: 'number missing'
    })
  } 

  Person.findOne({ name: body.name })
    .then(person => {
      if(person) {
        res.redirect(`/`)
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
      
        person.save().then(savedPerson => {
          res.json(savedPerson)
        })
      }
    })
    
})

app.put('/api/persons/:id', (req, res, next) => { // Updating existing person
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => { // Handling unkown endpoints
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => { // Server's port
  console.log(`Server running on port ${PORT}`)
})