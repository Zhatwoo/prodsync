'use client';

import { useState, useEffect } from 'react';

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    employeeName: '',
    shiftType: '',
    startTime: '',
    endTime: '',
    date: '',
    department: '',
    notes: ''
  });

  // Sample schedule data
  useEffect(() => {
    const sampleSchedules = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        shiftType: 'Day Shift',
        startTime: '09:00',
        endTime: '18:00',
        date: '2024-01-15',
        department: 'IT',
        notes: 'Regular development work',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        shiftType: 'Day Shift',
        startTime: '08:00',
        endTime: '17:00',
        date: '2024-01-15',
        department: 'HR',
        notes: 'HR meetings and employee relations',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 3,
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        shiftType: 'Flexible',
        startTime: '10:00',
        endTime: '19:00',
        date: '2024-01-15',
        department: 'Marketing',
        notes: 'Campaign planning and execution',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 4,
        employeeName: 'Emily Wilson',
        employeeId: 'EMP004',
        shiftType: 'Day Shift',
        startTime: '08:30',
        endTime: '17:30',
        date: '2024-01-15',
        department: 'Finance',
        notes: 'Monthly financial closing',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 5,
        employeeName: 'David Brown',
        employeeId: 'EMP005',
        shiftType: 'Evening Shift',
        startTime: '14:00',
        endTime: '23:00',
        date: '2024-01-15',
        department: 'Sales',
        notes: 'Client calls and follow-ups',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 6,
        employeeName: 'Lisa Garcia',
        employeeId: 'EMP006',
        shiftType: 'Night Shift',
        startTime: '22:00',
        endTime: '06:00',
        date: '2024-01-15',
        department: 'Operations',
        notes: 'System monitoring and maintenance',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 7,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        shiftType: 'Day Shift',
        startTime: '09:00',
        endTime: '18:00',
        date: '2024-01-16',
        department: 'IT',
        notes: 'Code review and testing',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      },
      {
        id: 8,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        shiftType: 'Half Day',
        startTime: '09:00',
        endTime: '13:00',
        date: '2024-01-16',
        department: 'HR',
        notes: 'Training session in the afternoon',
        status: 'Scheduled',
        createdDate: '2024-01-10'
      }
    ];
    setSchedules(sampleSchedules);
  }, []);

  const shiftTypes = [
    'Day Shift', 'Evening Shift', 'Night Shift', 'Flexible', 'Half Day', 'Split Shift', 'On-Call'
  ];

  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'David Brown', 'Lisa Garcia'
  ];

  const departments = [
    'IT', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations', 'Customer Service'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSchedule) {
      // Update existing schedule
      setSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { ...schedule, ...newSchedule }
          : schedule
      ));
      setEditingSchedule(null);
    } else {
      // Add new schedule
      const schedule = {
        id: schedules.length + 1,
        ...newSchedule,
        employeeId: `EMP${String(schedules.length + 1).padStart(3, '0')}`,
        status: 'Scheduled',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSchedules(prev => [schedule, ...prev]);
    }
    
    setNewSchedule({
      employeeName: '',
      shiftType: '',
      startTime: '',
      endTime: '',
      date: '',
      department: '',
      notes: ''
    });
    setIsAddingNew(false);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      employeeName: schedule.employeeName,
      shiftType: schedule.shiftType,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      date: schedule.date,
      department: schedule.department,
      notes: schedule.notes
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingSchedule(null);
    setNewSchedule({
      employeeName: '',
      shiftType: '',
      startTime: '',
      endTime: '',
      date: '',
      department: '',
      notes: ''
    });
  };

  const getShiftTypeColor = (type) => {
    switch (type) {
      case 'Day Shift': return 'bg-blue-100 text-blue-800';
      case 'Evening Shift': return 'bg-orange-100 text-orange-800';
      case 'Night Shift': return 'bg-purple-100 text-purple-800';
      case 'Flexible': return 'bg-green-100 text-green-800';
      case 'Half Day': return 'bg-yellow-100 text-yellow-800';
      case 'Split Shift': return 'bg-pink-100 text-pink-800';
      case 'On-Call': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce((groups, schedule) => {
    const date = schedule.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(schedule);
    return groups;
  }, {});

  const totalSchedules = schedules.length;
  const dayShifts = schedules.filter(s => s.shiftType === 'Day Shift').length;
  const nightShifts = schedules.filter(s => s.shiftType === 'Night Shift').length;

  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
            <p className="text-gray-600 mt-1">Manage employee work schedules and shifts</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Add Schedule
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{totalSchedules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Day Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{dayShifts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Night Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{nightShifts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(schedules.map(s => s.employeeName)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="mx-6 bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                <select
                  name="employeeName"
                  value={newSchedule.employeeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee} value={employee}>{employee}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={newSchedule.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type *</label>
                <select
                  name="shiftType"
                  value={newSchedule.shiftType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Shift Type</option>
                  {shiftTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={newSchedule.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={newSchedule.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={newSchedule.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={newSchedule.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Additional notes or special instructions"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Calendar View */}
      <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Schedule Calendar</h3>
        </div>
        <div className="p-6">
          {Object.keys(groupedSchedules).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No schedules found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSchedules)
                .sort(([a], [b]) => new Date(a) - new Date(b))
                .map(([date, daySchedules]) => (
                <div key={date} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {daySchedules.map((schedule) => (
                      <div key={schedule.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{schedule.employeeName}</h5>
                            <p className="text-sm text-gray-500">{schedule.department}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftTypeColor(schedule.shiftType)}`}>
                            {schedule.shiftType}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                        </div>
                        {schedule.notes && (
                          <p className="text-sm text-gray-500 mb-3">{schedule.notes}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                            {schedule.status}
                          </span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(schedule)}
                              className="text-blue-600 hover:text-blue-900 text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(schedule.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
