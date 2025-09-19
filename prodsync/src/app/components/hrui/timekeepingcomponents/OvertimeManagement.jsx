'use client';

import { useState, useEffect } from 'react';
import { useOvertimeContext } from '../../../context/OvertimeContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function OvertimeManagement() {
  const { 
    overtimeRequests, 
    addOvertimeRequest, 
    updateOvertimeRequest, 
    approveOvertimeRequest, 
    rejectOvertimeRequest,
    getOvertimeStatistics,
    clearAllData
  } = useOvertimeContext();
  
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    employeeId: '',
    projectId: '',
    date: '',
    startTime: '',
    endTime: '',
    hours: 0,
    reason: '',
    rate: 1.5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('OvertimeManagement - overtimeRequests:', overtimeRequests);
    console.log('OvertimeManagement - statistics:', getOvertimeStatistics());
  }, [overtimeRequests, getOvertimeStatistics]);

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

      // Overtime requests are now managed by context
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load overtime data');
    } finally {
      setLoading(false);
    }
  };


  // Get statistics from context
  const statistics = getOvertimeStatistics();

  // Sort overtime requests
  const sortedOvertimeRequests = [...overtimeRequests].sort((a, b) => {
    const dateA = new Date(a.submittedDate || a.createdAt || 0);
    const dateB = new Date(b.submittedDate || b.createdAt || 0);
    return dateB - dateA;
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const selectedEmployee = employees.find(emp => emp.id === newRequest.employeeId);
      const selectedProject = projects.find(proj => proj.id === newRequest.projectId);
      
      if (!selectedEmployee || !selectedProject) {
        alert('Please select valid employee and project');
        return;
      }

      const hours = calculateHours(newRequest.startTime, newRequest.endTime);
      const baseRate = 50; // Assuming $50 base rate
      const payAmount = hours * parseFloat(newRequest.rate) * baseRate;

      const requestData = {
        employeeId: newRequest.employeeId,
        employeeName: selectedEmployee.name,
        projectId: newRequest.projectId,
        project: selectedProject.name,
        date: newRequest.date,
        startTime: newRequest.startTime,
        endTime: newRequest.endTime,
        hours: hours,
        rate: parseFloat(newRequest.rate),
        reason: newRequest.reason,
        payAmount: payAmount,
        contactNumber: '', // Manual entry doesn't have contact number
        emergencyContact: ''
      };

      if (editingRequest) {
        // Update existing request
        updateOvertimeRequest(editingRequest.id, requestData);
        setEditingRequest(null);
        alert('Overtime request updated successfully!');
      } else {
        // Add new request
        addOvertimeRequest(requestData);
        alert('Overtime request submitted successfully!');
      }
      
      cancelForm();
    } catch (err) {
      console.error('Error saving overtime request:', err);
      alert('Failed to save overtime request');
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setNewRequest({
      employeeId: request.employeeId,
      projectId: request.projectId,
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
    try {
      console.log('Approving overtime request with ID:', id);
      const request = overtimeRequests.find(req => req.id === id);
      approveOvertimeRequest(id, 'HR Manager');
      
      if (request) {
        alert(`Overtime request approved successfully!\n\nHours: ${request.hours}h\nPay: $${request.payAmount}\n\n✅ This will now be included in Total Hours and Total Pay calculations.`);
      } else {
        alert('Overtime request approved successfully!');
      }
    } catch (error) {
      console.error('Error approving overtime request:', error);
      alert('Error approving overtime request. Please try again.');
    }
  };

  const handleReject = (id) => {
    try {
      console.log('Rejecting overtime request with ID:', id);
      const request = overtimeRequests.find(req => req.id === id);
      rejectOvertimeRequest(id, 'HR Manager');
      
      if (request) {
        alert(`Overtime request rejected.\n\nHours: ${request.hours}h\nPay: $${request.payAmount}\n\n❌ This will NOT be included in Total Hours and Total Pay calculations.`);
      } else {
        alert('Overtime request rejected.');
      }
    } catch (error) {
      console.error('Error rejecting overtime request:', error);
      alert('Error rejecting overtime request. Please try again.');
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingRequest(null);
    setNewRequest({
      employeeId: '',
      projectId: '',
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

  // Statistics are now provided by the context
  const { pending, approved, totalHours, totalPay } = statistics;
  

  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overtime Management</h2>
            <p className="text-gray-600 mt-1">Manage overtime requests and approvals</p>
            {overtimeRequests.length === 0 && (
              <div className="text-sm text-blue-600 mt-2">
                <p>
                  💡 <strong>Test the integration:</strong> Click "Application Form" in the navbar to submit an overtime request, then return here to see it appear in real-time!
                </p>
                <button
                  onClick={() => {
                    console.log('Testing overtime context...');
                    console.log('overtimeRequests:', overtimeRequests);
                    console.log('addOvertimeRequest function:', typeof addOvertimeRequest);
                    alert(`Context Test:\nOvertime Requests: ${overtimeRequests.length}\nAdd Function: ${typeof addOvertimeRequest}`);
                  }}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Test Context
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all data? This will remove all overtime requests including dummy data.')) {
                  clearAllData();
                  alert('All data cleared! Only real ApplicationForm submissions will be shown.');
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Add Overtime Request
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pending}</p>
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
              <p className="text-2xl font-bold text-gray-900">{approved}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              <p className="text-xs text-gray-500">Approved only</p>
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
              <p className="text-2xl font-bold text-gray-900">${totalPay.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Approved only</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.rejected}</p>
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

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="mx-6 bg-white border border-gray-200 rounded-lg mb-6">
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
                  name="employeeId"
                  value={newRequest.employeeId}
                  onChange={handleInputChange}
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                <select
                  name="projectId"
                  value={newRequest.projectId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
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
      <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Overtime Requests</h3>
            <div className="text-sm text-gray-500">
              {sortedOvertimeRequests.length} requests
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading overtime requests...</p>
          </div>
        ) : (
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
              {sortedOvertimeRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Overtime Requests</h3>
                      <p className="text-gray-500 mb-4">
                        No overtime requests found. Add a new request or submit through the Application Form.
                      </p>
                      <button
                        onClick={() => setIsAddingNew(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Add First Request
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedOvertimeRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        {request.contactNumber && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            📝 Form
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{request.employeeId}</div>
                      {request.contactNumber && (
                        <div className="text-xs text-gray-400">📞 {request.contactNumber}</div>
                      )}
                      {request.emergencyContact && (
                        <div className="text-xs text-gray-400">🚨 Emergency: {request.emergencyContact}</div>
                      )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

