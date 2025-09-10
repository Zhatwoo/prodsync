'use client';

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

const Table = ({
  data = [],
  columns = [],
  sortable = true,
  selectable = false,
  onSort,
  onSelect,
  onSelectAll,
  selectedRows = [],
  className,
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  // Handle row selection
  const handleRowSelect = (rowId) => {
    if (!selectable) return;
    
    const isSelected = selectedRows.includes(rowId);
    const newSelection = isSelected
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    onSelect?.(newSelection);
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (!selectable) return;
    
    const allSelected = selectedRows.length === data.length;
    onSelectAll?.(allSelected ? [] : data.map(row => row.id));
  };
  
  const allSelected = selectedRows.length === data.length && data.length > 0;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;
  
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table
          className={cn('min-w-full divide-y divide-slate-200', className)}
          {...props}
        >
          <thead className="bg-slate-50">
            <tr>
              {selectable && (
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
                    sortable && column.sortable !== false && 'cursor-pointer hover:bg-slate-100',
                    column.className
                  )}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <div className="flex flex-col">
                        <svg
                          className={cn(
                            'h-3 w-3',
                            sortConfig.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-blue-600'
                              : 'text-slate-400'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg
                          className={cn(
                            'h-3 w-3 -mt-1',
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-blue-600'
                              : 'text-slate-400'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedData.map((row, index) => {
              const isSelected = selectedRows.includes(row.id);
              
              return (
                <tr
                  key={row.id || index}
                  className={cn(
                    'hover:bg-slate-50 transition-colors',
                    isSelected && 'bg-blue-50',
                    row.className
                  )}
                >
                  {selectable && (
                    <td className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => handleRowSelect(row.id)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-6 py-4 whitespace-nowrap text-sm text-slate-900', column.cellClassName)}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No data</h3>
          <p className="mt-1 text-sm text-slate-500">No records found.</p>
        </div>
      )}
    </div>
  );
};

// Table Header component
const TableHeader = ({ children, className, ...props }) => (
  <thead className={cn('bg-slate-50', className)} {...props}>
    {children}
  </thead>
);

// Table Body component
const TableBody = ({ children, className, ...props }) => (
  <tbody className={cn('bg-white divide-y divide-slate-200', className)} {...props}>
    {children}
  </tbody>
);

// Table Row component
const TableRow = ({ children, className, ...props }) => (
  <tr className={cn('hover:bg-slate-50 transition-colors', className)} {...props}>
    {children}
  </tr>
);

// Table Cell component
const TableCell = ({ children, className, ...props }) => (
  <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-slate-900', className)} {...props}>
    {children}
  </td>
);

// Table Header Cell component
const TableHeaderCell = ({ children, className, ...props }) => (
  <th className={cn('px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider', className)} {...props}>
    {children}
  </th>
);

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell };
