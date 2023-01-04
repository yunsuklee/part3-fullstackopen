import Person from './Person'

const People = ({ peopleToShow, peopleDeleter }) => (
  <div>
    {peopleToShow.map(person =>
      <Person 
        key={person.id} 
        person={person} 
        deletePerson={peopleDeleter} 
      />
    )}
  </div>
)

export default People