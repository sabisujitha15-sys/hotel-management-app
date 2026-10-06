import React from 'react';

export default function Pagination({ total, limit, offset, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (page) => {
    const newOffset = (page - 1) * limit;
    onPageChange(newOffset);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>‹ Prev</button>
      {pages.map((p) => (
        <button key={p} className={p === currentPage ? 'active' : ''} onClick={() => goToPage(p)}>
          {p}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next ›</button>
    </div>
  );
}
