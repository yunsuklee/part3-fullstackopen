import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Filter = ({ newSearch, handleSearchChange }) => (
  <div className='filter'>
    <FontAwesomeIcon icon={faMagnifyingGlass} />
    <input
      placeholder='Search'
      value={newSearch}
      onChange={handleSearchChange}
    />
  </div>
)

export default Filter
