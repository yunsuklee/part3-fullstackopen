const Filter = ({ newSearch, handleSearchChange }) => (
  <div>
    Search: <input value={newSearch} onChange={handleSearchChange} />
  </div>
)

export default Filter
