'use client';

import { useState, useEffect } from 'react';

export default function DailyReportModal({ isOpen, onClose }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyNotes, setHourlyNotes] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate hours for the day (8 AM to 6 PM)
  const workHours = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return {
      hour: hour,
      timeString: `${hour.toString().padStart(2, '0')}:00`,
      displayTime: hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`
    };
  });

  const handleNoteChange = (hour, note) => {
    setHourlyNotes(prev => ({
      ...prev,
      [hour]: note
    }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-16 left-190 z-50 w-96 max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
    }`} data-modal="daily-report">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Daily Report</h2>
              <p className="text-purple-100 mt-1">{formatDate(currentTime)}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {/* Current Time Display */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-gray-900 mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-700 font-medium">
                Current Time
              </div>
            </div>
          </div>

          {/* Excel-like Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Daily Report </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 w-20">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Activity / Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workHours.map((timeSlot, index) => (
                    <tr key={timeSlot.hour} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-3 py-2 text-xs font-medium text-gray-800 border-r border-gray-200 bg-gray-50">
                        {timeSlot.displayTime}
                      </td>
                      <td className="px-3 py-1">
                        <input
                          type="text"
                          value={hourlyNotes[timeSlot.hour] || ''}
                          onChange={(e) => handleNoteChange(timeSlot.hour, e.target.value)}
                          placeholder="Enter activity..."
                          className="w-full px-2 py-1 text-xs text-gray-900 border-0 bg-transparent focus:ring-0 focus:outline-none focus:bg-white focus:border focus:border-purple-300 rounded placeholder-gray-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
