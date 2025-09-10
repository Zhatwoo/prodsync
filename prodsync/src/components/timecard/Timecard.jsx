'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, DatePicker, Select, Input, useToast } from '../ui';
import { ClockIcon, PlayIcon, StopIcon, PencilIcon, CalendarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { hasRole } from '../../lib/roles';
import CalendarView from './CalendarView';

const Timecard = ({ user, userRole }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('today'); // 'today', 'calendar', 'week'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const { toast } = useToast();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load time entries on component mount
  useEffect(() => {
    loadTimeEntries();
    checkCurrentStatus();
  }, [selectedDate]);

  const loadTimeEntries = async () => {
    try {
      // Mock API call - in real app, this would fetch from your backend
      const mockEntries = generateMockTimeEntries(selectedDate);
      setTimeEntries(mockEntries);
    } catch (error) {
      console.error('Error loading time entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load time entries',
        variant: 'destructive'
      });
    }
  };

  const checkCurrentStatus = async () => {
    try {
      // Mock API call to check if user is currently clocked in
      const mockStatus = {
        isClockedIn: Math.random() > 0.5,
        currentShift: Math.random() > 0.5 ? {
          id: 'shift-1',
          clockIn: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          breakStart: null,
          breakEnd: null,
          clockOut: null
        } : null
      };
      
      setIsClockedIn(mockStatus.isClockedIn);
      setCurrentShift(mockStatus.currentShift);
    } catch (error) {
      console.error('Error checking current status:', error);
    }
  };

  const handleClockIn = async () => {
    setIsLoading(true);
    
    // Optimistic UI update
    const optimisticShift = {
      id: `shift-${Date.now()}`,
      clockIn: new Date(),
      breakStart: null,
      breakEnd: null,
      clockOut: null
    };
    
    setIsClockedIn(true);
    setCurrentShift(optimisticShift);
    
    try {
      const response = await fetch('/api/time/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          timestamp: new Date().toISOString(),
          timezone: timezone
        }),
      });

      if (!response.ok) {
        throw new Error('Clock-in failed');
      }

      const result = await response.json();
      setCurrentShift(result.shift);
      
      toast({
        title: 'Clocked In',
        description: `Successfully clocked in at ${formatTime(new Date())}`,
        variant: 'default'
      });
    } catch (error) {
      // Revert optimistic update
      setIsClockedIn(false);
      setCurrentShift(null);
      
      toast({
        title: 'Error',
        description: 'Failed to clock in. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentShift) return;
    
    setIsLoading(true);
    
    // Optimistic UI update
    const optimisticShift = { ...currentShift, clockOut: new Date() };
    setCurrentShift(optimisticShift);
    setIsClockedIn(false);
    
    try {
      const response = await fetch('/api/time/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shiftId: currentShift.id,
          timestamp: new Date().toISOString(),
          timezone: timezone
        }),
      });

      if (!response.ok) {
        throw new Error('Clock-out failed');
      }

      const result = await response.json();
      
      // Add completed shift to time entries
      setTimeEntries(prev => [result.shift, ...prev]);
      setCurrentShift(null);
      
      toast({
        title: 'Clocked Out',
        description: `Successfully clocked out at ${formatTime(new Date())}`,
        variant: 'default'
      });
    } catch (error) {
      // Revert optimistic update
      setCurrentShift(prev => prev ? { ...prev, clockOut: null } : null);
      setIsClockedIn(true);
      
      toast({
        title: 'Error',
        description: 'Failed to clock out. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTime = (entry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = generateCSVData(timeEntries);
    downloadCSV(csvData, `timecard-${user.name}-${formatDateForFilename(selectedDate)}.csv`);
    
    toast({
      title: 'Export Complete',
      description: 'Timecard data exported successfully',
      variant: 'default'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return '0:00';
    const diff = clockOut.getTime() - clockIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => {
      if (entry.clockOut) {
        const hours = calculateHours(entry.clockIn, entry.clockOut);
        const [h, m] = hours.split(':').map(Number);
        return total + h + (m / 60);
      }
      return total;
    }, 0);
  };

  const canEditTime = hasRole(userRole, ['admin', 'hr', 'manager']);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timecard</h1>
        <p className="text-gray-600">
          Welcome back, {user.name}. Current time: {formatTime(currentTime)} ({timezone})
        </p>
      </div>

      {/* Clock In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-blue-600">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(currentTime)}
              </div>
            </div>
            
            {currentShift && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">
                  Current Shift
                </div>
                <div className="text-sm text-gray-500">
                  Started: {formatTime(currentShift.clockIn)}
                </div>
                <div className="text-sm text-gray-500">
                  Duration: {calculateHours(currentShift.clockIn, new Date())}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {!isClockedIn ? (
              <Button
                onClick={handleClockIn}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Clock In
              </Button>
            ) : (
              <Button
                onClick={handleClockOut}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
              >
                <StopIcon className="w-5 h-5 mr-2" />
                Clock Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'today' ? 'default' : 'outline'}
            onClick={() => setViewMode('today')}
          >
            Today
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            onClick={() => setViewMode('week')}
          >
            This Week
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            className="w-48"
          />
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Time Entries or Calendar View */}
      {viewMode === 'calendar' ? (
        <CalendarView
          timeEntries={timeEntries}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Time Entries
              {viewMode === 'today' && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  Total: {getTotalHours().toFixed(1)} hours
                </span>
              )}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {canEditTime && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeEntries.length === 0 ? (
                  <tr>
                    <td colSpan={canEditTime ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                      No time entries found for the selected period.
                    </td>
                  </tr>
                ) : (
                  timeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(entry.clockIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(entry.clockIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.clockOut ? formatTime(entry.clockOut) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.clockOut ? calculateHours(entry.clockIn, entry.clockOut) : 'In Progress'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.clockOut 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.clockOut ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      {canEditTime && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTime(entry)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Time Modal */}
      {isEditModalOpen && (
        <EditTimeModal
          entry={editingEntry}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEntry(null);
          }}
          onSave={(updatedEntry) => {
            setTimeEntries(prev => 
              prev.map(entry => 
                entry.id === updatedEntry.id ? updatedEntry : entry
              )
            );
            setIsEditModalOpen(false);
            setEditingEntry(null);
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
};

// Edit Time Modal Component
const EditTimeModal = ({ entry, isOpen, onClose, onSave, userRole }) => {
  const [formData, setFormData] = useState({
    clockIn: entry?.clockIn ? new Date(entry.clockIn) : new Date(),
    clockOut: entry?.clockOut ? new Date(entry.clockOut) : new Date(),
    reason: '',
    requiresApproval: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEntry = {
        ...entry,
        clockIn: formData.clockIn,
        clockOut: formData.clockOut,
        edited: true,
        editReason: formData.reason,
        requiresApproval: formData.requiresApproval,
        editedBy: 'current-user',
        editedAt: new Date()
      };

      onSave(updatedEntry);
      
      toast({
        title: 'Time Entry Updated',
        description: formData.requiresApproval 
          ? 'Time entry updated and sent for manager approval'
          : 'Time entry updated successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update time entry',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canAutoApprove = hasRole(userRole, ['admin', 'hr']);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <ModalTitle>Edit Time Entry</ModalTitle>
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock In Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.clockIn.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clockIn: new Date(e.target.value)
                  }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock Out Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.clockOut.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clockOut: new Date(e.target.value)
                  }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Edit
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reason: e.target.value
                }))}
                placeholder="Please explain why this time entry needs to be modified..."
                required
              />
            </div>

            {!canAutoApprove && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    requiresApproval: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-700">
                  Requires manager approval
                </label>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

// Helper functions
const generateMockTimeEntries = (date) => {
  const entries = [];
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - 7); // Show last 7 days
  
  for (let i = 0; i < 7; i++) {
    const entryDate = new Date(startDate);
    entryDate.setDate(startDate.getDate() + i);
    
    // Randomly generate some entries
    if (Math.random() > 0.3) {
      const clockIn = new Date(entryDate);
      clockIn.setHours(9 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const clockOut = new Date(clockIn);
      clockOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      entries.push({
        id: `entry-${i}`,
        clockIn,
        clockOut,
        edited: Math.random() > 0.8,
        editReason: Math.random() > 0.8 ? 'Forgot to clock out' : null
      });
    }
  }
  
  return entries.sort((a, b) => b.clockIn - a.clockIn);
};

const generateCSVData = (entries) => {
  const headers = ['Date', 'Clock In', 'Clock Out', 'Duration (Hours)', 'Status', 'Edited'];
  const rows = entries.map(entry => [
    entry.clockIn.toLocaleDateString(),
    entry.clockIn.toLocaleTimeString(),
    entry.clockOut ? entry.clockOut.toLocaleTimeString() : '',
    entry.clockOut ? calculateHours(entry.clockIn, entry.clockOut) : 'In Progress',
    entry.clockOut ? 'Completed' : 'Active',
    entry.edited ? 'Yes' : 'No'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const downloadCSV = (csvData, filename) => {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const formatDateForFilename = (date) => {
  return date.toISOString().split('T')[0];
};

const calculateHours = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return '0:00';
  const diff = clockOut.getTime() - clockIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export default Timecard;
