'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

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
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false);
  const [currentAttendanceRecord, setCurrentAttendanceRecord] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch departments and attendance records from Firebase
  useEffect(() => {
    if (isOpen) {
      fetchData();
      checkCurrentUserStatus();
    }
  }, [isOpen]);

  // Check if current user has an active check-in session
  const checkCurrentUserStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = collection(db, 'attendance');
      const attendanceQuery = query(
        attendanceRef, 
        where('date', '==', today)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      if (!attendanceSnapshot.empty) {
        // Find the most recent record for today
        let mostRecentRecord = null;
        let mostRecentTime = null;
        
        attendanceSnapshot.forEach((doc) => {
          const data = doc.data();
          const recordTime = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || 0);
          
          if (!mostRecentTime || recordTime > mostRecentTime) {
            mostRecentTime = recordTime;
            mostRecentRecord = { id: doc.id, ...data };
          }
        });
        
        if (mostRecentRecord) {
          setCurrentAttendanceRecord(mostRecentRecord);
          
          // Check if employee has already checked in today
          if (mostRecentRecord.checkIn) {
            setHasCheckedInToday(true);
            setSelectedEmployee(mostRecentRecord.employeeId);
            setSelectedDepartment(mostRecentRecord.department);
            setSelectedShift(mostRecentRecord.shift);
            setNotes(mostRecentRecord.notes || '');
          }
          
          // Check if employee has already checked out today
          if (mostRecentRecord.checkOut) {
            setHasCheckedOutToday(true);
          }
          
          // If status is Present, set as checked in
          if (mostRecentRecord.status === 'Present') {
            setIsCheckedIn(true);
            setCheckInTime(mostRecentRecord.checkIn ? new Date(`2000-01-01T${mostRecentRecord.checkIn}`) : new Date());
          }
        }
      }
    } catch (err) {
      console.error('Error checking current user status:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch departments from Firebase
      const departmentsRef = collection(db, 'departments');
      const departmentsSnapshot = await getDocs(departmentsRef);
      
      const departmentsData = [];
      departmentsSnapshot.forEach((doc) => {
        departmentsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setDepartments(departmentsData);

      // Fetch employees from Firebase
      const employeesRef = collection(db, 'employees');
      const employeesSnapshot = await getDocs(employeesRef);
      
      const employeesData = [];
      employeesSnapshot.forEach((doc) => {
        employeesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setEmployees(employeesData);

      // Fetch today's attendance records using API
      const today = new Date().toISOString().split('T')[0];
      const attendanceResponse = await fetch(`/api/attendance?date=${today}`);
      
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        const processedData = attendanceData.map(data => ({
          ...data,
          checkIn: data.checkIn ? new Date(`2000-01-01T${data.checkIn}`) : null,
          checkOut: data.checkOut ? new Date(`2000-01-01T${data.checkOut}`) : null
        }));
        
        setAttendanceRecords(processedData);
        setTotalWorkDays(processedData.filter(record => record.status === 'completed').length);
      } else {
        console.error('Failed to fetch attendance records');
        setAttendanceRecords([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const shifts = [
    { id: '1', name: 'Morning Shift (8:00 AM - 5:00 PM)' },
    { id: '2', name: 'Afternoon Shift (2:00 PM - 11:00 PM)' },
    { id: '3', name: 'Night Shift (10:00 PM - 7:00 AM)' },
    { id: '4', name: 'Flexible Hours' },
    { id: '5', name: 'Part-time' }
  ];

  const handleCheckIn = async () => {
    try {
      // Check if employee has already checked in today
      if (hasCheckedInToday) {
        setError('You have already checked in today. Please contact HR if you need to modify your attendance.');
        return;
      }

      const now = new Date();
      setCheckInTime(now);
      setIsCheckedIn(true);
      setHasCheckedInToday(true);
      
      const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
      const today = new Date().toISOString().split('T')[0];
      
      // Create new attendance record
      const attendanceData = {
        employeeId: selectedEmployee,
        employeeName: selectedEmployeeData?.name || 'Unknown Employee',
        date: today,
        checkIn: now.toTimeString().slice(0, 5),
        checkOut: null,
        department: selectedDepartment,
        shift: selectedShift,
        notes: notes,
        status: 'Present',
        lateMinutes: calculateLateMinutes(now.toTimeString().slice(0, 5)),
        overtimeHours: 0
      };

      // Use API route instead of direct Firebase client operation
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check in');
      }

      const result = await response.json();
      setCurrentAttendanceRecord({ id: result.id, ...attendanceData });
      
      // Refresh the data to show updated records
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Error checking in:', err);
      setError(err.message || 'Failed to check in');
      setIsCheckedIn(false);
      setCheckInTime(null);
      setHasCheckedInToday(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      // Check if employee has already checked out today
      if (hasCheckedOutToday) {
        setError('You have already checked out today. Please contact HR if you need to modify your attendance.');
        return;
      }

      if (!currentAttendanceRecord) {
        setError('No active attendance record found. Please check in first.');
        return;
      }

      const now = new Date();
      const checkInTime = currentAttendanceRecord.checkIn ? new Date(`2000-01-01T${currentAttendanceRecord.checkIn}`) : new Date();
      const duration = now - checkInTime;
      const hours = duration / (1000 * 60 * 60);
      
      const attendanceData = {
        checkOut: now.toTimeString().slice(0, 5),
        duration: Math.round(hours * 100) / 100,
        status: 'Completed',
        overtimeHours: calculateOvertimeHours(now.toTimeString().slice(0, 5))
      };

      // Use API route instead of direct Firebase client operation
      const response = await fetch(`/api/attendance/${currentAttendanceRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check out');
      }
      
      setHasCheckedOutToday(true);
      setIsCheckedIn(false);
      setCheckInTime(null);
      setTotalWorkDays(prev => prev + 1);
      
      // Refresh the data to show updated records
      fetchData();
      setError(null);
    } catch (err) {
      console.error('Error checking out:', err);
      setError(err.message || 'Failed to check out');
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

  const calculateLateMinutes = (checkInTime) => {
    if (!checkInTime) return 0;
    const checkIn = new Date(`2000-01-01T${checkInTime}`);
    const expectedTime = new Date(`2000-01-01T09:00`); // 9 AM expected
    const diffMs = checkIn - expectedTime;
    return diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : 0;
  };

  const calculateOvertimeHours = (checkOutTime) => {
    if (!checkOutTime) return 0;
    const checkOut = new Date(`2000-01-01T${checkOutTime}`);
    const expectedTime = new Date(`2000-01-01T18:00`); // 6 PM expected
    const diffMs = checkOut - expectedTime;
    return diffMs > 0 ? Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100 : 0;
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
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-90 max-w-md sm:max-w-lg lg:max-w-xl max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
     }`} style={{ marginLeft: '-15%' }} data-modal="timecard">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Employee Attendance</h2>
              <p className="text-green-100 mt-1 text-sm">{formatDate(currentTime)}</p>
              <p className="text-green-200 mt-1 text-xs">✓ Sessions are saved automatically</p>
              <p className="text-green-200 mt-1 text-xs">⚠️ One check-in/check-out per day only</p>
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

        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-800 text-sm">{error}</div>
              <button 
                onClick={fetchData}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Employee *
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={isCheckedIn || loading}
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={isCheckedIn || loading}
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
                  disabled={isCheckedIn || loading}
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
                disabled={isCheckedIn || loading}
              />
            </div>

            <div className="flex justify-center">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={!selectedEmployee || !selectedDepartment || !selectedShift || loading || hasCheckedInToday}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
                    hasCheckedInToday 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hasCheckedInToday ? 'Already Checked In' : 'Check In'}</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  disabled={hasCheckedOutToday}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
                    hasCheckedOutToday 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{hasCheckedOutToday ? 'Already Checked Out' : 'Check Out'}</span>
                </button>
              )}
            </div>

            {/* Attendance Status Display */}
            <div className="mt-3 text-center">
              {hasCheckedInToday && currentAttendanceRecord && (
                <div className="mb-2">
                  <div className="text-xs text-gray-700 font-medium">Checked in at:</div>
                  <div className="text-sm font-bold text-green-600">
                    {currentAttendanceRecord.checkIn}
                  </div>
                  {currentAttendanceRecord.checkOut && (
                    <>
                      <div className="text-xs text-gray-700 font-medium mt-1">Checked out at:</div>
                      <div className="text-sm font-bold text-red-600">
                        {currentAttendanceRecord.checkOut}
                      </div>
                      <div className="text-xs text-gray-600 font-medium mt-1">
                        Total Duration: {currentAttendanceRecord.duration ? `${currentAttendanceRecord.duration}h` : '-'}
                      </div>
                    </>
                  )}
                  {!currentAttendanceRecord.checkOut && isCheckedIn && (
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      Duration: {formatDuration((currentTime - checkInTime) / (1000 * 60 * 60))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Status Badges */}
              <div className="flex justify-center space-x-2">
                {hasCheckedInToday && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Checked In
                  </div>
                )}
                {hasCheckedOutToday && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Checked Out
                  </div>
                )}
                {isCheckedIn && !hasCheckedOutToday && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Session Active
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Today's Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {attendanceRecords.filter(record => record.status === 'Completed').length}
                </div>
                <div className="text-xs text-gray-700 font-medium">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {attendanceRecords.filter(record => record.status === 'Present').length}
                </div>
                <div className="text-xs text-gray-700 font-medium">Present</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {employees.length - attendanceRecords.length}
                </div>
                <div className="text-xs text-gray-700 font-medium">Absent</div>
              </div>
            </div>
          </div>

          {/* All Employees Status */}
          <div className="bg-white border border-gray-200 rounded-lg mb-4">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">All Employees Status Today</h3>
            </div>
            <div className="p-2 sm:p-3 max-h-32 sm:max-h-40 overflow-y-auto">
              {employees.length === 0 ? (
                <div className="p-2 text-center text-gray-600">
                  <p className="text-xs font-medium">No employees found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {employees.slice(0, 10).map((employee) => {
                    const attendanceRecord = attendanceRecords.find(record => record.employeeId === employee.id);
                    const status = attendanceRecord ? attendanceRecord.status : 'Absent';
                    return (
                      <div key={employee.id} className="flex items-center justify-between py-1 sm:py-2 px-2 sm:px-3 rounded text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate text-xs sm:text-sm">{employee.name}</div>
                          <div className="text-gray-500 truncate text-xs">{employee.department}</div>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${
                          status === 'Present' ? 'bg-green-100 text-green-800' :
                          status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          status === 'Absent' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Attendance Records History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Recent Check-in/Check-out Records</h3>
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
                <div className="p-2 sm:p-3">
                  {attendanceRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{record.employeeName}</div>
                        <div className="text-xs text-gray-600 truncate">{record.department} • {record.shift}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-900">
                          {record.duration ? formatDuration(record.duration) : 
                           isCheckedIn && record.status === 'Present' ? 
                           formatDuration((currentTime - record.checkIn) / (1000 * 60 * 60)) : '-'}
                        </div>
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold rounded-full ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : record.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status === 'Present' ? 'Present' : 
                           record.status === 'Completed' ? 'Completed' : record.status}
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
