'use client';

import { useState, useEffect } from 'react';

export default function OvertimeManagement() {
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    project: '',
    date: '',
    startTime: '',
    endTime: '',
    hours: 0,
    reason: '',
    rate: 1.5
  });

  // Sample overtime requests data
  useEffect(() => {
    const sampleRequests = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        project: 'Website Redesign',
        date: '2024-01-15',
        startTime: '18:00',
        endTime: '22:00',
        hours: 4,
        rate: 1.5,
        reason: 'Urgent bug fixes for production deployment',
        status: 'Approved',
        submittedDate: '2024-01-15',
        approvedBy: 'Sarah Johnson',
        approvedDate: '2024-01-16',
        payAmount: 300
      },
      {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        project: 'HR System',
        date: '2024-01-14',
        startTime: '17:30',
        endTime: '21:30',
        hours: 4,
        rate: 1.5,
        reason: 'Database migration completion',
        status: 'Approved',
        submittedDate: '2024-01-14',
        approvedBy: 'Mike Davis',
        approvedDate: '2024-01-15',
        payAmount: 320
      },
      {
        id: 3,
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        project: 'Marketing Campaign',
        date: '2024-01-16',
        startTime: '19:00',
        endTime: '23:00',
        hours: 4,
        rate: 1.5,
        reason: 'Campaign launch preparation',
        status: 'Pending',
        submittedDate: '2024-01-16',
        approvedBy: null,
        approvedDate: null,
        payAmount: 280
      },
      {
        id: 4,
        employeeName: 'Emily Wilson',
        employeeId: 'EMP004',
        project: 'Financial Reports',
        date: '2024-01-13',
        startTime: '18:00',
        endTime: '20:00',
        hours: 2,
        rate: 1.5,
        reason: 'Month-end closing procedures',
        status: 'Approved',
        submittedDate: '2024-01-13',
        approvedBy: 'Sarah Johnson',
        approvedDate: '2024-01-14',
        payAmount: 150
      },
      {
        id: 5,
        employeeName: 'David Brown',
        employeeId: 'EMP005',
        project: 'Sales Dashboard',
        date: '2024-01-17',
        startTime: '17:00',
        endTime: '22:00',
        hours: 5,
        rate: 2.0,
        reason: 'Critical client presentation preparation',
        status: 'Rejected',
        submittedDate: '2024-01-17',
        approvedBy: 'Mike Davis',
        approvedDate: '2024-01-18',
        payAmount: 400
      },
      {
        id: 6,
        employeeName: 'Lisa Garcia',
        employeeId: 'EMP006',
        project: 'System Maintenance',
        date: '2024-01-18',
        startTime: '20:00',
        endTime: '24:00',
        hours: 4,
        rate: 1.5,
        reason: 'Scheduled system maintenance',
        status: 'Pending',
        submittedDate: '2024-01-18',
        approvedBy: null,
        approvedDate: null,
        payAmount: 240
      }
    ];
    setOvertimeRequests(sampleRequests);
  }, []);

  const projects = [
    'Website Redesign', 'HR System', 'Marketing Campaign', 'Financial Reports', 
    'Sales Dashboard', 'System Maintenance', 'Mobile App', 'Data Migration'
  ];

  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'David Brown', 'Lisa Garcia'
  ];

  const overtimeRates = [
    { value: 1.5, label: '1.5x (Regular Overtime)' },
    { value: 2.0, label: '2.0x (Double Time)' },
    { value: 2.5, label: '2.5x (Holiday Rate)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  };

  const handleTimeChange = (name, value) => {
    setNewRequest(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'startTime' || name === 'endTime') {
        updated.hours = calculateHours(updated.startTime, updated.endTime);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRequest) {
      // Update existing request
      setOvertimeRequests(prev => prev.map(request => 
        request.id === editingRequest.id 
          ? { 
              ...request, 
              ...newRequest, 
              hours: calculateHours(newRequest.startTime, newRequest.endTime),
              payAmount: calculateHours(newRequest.startTime, newRequest.endTime) * parseFloat(newRequest.rate) * 50 // Assuming $50 base rate
            }
          : request
      ));
      setEditingRequest(null);
    } else {
      // Add new request
      const request = {
        id: overtimeRequests.length + 1,
        ...newRequest,
        employeeId: `EMP${String(overtimeRequests.length + 1).padStart(3, '0')}`,
        hours: calculateHours(newRequest.startTime, newRequest.endTime),
        payAmount: calculateHours(newRequest.startTime, newRequest.endTime) * parseFloat(newRequest.rate) * 50,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedDate: null
      };
      setOvertimeRequests(prev => [request, ...prev]);
    }
    
    setNewRequest({
      employeeName: '',
      project: '',
      date: '',
      startTime: '',
      endTime: '',
      hours: 0,
      reason: '',
      rate: 1.5
    });
    setIsAddingNew(false);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setNewRequest({
      employeeName: request.employeeName,
      project: request.project,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      hours: request.hours,
      reason: request.reason,
      rate: request.rate
    });
    setIsAddingNew(true);
  };

  const handleApprove = (id) => {
    setOvertimeRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'Approved',
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
  };

  const handleReject = (id) => {
    setOvertimeRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'Rejected',
            approvedBy: 'Current User',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingRequest(null);
    setNewRequest({
      employeeName: '',
      project: '',
      date: '',
      startTime: '',
      endTime: '',
      hours: 0,
      reason: '',
      rate: 1.5
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = overtimeRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = overtimeRequests.filter(req => req.status === 'Approved').length;
  const totalOvertimeHours = overtimeRequests.reduce((sum, req) => sum + req.hours, 0);
  const totalOvertimePay = overtimeRequests.reduce((sum, req) => sum + (req.payAmount || 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overtime Management</h2>
            <p className="text-gray-600 mt-1">Manage overtime requests and approvals</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Add Overtime Request
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{totalOvertimeHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pay</p>
              <p className="text-2xl font-bold text-gray-900">${totalOvertimePay.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRequest ? 'Edit Overtime Request' : 'Add New Overtime Request'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                <select
                  name="employeeName"
                  value={newRequest.employeeName}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                <select
                  name="project"
                  value={newRequest.project}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={newRequest.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate *</label>
                <select
                  name="rate"
                  value={newRequest.rate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {overtimeRates.map(rate => (
                    <option key={rate.value} value={rate.value}>{rate.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={newRequest.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={newRequest.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <input
                  type="number"
                  value={newRequest.hours}
                  readOnly
                  step="0.5"
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <textarea
                  name="reason"
                  value={newRequest.reason}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter reason for overtime"
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
                {editingRequest ? 'Update Request' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overtime Requests List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Overtime Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overtimeRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                      <div className="text-sm text-gray-500">{request.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{new Date(request.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{request.startTime} - {request.endTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.hours}h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.rate}x</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${request.payAmount?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {request.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleEdit(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
