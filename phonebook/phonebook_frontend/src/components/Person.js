import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Person = ({ person, deletePerson }) => {
  return (
    <li className="person">
      <FontAwesomeIcon icon={faUser} />
      <p>
        <span>
          {person.name}
        </span>
        <span>
          {person.number}
        </span>
      </p>
      <button onClick={() => deletePerson(person.id)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </li>
  )
}

export default Person