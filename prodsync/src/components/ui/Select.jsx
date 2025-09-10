'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

const Select = forwardRef(({
  className,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  clearable = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchRef = useRef(null);
  
  const hasError = !!error;
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;
  
  // Get selected option(s)
  const selectedOptions = multiple
    ? options.filter(option => value?.includes(option.value))
    : options.filter(option => option.value === value);
  
  const selectedLabel = multiple
    ? selectedOptions.length > 0
      ? `${selectedOptions.length} selected`
      : placeholder
    : selectedOptions[0]?.label || placeholder;
  
  // Handle option selection
  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value || [];
      const isSelected = newValue.includes(option.value);
      const updatedValue = isSelected
        ? newValue.filter(v => v !== option.value)
        : [...newValue, option.value];
      onChange?.(updatedValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };
  
  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        if (searchable && searchRef.current) {
          searchRef.current.focus();
        }
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        setSearchTerm('');
        break;
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          id={selectId}
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          ref={ref}
          {...props}
        >
          <span className={cn(
            'truncate',
            !selectedOptions.length && 'text-slate-400'
          )}>
            {selectedLabel}
          </span>
          
          <div className="flex items-center space-x-2">
            {clearable && (multiple ? value?.length > 0 : value) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
                aria-label="Clear selection"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <svg
              className={cn(
                'h-4 w-4 text-slate-400 transition-transform',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-300 bg-white shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-slate-200">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-slate-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = multiple
                    ? value?.includes(option.value)
                    : value === option.value;
                  const isFocused = index === focusedIndex;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm transition-colors',
                        'hover:bg-slate-100 focus:bg-slate-100 focus:outline-none',
                        isSelected && 'bg-blue-50 text-blue-600',
                        isFocused && 'bg-slate-100',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !option.disabled && handleSelect(option)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {hasError && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !hasError && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };
