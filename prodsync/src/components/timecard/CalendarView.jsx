'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CalendarView = ({ timeEntries, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, timeEntries]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEntries = getEntriesForDate(date);
      const totalHours = calculateTotalHoursForDay(dayEntries);
      
      days.push({
        date,
        day,
        entries: dayEntries,
        totalHours,
        hasEntries: dayEntries.length > 0,
        isToday: isToday(date),
        isSelected: isSameDate(date, selectedDate)
      });
    }

    setCalendarDays(days);
  };

  const getEntriesForDate = (date) => {
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.clockIn);
      return isSameDate(entryDate, date);
    });
  };

  const calculateTotalHoursForDay = (entries) => {
    return entries.reduce((total, entry) => {
      if (entry.clockOut) {
        const hours = (entry.clockOut.getTime() - entry.clockIn.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0);
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDate(date, today);
  };

  const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 border border-gray-200 rounded-md cursor-pointer transition-colors
                ${day ? 'hover:bg-gray-50' : 'bg-gray-50'}
                ${day?.isToday ? 'bg-blue-50 border-blue-200' : ''}
                ${day?.isSelected ? 'bg-blue-100 border-blue-300' : ''}
                ${day?.hasEntries ? 'bg-green-50 border-green-200' : ''}
              `}
              onClick={() => day && onDateSelect(day.date)}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <div className={`
                    text-sm font-medium mb-1
                    ${day.isToday ? 'text-blue-600' : 'text-gray-900'}
                    ${day.isSelected ? 'text-blue-800' : ''}
                  `}>
                    {day.day}
                  </div>
                  
                  {day.hasEntries && (
                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-green-600 font-medium">
                        {day.totalHours.toFixed(1)}h
                      </div>
                      {day.entries.slice(0, 2).map((entry, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          {entry.clockIn.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {entry.clockOut ? 
                            entry.clockOut.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Active'
                          }
                        </div>
                      ))}
                      {day.entries.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{day.entries.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Has Time Entries</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
