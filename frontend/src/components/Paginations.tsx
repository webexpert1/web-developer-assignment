import React from "react";

/**
 * @typedef {object} PaginationProps
 * @property {number} currentPage - The currently active page index (0-based).
 * @property {number} totalPages - The total number of pages available (e.g., if there are 100 items and 10 per page, totalPages would be 10).
 * @property {(page: number) => void} onPageChange - Callback function executed when a page button is clicked, receiving the new 0-based page index.
 */

/**
 * A reusable Pagination component for navigating through pages of data.
 *
 * This component displays page numbers, an active page indicator,
 * and 'Previous'/'Next' buttons. It implements a smart truncation logic
 * (using ellipses '...') to only show a maximum of 5 visible page numbers
 * while keeping the current page centered, and always showing the first and last page.
 *
 * @param {PaginationProps} props - The props object for the component.
 * @returns {JSX.Element} The Pagination control interface.
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 1) {
      end = Math.min(totalPages - 1, maxVisible - 1);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(0, totalPages - maxVisible);
    }

    // First page with dots
    if (start > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => onPageChange(0)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          1
        </button>
      );

      if (start > 1) {
        pages.push(
          <span key="dots-start" className="px-2">
            …
          </span>
        );
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 text-sm border rounded ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Last page + dots
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        pages.push(
          <span key="dots-end" className="px-2">
            …
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-end mt-6 space-x-2">

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        ‹ Previous
      </button>

      {renderPages()}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
