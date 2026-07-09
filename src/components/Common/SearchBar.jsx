import React, { useState } from 'react';
import './Common.css';

const SearchBar = ({ placeholder, onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={handleChange}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;