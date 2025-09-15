'use client';

import { useState, useEffect } from 'react';

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [startTime, setStartTime] = useState(null);

  // Sample time tracking data
  useEffect(() => {
    const sampleEntries = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        project: 'Website Redesign',
        task: 'Frontend Development',
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        description: 'Working on responsive design components',
        date: '2024-01-15',
        status: 'Completed'
      },
      {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        project: 'HR System',
        task: 'Database Design',
        startTime: '10:00',
        endTime: '16:00',
        duration: 6,
        description: 'Designing employee database schema',
        date: '2024-01-15',
        status: 'Completed'
      },
      {
        id: 3,
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        project: 'Marketing Campaign',
        task: 'Content Creation',
        startTime: '09:30',
        endTime: '17:30',
        duration: 8,
        description: 'Creating social media content',
        date: '2024-01-15',
        status: 'Completed'
      },
      {
        id: 4,
        employeeName: 'Emily Wilson',
        employeeId: 'EMP004',
        project: 'Financial Reports',
        task: 'Monthly Reconciliation',
        startTime: '08:00',
        endTime: '15:00',
        duration: 7,
        description: 'Monthly financial reconciliation',
        date: '2024-01-15',
        status: 'Completed'
      },
      {
        id: 5,
        employeeName: 'David Brown',
        employeeId: 'EMP005',
        project: 'Sales Dashboard',
        task: 'Data Analysis',
        startTime: '11:00',
        endTime: null,
        duration: 0,
        description: 'Analyzing sales performance data',
        date: '2024-01-15',
        status: 'In Progress'
      }
    ];
    setTimeEntries(sampleEntries);
  }, []);

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

  const projects = [
    'Website Redesign', 'HR System', 'Marketing Campaign', 'Financial Reports', 
    'Sales Dashboard', 'Mobile App', 'Data Migration', 'System Maintenance'
  ];

  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'David Brown', 'Lisa Garcia'
  ];

  const handleStartTracking = () => {
    if (!selectedEmployee || !selectedProject) {
      alert('Please select employee and project');
      return;
    }
    setIsTracking(true);
    setStartTime(new Date());
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setStartTime(null);
    // Add the time entry to the list
    const newEntry = {
      id: timeEntries.length + 1,
      employeeName: selectedEmployee,
      employeeId: `EMP${String(timeEntries.length + 1).padStart(3, '0')}`,
      project: selectedProject,
      task: 'Time Tracking',
      startTime: startTime ? startTime.toTimeString().slice(0, 5) : '00:00',
      endTime: new Date().toTimeString().slice(0, 5),
      duration: startTime ? Math.round((new Date() - startTime) / 3600000 * 100) / 100 : 0,
      description: 'Time tracked session',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setTimeEntries(prev => [newEntry, ...prev]);
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
    <div className="p-6">
      <div className="mb-6">
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
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
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
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee} value={employee}>{employee}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
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

      {/* Time Entries */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
        </div>
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
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4">
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
    </div>
  );
}
