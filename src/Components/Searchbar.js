import { useRef } from "react";


export default function SearchBar({ search, setSearch }) {
  const debounceTimeoutRef = useRef(null);

  const handleSearch = (value) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
    </div>
  );
}
