'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';

export default function DailyReportModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyNotes, setHourlyNotes] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [existingReports, setExistingReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employees and reports when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchExistingReports();
    }
  }, [isOpen]);

  // Fetch employees from Firebase Firestore (same as EmployeeList.jsx)
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const employeesData = [];
      querySnapshot.forEach((doc) => {
        const empData = doc.data();
        employeesData.push({
          uid: doc.id, // Use document ID as uid
          id: doc.id,
          firstName: empData.name?.split(' ')[0] || 'Unknown',
          lastName: empData.name?.split(' ').slice(1).join(' ') || 'Employee',
          name: empData.name,
          email: empData.email || '',
          department: empData.department || 'General',
          position: empData.position || 'Employee',
          employeeId: doc.id, // Use document ID as employeeId
          status: empData.status || 'active',
          phone: empData.phone || '',
          joinDate: empData.joinDate || '',
          salary: empData.salary || '',
          address: empData.address || '',
          emergencyContact: empData.emergencyContact || '',
          emergencyPhone: empData.emergencyPhone || '',
          skills: empData.skills || [],
          notes: empData.notes || '',
          avatar: empData.avatar || empData.name?.charAt(0) || 'E'
        });
      });
      
      // Filter out employees with missing or duplicate UIDs
      const uniqueEmployees = employeesData.filter((emp, index, arr) => 
        emp.uid && arr.findIndex(e => e.uid === emp.uid) === index
      );
      
      setEmployees(uniqueEmployees);
      
      // Auto-select current user if available
      if (user && uniqueEmployees.length > 0) {
        const currentUserEmployee = uniqueEmployees.find(emp => 
          emp.uid === user.uid || 
          emp.email === user.email ||
          emp.employeeId === user.uid
        );
        if (currentUserEmployee) {
          setSelectedEmployee(currentUserEmployee);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Final fallback to current user
      if (user) {
        setSelectedEmployee({
          uid: user.uid,
          firstName: user.firstName || user.displayName?.split(' ')[0] || 'User',
          lastName: user.lastName || user.displayName?.split(' ')[1] || '',
          email: user.email,
          department: user.department || 'General',
          position: user.position || user.jobTitle || 'Employee'
        });
      }
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Fetch existing daily reports
  const fetchExistingReports = async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetch('/api/daily-reports');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setExistingReports(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching existing reports:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

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

  const handleSubmit = () => {
    if (!user) {
      alert('Please log in to submit a daily report.');
      return;
    }
    if (!selectedEmployee) {
      alert('Please select an employee for this daily report.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      // Prepare report data using selected employee information
      const reportData = {
        employeeId: selectedEmployee.uid,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`.trim(),
        department: selectedEmployee.department || 'General',
        position: selectedEmployee.position || 'Employee',
        reportDate: currentTime.toISOString().split('T')[0], // YYYY-MM-DD format
        hourlyNotes: hourlyNotes,
        tasks: [],
        achievements: [],
        challenges: [],
        tomorrowPlans: [],
        notes: '',
        attachments: [],
        // Additional fields for audit identification
        submittedBy: user.uid, // Who submitted the report
        submittedByName: user.displayName || user.fullName || user.email,
        employeeEmail: selectedEmployee.email,
        reportType: 'daily',
        auditTrail: {
          createdAt: new Date().toISOString(),
          submittedBy: user.uid,
          employeeId: selectedEmployee.uid,
          reportDate: currentTime.toISOString().split('T')[0]
        }
      };
      
      // Submit to API
      const response = await fetch('/api/daily-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        alert('Daily report submitted successfully!');
        
        // Reset form and close modal
        setHourlyNotes({});
        setShowConfirmModal(false);
        handleClose();
        
        // Optionally trigger a refresh of the AppSuite data
        if (window.refreshAppSuiteData) {
          window.refreshAppSuiteData();
        }
      } else {
        throw new Error(result.error || 'Failed to submit report');
      }
      
    } catch (error) {
      console.error('Error submitting daily report:', error);
      alert(`Error submitting daily report: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Delete daily report functionality
  const handleDeleteReport = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/daily-reports/${reportToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Daily report deleted successfully!');
        
        // Refresh the reports list
        await fetchExistingReports();
        
        // Close delete modal
        setShowDeleteModal(false);
        setReportToDelete(null);
        
        // Optionally trigger a refresh of the AppSuite data
        if (window.refreshAppSuiteData) {
          window.refreshAppSuiteData();
        }
      } else {
        throw new Error(result.error || 'Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting daily report:', error);
      alert(`Error deleting daily report: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const hasNotes = Object.values(hourlyNotes).some(note => note.trim() !== '');

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
              {user && (
                <div className="mt-2 text-sm text-purple-200">
                  <span className="font-medium">Submitted by:</span> {user.displayName || user.fullName || user.email}
                  {user.department && <span className="ml-2">• {user.department}</span>}
                </div>
              )}
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
          {/* Employee Selection */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Select Employee for Daily Report
            </h3>
            {isLoadingEmployees ? (
              <div className="flex items-center justify-center py-4">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-sm text-gray-600">Loading employees...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={selectedEmployee?.uid || ''}
                  onChange={(e) => {
                    const employee = employees.find(emp => emp.uid === e.target.value);
                    setSelectedEmployee(employee);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">Select an employee...</option>
                  {employees.map((employee, index) => (
                    <option key={employee.uid || `employee-${index}`} value={employee.uid} className="text-gray-900">
                      {employee.firstName} {employee.lastName} - {employee.department} ({employee.position}) {employee.employeeId ? `[ID: ${employee.employeeId}]` : ''}
                    </option>
                  ))}
                </select>
                {selectedEmployee && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Selected:</span> {selectedEmployee.firstName} {selectedEmployee.lastName}
                      {selectedEmployee.employeeId && <span className="ml-2 text-blue-600">[ID: {selectedEmployee.employeeId}]</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedEmployee.department} • {selectedEmployee.position} • {selectedEmployee.email}
                    </div>
                    {selectedEmployee.status && (
                      <div className="text-xs text-green-600 mt-1">
                        Status: {selectedEmployee.status}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Existing Reports Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Existing Daily Reports
            </h3>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-4">
                <svg className="animate-spin h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-sm text-gray-600">Loading reports...</span>
              </div>
            ) : existingReports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No daily reports found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {report.employeeName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.department} • {report.reportDate}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {report.id.substring(0, 8)}...
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                        <button
                          onClick={() => handleDeleteReport(report)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete Report"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {existingReports.length > 5 && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500">
                      Showing 5 of {existingReports.length} reports
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

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

          {/* Submit Button */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasNotes || !user || !selectedEmployee}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                hasNotes && user && selectedEmployee
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {!user ? 'Please Log In' : !selectedEmployee ? 'Select Employee' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Submission</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to submit a daily report for <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong> on <strong>{formatDate(currentTime)}</strong>?
              </p>
              {selectedEmployee && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Employee Details:</div>
                    <div className="mt-1 text-xs text-gray-600">
                      <div>Name: {selectedEmployee.firstName} {selectedEmployee.lastName}</div>
                      <div>Department: {selectedEmployee.department}</div>
                      <div>Position: {selectedEmployee.position}</div>
                      <div>Email: {selectedEmployee.email}</div>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-3">
                This action cannot be undone. Make sure all your entries are correct.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Confirm Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reportToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Daily Report</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the daily report for <strong>{reportToDelete.employeeName}</strong> on <strong>{reportToDelete.reportDate}</strong>?
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-700">
                  <div className="font-medium">Report Details:</div>
                  <div className="mt-1 text-xs text-red-600">
                    <div>Employee: {reportToDelete.employeeName}</div>
                    <div>Department: {reportToDelete.department}</div>
                    <div>Date: {reportToDelete.reportDate}</div>
                    <div>Status: {reportToDelete.status}</div>
                    <div>ID: {reportToDelete.id}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-red-500 mt-3">
                <strong>Warning:</strong> This action cannot be undone. The report will be permanently deleted.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReport}
                disabled={isDeleting}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${
                  isDeleting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
