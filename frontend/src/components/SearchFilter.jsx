import React, { useState } from 'react';

export default function SearchFilter({ onSearch }) {
  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (ev) => {
    ev.preventDefault();
    onSearch({ title, minPrice, maxPrice });
  };

  return (
    <form className="search-filter" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by hotel title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}
