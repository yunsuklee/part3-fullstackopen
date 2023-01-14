import React from 'react'

const PersonForm = (props) => (
  <form onSubmit={props.addPerson} className="personForm">
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">ADD</button>
    </div>
  </form>
)

export default PersonForm