import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import People from './components/People'
import PersonForm from './components/PersonForm'
import personServices from './services/people'
import Notification from './components/Notification'

const App = () => {
  const [people, setPerson] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPeople => {
        setPerson(initialPeople)
      })
  }, [])

  const getId = () => {
    let id = people.length + 1

    for (let i = 0; i < people.length; i++) {
      let found = 0

      for (let j = 0; j < people.length; j++) {
        if (i + 1 === people[j].id) found++
      }

      if (!found) {
        id = i + 1
        break
      } 
    }

    return id
  } 

  const addPerson = (event) => {
    event.preventDefault()
    const person = people.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (person && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...person, number: newNumber }

      personServices
        .update(changedPerson.id, changedPerson)
        .then(returnedPerson => {
          setPerson(people.map(person => person.id !== changedPerson.id ? person : changedPerson))
          
          setMessageType('success')
          setMessage(
            `Updated ${newName}'s phone number` 
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        })
        .catch(error => {
          setMessageType('error')
          setMessage(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000);
          setPerson(people.filter(p => p.id !== changedPerson.id))
        })

    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: getId()
      }

      console.log(newPerson.id)
      
      personServices
        .create(newPerson)
        .then(response => {
          setPerson(people.concat(newPerson))
          setMessageType('success')
          setMessage(
            `Added ${newName}` 
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000);
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

    if (window.confirm(`Delete ${people[id - 1].name}?`)) {
      personServices
        .deletePerson(id)
        .then(response => {
          personServices
            .getAll()
            .then(initialPeople => {
              setPerson(initialPeople)
            })
        })
    }
  }

  const peopleToShow = people.filter(person => 
    person.name.toLowerCase().includes(newSearch.toLowerCase())  
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification 
        message={message}
        messageType={messageType}
      />
      <Filter 
        newSearch={newSearch}
        handleSearchChange={handleSearchChange}
      />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <People 
        peopleToShow={peopleToShow} 
        peopleDeleter={handlePersonDelete}
      />
    </div>
  )
}

export default App
