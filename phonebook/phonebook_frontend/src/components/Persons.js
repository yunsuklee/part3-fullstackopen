import React from 'react'
import Person from './Person'

const Persons = ({ personsToShow, personsDeleter }) => (
  <div className="persons">
    {personsToShow.map(person =>
      <Person
        key={person.id}
        person={person}
        deletePerson={personsDeleter}
      />
    )}
  </div>
)

export default Persons