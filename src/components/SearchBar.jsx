import React from 'react';

const SearchBar = ({ onSearchChange }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search articles..."
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
)

export default SearchBar;