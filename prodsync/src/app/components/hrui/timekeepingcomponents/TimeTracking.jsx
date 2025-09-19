'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [startTime, setStartTime] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch data from Firebase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch employees
      const employeesRef = collection(db, 'employees');
      const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
      const employeesSnapshot = await getDocs(employeesQuery);
      
      const employeesData = [];
      employeesSnapshot.forEach((doc) => {
        employeesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setEmployees(employeesData);

      // Fetch projects
      const projectsRef = collection(db, 'projects');
      const projectsQuery = query(projectsRef, orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      
      const projectsData = [];
      projectsSnapshot.forEach((doc) => {
        projectsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setProjects(projectsData);

      // Fetch time entries
      const timeEntriesRef = collection(db, 'timeEntries');
      const timeEntriesSnapshot = await getDocs(timeEntriesRef);
      
      const timeEntriesData = [];
      timeEntriesSnapshot.forEach((doc) => {
        const data = doc.data();
        timeEntriesData.push({
          id: doc.id,
          ...data,
          // Calculate duration if not set
          duration: data.duration || calculateDuration(data.startTime, data.endTime)
        });
      });
      
      // Sort by createdAt in JavaScript to avoid composite index requirement
      timeEntriesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order
      });
      
      setTimeEntries(timeEntriesData);

      // Fetch attendance data (from timecard entries)
      const attendanceRef = collection(db, 'attendance');
      const attendanceSnapshot = await getDocs(attendanceRef);
      
      const attendanceData = [];
      attendanceSnapshot.forEach((doc) => {
        const data = doc.data();
        attendanceData.push({
          id: doc.id,
          ...data
        });
      });
      
      // Sort by createdAt in JavaScript to avoid composite index requirement
      attendanceData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order
      });
      
      setAttendanceData(attendanceData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load time tracking data');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
  };

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = now - startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      setCurrentTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const handleStartTracking = () => {
    if (!selectedEmployee || !selectedProject) {
      alert('Please select employee and project');
      return;
    }
    setIsTracking(true);
    setStartTime(new Date());
  };

  const handleStopTracking = async () => {
    if (!startTime) return;
    
    try {
      setIsTracking(false);
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 3600000 * 100) / 100;
      
      const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
      const selectedProjectData = projects.find(proj => proj.id === selectedProject);
      
      const timeEntryData = {
        employeeId: selectedEmployee,
        employeeName: selectedEmployeeData?.name || 'Unknown',
        projectId: selectedProject,
        project: selectedProjectData?.name || 'Unknown',
        task: 'Time Tracking',
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        duration: duration,
        description: 'Time tracked session',
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'timeEntries'), timeEntryData);
      
      // Update local state
      const newEntry = {
        id: 'temp-id', // Will be replaced by Firebase ID
        ...timeEntryData,
        createdAt: new Date().toISOString()
      };
      setTimeEntries(prev => [newEntry, ...prev]);
      
      setStartTime(null);
      alert('Time entry saved successfully!');
    } catch (err) {
      console.error('Error saving time entry:', err);
      alert('Failed to save time entry');
    }
  };

  const handleViewEntry = (entry) => {
    alert(`Viewing time entry details:\nEmployee: ${entry.employeeName}\nProject: ${entry.project}\nDuration: ${entry.duration}h\nDate: ${entry.date}`);
  };

  const handleEditEntry = async (entry) => {
    try {
      const newStartTime = prompt(`Enter start time (HH:MM):`, entry.startTime);
      const newEndTime = prompt(`Enter end time (HH:MM):`, entry.endTime);
      const newDescription = prompt(`Enter description:`, entry.description);
      
      if (newStartTime && newEndTime) {
        const duration = calculateDuration(newStartTime, newEndTime);
        
        await updateDoc(doc(db, 'timeEntries', entry.id), {
          startTime: newStartTime,
          endTime: newEndTime,
          duration: duration,
          description: newDescription || entry.description,
          updatedAt: serverTimestamp()
        });

        // Update local state
        setTimeEntries(prev => prev.map(e => 
          e.id === entry.id 
            ? { ...e, startTime: newStartTime, endTime: newEndTime, duration: duration, description: newDescription || entry.description }
            : e
        ));
        
        alert('Time entry updated successfully!');
      }
    } catch (err) {
      console.error('Error updating time entry:', err);
      alert('Failed to update time entry');
    }
  };

  const handleDeleteEntry = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'timeEntries', entryToDelete.id));
      setTimeEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
      setShowDeleteModal(false);
      setEntryToDelete(null);
      alert('Time entry deleted successfully!');
    } catch (err) {
      console.error('Error deleting time entry:', err);
      alert('Failed to delete time entry');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const activeEntries = timeEntries.filter(entry => entry.status === 'In Progress').length;

  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Time Tracking</h2>
            <p className="text-gray-600 mt-1">Track time spent on projects and tasks</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-50 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-purple-600">{totalHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Total Tracked</div>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-blue-600">{activeEntries}</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracker */}
      <div className="mx-6 bg-white border border-gray-200 rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Time Tracker</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              {!isTracking ? (
                <button
                  onClick={handleStartTracking}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Start Tracking
                </button>
              ) : (
                <button
                  onClick={handleStopTracking}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Stop Tracking
                </button>
              )}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-purple-600 mb-4">
              {currentTime}
            </div>
            <div className="text-lg text-gray-600">
              {isTracking ? 'Time is running...' : 'Ready to track time'}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Time Entries */}
      <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading time entries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                      <div className="text-sm text-gray-500">{entry.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{entry.task}</div>
                      <div className="text-sm text-gray-500">{entry.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.startTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.endTime || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.duration}h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewEntry(entry)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditEntry(entry)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteEntry(entry)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Attendance Data from Timecard */}
      <div className="mx-6 mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Recent Attendance Records (from Timecard)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.slice(0, 5).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.checkIn || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.checkOut || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.department || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-800' :
                      record.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.duration ? `${record.duration}h` : '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mx-6 mt-6 bg-purple-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{timeEntries.length}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {timeEntries.filter(entry => entry.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {timeEntries.filter(entry => entry.status === 'In Progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEntryToDelete(null);
        }}
        onConfirm={confirmDeleteEntry}
        title="Delete Time Entry"
        message="Are you sure you want to delete this time entry? This action cannot be undone."
        itemName={entryToDelete ? `${entryToDelete.employeeName} - ${entryToDelete.project}` : ''}
        isLoading={false}
      />
    </div>
  );
}
