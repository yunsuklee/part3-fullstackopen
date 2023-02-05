import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const Button = (props) => (
  <button className='formButton' onClick={props.handleShowForm}>
    <FontAwesomeIcon icon={faPlus} />
  </button>
)

export default Button