'use client';

import { useState, useEffect } from 'react';

export default function AttendanceModal({ isOpen, onClose }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [notes, setNotes] = useState('');
  const [checkInTime, setCheckInTime] = useState(null);
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample departments and shifts
  const departments = [
    { id: '1', name: 'Human Resources' },
    { id: '2', name: 'Information Technology' },
    { id: '3', name: 'Finance & Accounting' },
    { id: '4', name: 'Marketing & Sales' },
    { id: '5', name: 'Operations' },
    { id: '6', name: 'Customer Service' },
    { id: '7', name: 'Administration' }
  ];

  const shifts = [
    { id: '1', name: 'Morning Shift (8:00 AM - 5:00 PM)' },
    { id: '2', name: 'Afternoon Shift (2:00 PM - 11:00 PM)' },
    { id: '3', name: 'Night Shift (10:00 PM - 7:00 AM)' },
    { id: '4', name: 'Flexible Hours' },
    { id: '5', name: 'Part-time' }
  ];

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    
    const newRecord = {
      id: Date.now(),
      checkIn: now,
      department: selectedDepartment,
      shift: selectedShift,
      notes: notes,
      status: 'present'
    };
    
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const handleCheckOut = () => {
    if (checkInTime) {
      const now = new Date();
      const duration = now - checkInTime;
      const hours = duration / (1000 * 60 * 60);
      
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.status === 'present' 
            ? { ...record, checkOut: now, duration: hours, status: 'completed' }
            : record
        )
      );
      
      setTotalWorkDays(prev => prev + 1);
      setIsCheckedIn(false);
      setCheckInTime(null);
      setSelectedDepartment('');
      setSelectedShift('');
      setNotes('');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
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
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-80 max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
    }`} style={{ marginLeft: '-115px' }} data-modal="timecard">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Employee Attendance</h2>
              <p className="text-green-100 mt-1 text-sm">{formatDate(currentTime)}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 transition-colors"
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

          {/* Check In/Out Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Attendance Tracking</h3>
            
            <div className="grid grid-cols-1 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={isCheckedIn}
                >
                  <option value="">Select Department</option>
                  {departments.map(department => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Shift
                </label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={isCheckedIn}
                >
                  <option value="">Select Shift</option>
                  {shifts.map(shift => (
                    <option key={shift.id} value={shift.name}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-800 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your attendance..."
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-500"
                rows={2}
                disabled={isCheckedIn}
              />
            </div>

            <div className="flex justify-center">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={!selectedDepartment || !selectedShift}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Check In</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Check Out</span>
                </button>
              )}
            </div>

            {isCheckedIn && checkInTime && (
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-700 font-medium">Checked in at:</div>
                <div className="text-sm font-bold text-green-600">
                  {formatTime(checkInTime)}
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">
                  Duration: {formatDuration((currentTime - checkInTime) / (1000 * 60 * 60))}
                </div>
              </div>
            )}
          </div>

          {/* Today's Summary */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Today's Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {totalWorkDays}
                </div>
                <div className="text-xs text-gray-700 font-medium">Work Days</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {attendanceRecords.filter(record => record.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-700 font-medium">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {isCheckedIn ? '1' : '0'}
                </div>
                <div className="text-xs text-gray-700 font-medium">Present</div>
              </div>
            </div>
          </div>

          {/* Attendance Records History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Recent Records</h3>
            </div>
            <div className="overflow-x-auto">
              {attendanceRecords.length === 0 ? (
                <div className="p-4 text-center text-gray-600">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-medium">No attendance records yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {attendanceRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">{record.department}</div>
                        <div className="text-xs text-gray-600 truncate">{record.shift}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-900">
                          {record.duration ? formatDuration(record.duration) : 
                           isCheckedIn && record.status === 'present' ? 
                           formatDuration((currentTime - record.checkIn) / (1000 * 60 * 60)) : '-'}
                        </div>
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.status === 'present' ? 'Present' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
