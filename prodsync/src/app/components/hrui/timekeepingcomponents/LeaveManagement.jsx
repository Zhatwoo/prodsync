'use client';

import { useState, useEffect } from 'react';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    days: 0
  });

  // Sample leave requests data
  useEffect(() => {
    const sampleRequests = [
      {
        id: 1,
        employeeName: 'John Smith',
        employeeId: 'EMP001',
        leaveType: 'Annual Leave',
        startDate: '2024-01-20',
        endDate: '2024-01-25',
        days: 5,
        reason: 'Family vacation',
        status: 'Approved',
        submittedDate: '2024-01-10',
        approvedBy: 'Sarah Johnson',
        approvedDate: '2024-01-12'
      },
      {
        id: 2,
        employeeName: 'Sarah Johnson',
        employeeId: 'EMP002',
        leaveType: 'Sick Leave',
        startDate: '2024-01-18',
        endDate: '2024-01-19',
        days: 2,
        reason: 'Medical appointment',
        status: 'Approved',
        submittedDate: '2024-01-17',
        approvedBy: 'Mike Davis',
        approvedDate: '2024-01-17'
      },
      {
        id: 3,
        employeeName: 'Mike Davis',
        employeeId: 'EMP003',
        leaveType: 'Personal Leave',
        startDate: '2024-01-22',
        endDate: '2024-01-24',
        days: 3,
        reason: 'Personal matters',
        status: 'Pending',
        submittedDate: '2024-01-15',
        approvedBy: null,
        approvedDate: null
      },
      {
        id: 4,
        employeeName: 'Emily Wilson',
        employeeId: 'EMP004',
        leaveType: 'Maternity Leave',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        days: 90,
        reason: 'Maternity leave',
        status: 'Approved',
        submittedDate: '2024-01-05',
        approvedBy: 'Sarah Johnson',
        approvedDate: '2024-01-08'
      },
      {
        id: 5,
        employeeName: 'David Brown',
        employeeId: 'EMP005',
        leaveType: 'Emergency Leave',
        startDate: '2024-01-16',
        endDate: '2024-01-16',
        days: 1,
        reason: 'Family emergency',
        status: 'Approved',
        submittedDate: '2024-01-16',
        approvedBy: 'Sarah Johnson',
        approvedDate: '2024-01-16'
      },
      {
        id: 6,
        employeeName: 'Lisa Garcia',
        employeeId: 'EMP006',
        leaveType: 'Study Leave',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        days: 2,
        reason: 'Professional development course',
        status: 'Rejected',
        submittedDate: '2024-01-14',
        approvedBy: 'Mike Davis',
        approvedDate: '2024-01-16'
      }
    ];
    setLeaveRequests(sampleRequests);
  }, []);

  const leaveTypes = [
    'Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 
    'Paternity Leave', 'Study Leave', 'Emergency Leave', 'Bereavement Leave'
  ];

  const employees = [
    'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'David Brown', 'Lisa Garcia'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateChange = (name, value) => {
    setNewRequest(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        updated.days = calculateDays(updated.startDate, updated.endDate);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRequest) {
      // Update existing request
      setLeaveRequests(prev => prev.map(request => 
        request.id === editingRequest.id 
          ? { 
              ...request, 
              ...newRequest, 
              days: calculateDays(newRequest.startDate, newRequest.endDate)
            }
          : request
      ));
      setEditingRequest(null);
    } else {
      // Add new request
      const request = {
        id: leaveRequests.length + 1,
        ...newRequest,
        employeeId: `EMP${String(leaveRequests.length + 1).padStart(3, '0')}`,
        days: calculateDays(newRequest.startDate, newRequest.endDate),
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedDate: null
      };
      setLeaveRequests(prev => [request, ...prev]);
    }
    
    setNewRequest({
      employeeName: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      days: 0
    });
    setIsAddingNew(false);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setNewRequest({
      employeeName: request.employeeName,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      days: request.days
    });
    setIsAddingNew(true);
  };

  const handleApprove = (id) => {
    setLeaveRequests(prev => prev.map(request => 
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
    setLeaveRequests(prev => prev.map(request => 
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
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      days: 0
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

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave': return 'bg-blue-100 text-blue-800';
      case 'Sick Leave': return 'bg-red-100 text-red-800';
      case 'Personal Leave': return 'bg-purple-100 text-purple-800';
      case 'Maternity Leave': return 'bg-pink-100 text-pink-800';
      case 'Emergency Leave': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'Approved').length;
  const totalDays = leaveRequests.reduce((sum, req) => sum + req.days, 0);

  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
            <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Add Leave Request
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="mx-6 bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRequest ? 'Edit Leave Request' : 'Add New Leave Request'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                <select
                  name="leaveType"
                  value={newRequest.leaveType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={newRequest.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={newRequest.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                <input
                  type="number"
                  value={newRequest.days}
                  readOnly
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
                  placeholder="Enter reason for leave"
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

      {/* Leave Requests List */}
      <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                      <div className="text-sm text-gray-500">{request.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveTypeColor(request.leaveType)}`}>
                      {request.leaveType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{request.startDate} to {request.endDate}</div>
                      <div className="text-sm text-gray-500">{request.days} days</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{request.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(request.submittedDate).toLocaleDateString()}</div>
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
