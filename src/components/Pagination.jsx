import React, { useState } from "react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPerPageChange,
}) {
  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToNextPage = () =>
    onPageChange(currentPage + 1 <= totalPages ? currentPage + 1 : currentPage);
  const goToPreviousPage = () =>
    onPageChange(currentPage - 1 >= 1 ? currentPage - 1 : currentPage);

  const handleGoToPage = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-container">
      <button onClick={goToFirstPage} disabled={currentPage === 1}>
        {"<<"}
      </button>
      <button onClick={goToPreviousPage} disabled={currentPage === 1}>
        {"<"}
      </button>
      <button onClick={goToNextPage} disabled={currentPage === totalPages}>
        {">"}
      </button>
      <button onClick={goToLastPage} disabled={currentPage === totalPages}>
        {">>"}
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <span>Go to page:</span>
      <input type="number" value={currentPage} onChange={handleGoToPage} />
      <select onChange={(e) => onPerPageChange(Number(e.target.value))}>
        {[10, 20, 50, 100].map((perPage) => (
          <option key={perPage} value={perPage}>
            Per Page {perPage}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Pagination;
