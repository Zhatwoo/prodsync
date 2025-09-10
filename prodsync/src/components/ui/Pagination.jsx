'use client';

import { useMemo } from 'react';
import { cn } from '../../lib/utils';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showInfo = true,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className,
  ...props
}) => {
  // Calculate pagination info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };
  
  const handlePageSizeChange = (newSize) => {
    onPageSizeChange?.(newSize);
  };
  
  if (totalPages <= 1 && !showSizeChanger) {
    return null;
  }
  
  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-slate-700">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Page size changer */}
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 rounded border border-slate-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-700">per page</span>
          </div>
        )}
        
        {/* Pagination controls */}
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'h-8 w-8 rounded border border-slate-300 bg-white text-sm font-medium transition-colors',
              'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
            )}
            aria-label="Previous page"
          >
            <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-sm text-slate-500"
                >
                  ...
                </span>
              );
            }
            
            const isCurrentPage = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  'h-8 w-8 rounded border text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isCurrentPage
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                )}
                aria-label={`Page ${page}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
          
          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'h-8 w-8 rounded border border-slate-300 bg-white text-sm font-medium transition-colors',
              'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
            )}
            aria-label="Next page"
          >
            <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple pagination for basic use cases
const SimplePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  ...props
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={cn('flex items-center justify-center space-x-4', className)} {...props}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          'px-4 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium transition-colors',
          'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
      >
        Previous
      </button>
      
      <span className="text-sm text-slate-700">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          'px-4 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium transition-colors',
          'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
      >
        Next
      </button>
    </div>
  );
};

export { Pagination, SimplePagination };
