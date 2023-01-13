import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personServices from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPerson] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPerson(initialPersons)
      })
  }, [])

  // const getId = () => {
  //   let id = persons.length + 1

  //   for (let i = 0; i < persons.length; i++) {
  //     let found = 0

  //     for (let j = 0; j < persons.length; j++) {
  //       if (i + 1 === persons[j].id) found++
  //     }

  //     if (!found) {
  //       id = i + 1
  //       break
  //     } 
  //   }
  //   return id
  // } 

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (person && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...person, number: newNumber }

      personServices
        .update(changedPerson.id, changedPerson)
        .then(returnedPerson => {
          setPerson(persons.map(person => person.id !== changedPerson.id ? person : changedPerson))
          
          setMessageType('success')
          setMessage(
            `Updated ${newName}'s phone number` 
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        })
        .catch(error => {
          console.log(error)
          setMessageType('error')

          if (error.name === 'AxiosError') {
            setMessage(`Person validation failed: Name should be at least 3 characters long. Both name and number are required.`)
          } else {
            setMessage(`Information of ${newName} has already been removed from server`)
          }

          setTimeout(() => {
            setMessage(null)
          }, 5000)
          personServices
            .getAll()
            .then(initialPersons => {
              setPerson(initialPersons)
            })
        })
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }      
      personServices
        .create(newPerson)
        .then(createdPerson => {
          setPerson(persons.concat(createdPerson))
          setMessageType('success')
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessageType('error')
          setMessage(`Person validation failed: Name should be at least 3 characters long. Both name and number are required.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  const handlePersonDelete = (id) => {
    console.log(id)
    console.log(persons.filter(p => p.id === id)[0].name)

    if (window.confirm(`Delete ${persons.filter(p => p.id === id)[0].name}?`)) {
      personServices
        .deletePerson(id)
        .then(response => {
          personServices
            .getAll()
            .then(initialPersons => {
              setPerson(initialPersons)
            })
        })
    }
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(newSearch.toLowerCase())  
  )

  return (
    <div id="App">
      <h1>Phonebook</h1>
      <Notification 
        message={message}
        messageType={messageType}
      />
      <Filter 
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add new contact</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        personsToShow={personsToShow} 
        personsDeleter={handlePersonDelete}
      />
    </div>
  )
}

export default App
