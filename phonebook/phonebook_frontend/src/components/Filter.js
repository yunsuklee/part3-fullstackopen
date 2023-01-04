const Filter = ({ newSearch, handleSearchChange }) => (
  <div>
    filter shown with <input value={newSearch} onChange={handleSearchChange} />
  </div>
)

export default Filter
