'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DailyReportModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyNotes, setHourlyNotes] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleSubmit = () => {
    if (!user) {
      alert('Please log in to submit a daily report.');
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
      
      // Prepare report data using authenticated user information
      const reportData = {
        employeeId: user.uid,
        employeeName: user.displayName || user.fullName || user.email || 'Unknown User',
        department: user.department || 'General',
        position: user.position || user.jobTitle || 'Employee',
        reportDate: currentTime.toISOString().split('T')[0], // YYYY-MM-DD format
        hourlyNotes: hourlyNotes,
        tasks: [],
        achievements: [],
        challenges: [],
        tomorrowPlans: [],
        notes: '',
        attachments: []
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
              disabled={!hasNotes || !user}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                hasNotes && user
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {!user ? 'Please Log In' : 'Submit Report'}
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
                Are you sure you want to submit your daily report for <strong>{formatDate(currentTime)}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
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
    </div>
  );
}
