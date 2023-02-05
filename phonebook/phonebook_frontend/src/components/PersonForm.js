import React from 'react'

const PersonForm = (props) => (
  <div className={props.showForm}>
    <form onSubmit={props.addPerson}>
      <div>
        <input
          value={props.newName}
          onChange={props.handleNameChange}
          placeholder='Name'
        />
      </div>
      <div>
        <input
          value={props.newNumber}
          onChange={props.handleNumberChange}
          placeholder='Number'
        />
      </div>
      <div className='formButtonContainer'>
        <button type="submit">ADD</button>
      </div>
    </form>
  </div>
)

export default PersonForm