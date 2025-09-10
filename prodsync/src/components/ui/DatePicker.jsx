'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date...',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  format = 'MM/dd/yyyy',
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const datePickerRef = useRef(null);
  
  const hasError = !!error;
  const datePickerId = props.id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return format
      .replace('MM', month)
      .replace('dd', day)
      .replace('yyyy', year);
  };
  
  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };
  
  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };
  
  // Handle month navigation
  const handleMonthChange = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  const calendarDays = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={datePickerId}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={datePickerRef}>
        <button
          id={datePickerId}
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
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${datePickerId}-error` : helperText ? `${datePickerId}-helper` : undefined
          }
          {...props}
        >
          <span className={cn(
            'truncate',
            !selectedDate && 'text-slate-400'
          )}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          
          <svg
            className={cn(
              'h-4 w-4 text-slate-400 transition-transform',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-300 bg-white shadow-lg">
            {/* Calendar Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <button
                type="button"
                onClick={() => handleMonthChange(-1)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className="text-sm font-medium text-slate-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="p-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                  const isDisabled = isDateDisabled(date);
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={cn(
                        'h-8 w-8 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                        !isCurrentMonth && 'text-slate-400',
                        isCurrentMonth && 'text-slate-900',
                        isToday && 'bg-blue-100 text-blue-600 font-medium',
                        isSelected && 'bg-blue-500 text-white font-medium',
                        !isSelected && !isToday && isCurrentMonth && 'hover:bg-slate-100',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Today button */}
            <div className="border-t border-slate-200 p-3">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
      
      {hasError && (
        <p id={`${datePickerId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !hasError && (
        <p id={`${datePickerId}-helper`} className="mt-1 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export { DatePicker };
