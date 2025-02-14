export default function SearchBar({ search, handleSearch }) {
    return (
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
    );
  }
  