'use client';

import { useState, useEffect } from 'react';
import { useLeaveContext } from '../../../context/LeaveContext';
import { useOvertimeContext } from '../../../context/OvertimeContext';
import { useBusinessTripContext } from '../../../context/BusinessTripContext';
import { useEquipmentContext } from '../../../context/EquipmentContext';
import { useTrainingContext } from '../../../context/TrainingContext';

export default function FormManagement() {
  const { 
    leaveRequests, 
    addLeaveRequest, 
    updateLeaveRequest, 
    approveLeaveRequest, 
    rejectLeaveRequest,
    getLeaveStatistics,
    clearAllData: clearLeaveData
  } = useLeaveContext();

  const {
    overtimeRequests,
    addOvertimeRequest,
    updateOvertimeRequest,
    approveOvertimeRequest,
    rejectOvertimeRequest,
    getOvertimeStatistics,
    clearAllData: clearOvertimeData
  } = useOvertimeContext();

  const {
    businessTripRequests,
    addBusinessTripRequest,
    updateBusinessTripRequest,
    approveBusinessTripRequest,
    rejectBusinessTripRequest,
    getBusinessTripStatistics,
    clearAllData: clearBusinessTripData
  } = useBusinessTripContext();

  const {
    equipmentRequests,
    addEquipmentRequest,
    updateEquipmentRequest,
    approveEquipmentRequest,
    rejectEquipmentRequest,
    getEquipmentStatistics,
    clearAllData: clearEquipmentData
  } = useEquipmentContext();

  const {
    trainingRequests,
    addTrainingRequest,
    updateTrainingRequest,
    approveTrainingRequest,
    rejectTrainingRequest,
    getTrainingStatistics,
    clearAllData: clearTrainingData
  } = useTrainingContext();

  // Debug logging
  useEffect(() => {
    console.log('FormManagement - All requests:', {
      leave: leaveRequests,
      overtime: overtimeRequests,
      businessTrip: businessTripRequests,
      equipment: equipmentRequests,
      training: trainingRequests
    });
  }, [leaveRequests, overtimeRequests, businessTripRequests, equipmentRequests, trainingRequests]);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showOnlyFormSubmissions, setShowOnlyFormSubmissions] = useState(false);
  const [activeFormType, setActiveFormType] = useState('leave');
  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    days: 0
  });

  // Get current requests and statistics based on active form type
  const getCurrentRequests = () => {
    switch (activeFormType) {
      case 'leave': return leaveRequests;
      case 'overtime': return overtimeRequests;
      case 'business-trip': return businessTripRequests;
      case 'equipment': return equipmentRequests;
      case 'training': return trainingRequests;
      default: return leaveRequests;
    }
  };

  const getCurrentStatistics = () => {
    switch (activeFormType) {
      case 'leave': return getLeaveStatistics();
      case 'overtime': return getOvertimeStatistics();
      case 'business-trip': return getBusinessTripStatistics();
      case 'equipment': return getEquipmentStatistics();
      case 'training': return getTrainingStatistics();
      default: return getLeaveStatistics();
    }
  };

  const currentRequests = getCurrentRequests();
  const statistics = getCurrentStatistics();

  // Filter and sort current requests
  const filteredRequests = showOnlyFormSubmissions 
    ? currentRequests.filter(request => request.contactNumber) // ApplicationForm submissions have contactNumber
    : currentRequests;
    
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.submittedDate || a.createdAt || 0);
    const dateB = new Date(b.submittedDate || b.createdAt || 0);
    return dateB - dateA;
  });

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
      updateLeaveRequest(editingRequest.id, {
              ...newRequest, 
              days: calculateDays(newRequest.startDate, newRequest.endDate)
      });
      setEditingRequest(null);
    } else {
      // Add new request
      const requestData = {
        ...newRequest,
        employeeId: `EMP${String(leaveRequests.length + 1).padStart(3, '0')}`,
        days: calculateDays(newRequest.startDate, newRequest.endDate),
        department: 'HR', // Default department
        position: 'Employee', // Default position
        contactNumber: '',
        emergencyContact: ''
      };
      addLeaveRequest(requestData);
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
    try {
      console.log('Approving request with ID:', id);
      approveLeaveRequest(id, 'HR Manager');
      alert('Leave request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    }
  };

  const handleReject = (id) => {
    try {
      console.log('Rejecting request with ID:', id);
      rejectLeaveRequest(id, 'HR Manager');
      alert('Leave request rejected.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    }
  };

  const exportBulkRequests = () => {
    try {
      console.log('Exporting bulk requests, count:', sortedLeaveRequests.length);
      if (sortedLeaveRequests.length === 0) {
        alert('No leave requests to export.');
        return;
      }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const companyName = "ProdSync Corporation";
    const companyAddress = "123 Business District, Metro Manila, Philippines";
    const companyPhone = "+63 2 1234 5678";
    const companyEmail = "hr@prodsync.com";

    // Create bulk export Word document content
    const wordContent = `
LEAVE MANAGEMENT BULK REPORT
${companyName}
${companyAddress}
Phone: ${companyPhone} | Email: ${companyEmail}

================================================================================
                        LEAVE REQUESTS SUMMARY REPORT
================================================================================

Report Generated: ${currentDate}
Report Type: ${showOnlyFormSubmissions ? 'Application Form Submissions Only' : 'All Leave Requests'}
Total Requests: ${sortedLeaveRequests.length}

SUMMARY STATISTICS
================================================================================
Pending Requests:        ${sortedLeaveRequests.filter(req => req.status === 'Pending').length}
Approved Requests:       ${sortedLeaveRequests.filter(req => req.status === 'Approved').length}
Rejected Requests:       ${sortedLeaveRequests.filter(req => req.status === 'Rejected').length}
Total Leave Days:        ${sortedLeaveRequests.reduce((sum, req) => sum + (req.days || 0), 0)}

DETAILED LEAVE REQUESTS
================================================================================

${sortedLeaveRequests.map((request, index) => `
REQUEST #${index + 1} - ${request.employeeName.toUpperCase()}
${'='.repeat(60)}
Document ID: LR-${request.id}
Status: ${request.status.toUpperCase()}

Employee Information:
  Name: ${request.employeeName}
  Employee ID: ${request.employeeId}
  Department: ${request.department || 'Not Specified'}
  Position: ${request.position || 'Not Specified'}
  ${request.contactNumber ? `Contact: ${request.contactNumber}` : ''}
  ${request.emergencyContact ? `Emergency: ${request.emergencyContact}` : ''}

Leave Details:
  Type: ${request.leaveType}
  Period: ${request.startDate} to ${request.endDate}
  Duration: ${request.days} days
  Reason: ${request.reason}

Submission Info:
  Submitted: ${request.submittedDate}
  Method: ${request.contactNumber ? 'Application Form (Online)' : 'Manual Entry (HR System)'}
  ${request.contactNumber ? `Form ID: FORM-${request.id}` : ''}

${request.status !== 'Pending' ? `
Approval Info:
  Status: ${request.status}
  ${request.approvedBy ? `Processed By: ${request.approvedBy}` : ''}
  ${request.approvedDate ? `Processed Date: ${request.approvedDate}` : ''}
` : `
Status: PENDING HR REVIEW
`}
${'='.repeat(60)}
`).join('\n')}

CORPORATE COMPLIANCE STATEMENT
================================================================================
This bulk report contains all leave requests processed through our HR Management
System. All information has been verified and is in compliance with company
policies and Philippine Labor Law requirements.

For any inquiries regarding this report, please contact:
Human Resources Department
${companyName}
Email: ${companyEmail}
Phone: ${companyPhone}

================================================================================
                            END OF BULK REPORT
================================================================================

Generated by: Leave Management System v2.0
Document Classification: Internal Use Only
Report Type: ${showOnlyFormSubmissions ? 'Application Form Submissions' : 'Complete Leave Management'}
Last Updated: ${currentDate}
    `.trim();

    // Create and download the Word document
    const blob = new Blob([wordContent], { 
      type: 'application/msword' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = showOnlyFormSubmissions 
      ? `Application_Form_Leave_Requests_Bulk_${new Date().toISOString().split('T')[0]}.doc`
      : `Leave_Management_Bulk_Report_${new Date().toISOString().split('T')[0]}.doc`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📄 Bulk report exported successfully!\n\nFile: ${fileName}\nRecords: ${sortedLeaveRequests.length} requests\nType: ${showOnlyFormSubmissions ? 'Application Form Submissions' : 'All Requests'}`);
    } catch (error) {
      console.error('Error exporting bulk requests:', error);
      alert('Error exporting bulk report. Please try again.');
    }
  };

  const exportIndividualRequest = (request) => {
    try {
      console.log('Exporting individual request:', request);
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

    const companyName = "ProdSync Corporation";
    const companyAddress = "123 Business District, Metro Manila, Philippines";
    const companyPhone = "+63 2 1234 5678";
    const companyEmail = "hr@prodsync.com";

    // Create formal corporate Word document content
    const wordContent = `
LEAVE REQUEST DOCUMENTATION
${companyName}
${companyAddress}
Phone: ${companyPhone} | Email: ${companyEmail}

================================================================================
                            LEAVE REQUEST FORM
================================================================================

Document ID: LR-${request.id}
Generated Date: ${currentDate}
Request Status: ${request.status.toUpperCase()}

EMPLOYEE INFORMATION
================================================================================
Employee Name:           ${request.employeeName}
Employee ID:             ${request.employeeId}
Department:              ${request.department || 'Not Specified'}
Position:                ${request.position || 'Not Specified'}
${request.contactNumber ? `Contact Number:         ${request.contactNumber}` : ''}
${request.emergencyContact ? `Emergency Contact:      ${request.emergencyContact}` : ''}

LEAVE REQUEST DETAILS
================================================================================
Leave Type:              ${request.leaveType}
Requested Start Date:    ${request.startDate}
Requested End Date:      ${request.endDate}
Total Leave Days:        ${request.days} days
Reason for Leave:        ${request.reason}

SUBMISSION INFORMATION
================================================================================
Date Submitted:          ${request.submittedDate}
${request.contactNumber ? 'Submission Method:       Application Form (Online)' : 'Submission Method:       Manual Entry (HR System)'}
${request.contactNumber ? 'Form Submission ID:      FORM-' + request.id : ''}

${request.status !== 'Pending' ? `
APPROVAL INFORMATION
================================================================================
Status:                  ${request.status}
${request.approvedBy ? `Processed By:            ${request.approvedBy}` : ''}
${request.approvedDate ? `Processed Date:          ${request.approvedDate}` : ''}
` : `
PENDING APPROVAL
================================================================================
Status:                  PENDING HR REVIEW
This request is currently under review by the Human Resources Department.
`}

CORPORATE COMPLIANCE
================================================================================
This leave request has been processed in accordance with company policies and
Philippine Labor Law requirements. All information provided is accurate and
verified through our HR Management System.

For any inquiries regarding this leave request, please contact:
Human Resources Department
${companyName}
Email: ${companyEmail}
Phone: ${companyPhone}

================================================================================
                            END OF DOCUMENT
================================================================================

Generated by: Leave Management System v2.0
Document Classification: Internal Use Only
Last Updated: ${currentDate}
    `.trim();

    // Create and download the Word document
    const blob = new Blob([wordContent], { 
      type: 'application/msword' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = `Leave_Request_${request.employeeName.replace(/\s+/g, '_')}_${request.id}_${new Date().toISOString().split('T')[0]}.doc`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`📄 Leave request exported successfully!\n\nEmployee: ${request.employeeName}\nFile: ${fileName}\nStatus: ${request.status}`);
    } catch (error) {
      console.error('Error exporting individual request:', error);
      alert('Error exporting request. Please try again.');
    }
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

  // Statistics are now provided by the context
  const { pending, approved, totalDays, total } = statistics;
  
  // Calculate manual submissions
  const manualSubmissions = leaveRequests.filter(request => !request.contactNumber).length;


  return (
    <div className="h-full">
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Form Management</h2>
            <p className="text-gray-600 mt-1">Manage employee form submissions and approvals</p>
            {leaveRequests.length === 0 && (
              <div className="text-sm text-blue-600 mt-2">
                <p>
                  💡 <strong>Test the integration:</strong> Click "Application Form" in the navbar to submit a leave request, then return here to see it appear in real-time!
                </p>
                <button
                  onClick={() => {
                    console.log('Testing context...');
                    console.log('leaveRequests:', leaveRequests);
                    console.log('addLeaveRequest function:', typeof addLeaveRequest);
                    alert(`Context Test:\nLeave Requests: ${leaveRequests.length}\nAdd Function: ${typeof addLeaveRequest}`);
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
              onClick={exportBulkRequests}
              disabled={sortedLeaveRequests.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all data? This will remove all leave requests including dummy data.')) {
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
            Add Leave Request
          </button>
          </div>
        </div>
      </div>

      {/* Form Type Selection */}
      <div className="px-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">Select Form Type</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { id: 'leave', name: 'Leave Requests', icon: '🏖️', count: leaveRequests.length },
                { id: 'overtime', name: 'Overtime', icon: '⏰', count: overtimeRequests.length },
                { id: 'business-trip', name: 'Business Trip', icon: '✈️', count: businessTripRequests.length },
                { id: 'equipment', name: 'Equipment', icon: '💻', count: equipmentRequests.length },
                { id: 'training', name: 'Training', icon: '📚', count: trainingRequests.length }
              ].map((form) => (
                <button
                  key={form.id}
                  onClick={() => setActiveFormType(form.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    activeFormType === form.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">{form.icon}</div>
                  <div className="text-sm font-medium text-center">{form.name}</div>
                  <div className="text-xs text-center mt-1">({form.count})</div>
                </button>
              ))}
            </div>
          </div>
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
              <p className="text-2xl font-bold text-gray-900">{total}</p>
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
          <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeFormType === 'leave' && 'Leave Requests'}
            {activeFormType === 'overtime' && 'Overtime Requests'}
            {activeFormType === 'business-trip' && 'Business Trip Requests'}
            {activeFormType === 'equipment' && 'Equipment Requests'}
            {activeFormType === 'training' && 'Training Requests'}
          </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOnlyForms"
                  checked={showOnlyFormSubmissions}
                  onChange={(e) => setShowOnlyFormSubmissions(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="showOnlyForms" className="text-sm font-medium text-gray-700">
                  Show only Application Form submissions
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportBulkRequests}
                  disabled={sortedLeaveRequests.length === 0}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                <div className="text-sm text-gray-500">
                  {sortedLeaveRequests.length} of {leaveRequests.length} requests
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Details</th>
                {activeFormType === 'leave' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>}
                {activeFormType === 'overtime' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>}
                {activeFormType === 'business-trip' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>}
                {activeFormType === 'equipment' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>}
                {activeFormType === 'training' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeFormType === 'leave' && 'Duration'}
                  {activeFormType === 'overtime' && 'Date & Time'}
                  {activeFormType === 'business-trip' && 'Duration'}
                  {activeFormType === 'equipment' && 'Quantity'}
                  {activeFormType === 'training' && 'Duration'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {activeFormType === 'leave' && 'Leave Requests'}
                        {activeFormType === 'overtime' && 'Overtime Requests'}
                        {activeFormType === 'business-trip' && 'Business Trip Requests'}
                        {activeFormType === 'equipment' && 'Equipment Requests'}
                        {activeFormType === 'training' && 'Training Requests'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {showOnlyFormSubmissions 
                          ? `No ApplicationForm submissions yet. Submit a ${activeFormType} request through the Application Form in the navbar.`
                          : `No ${activeFormType} requests found. Add a new request or submit through the Application Form.`
                        }
                      </p>
                      {!showOnlyFormSubmissions && (
                        <button
                          onClick={() => setIsAddingNew(true)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Add First {activeFormType === 'leave' && 'Leave Request'}
                          {activeFormType === 'overtime' && 'Overtime Request'}
                          {activeFormType === 'business-trip' && 'Business Trip Request'}
                          {activeFormType === 'equipment' && 'Equipment Request'}
                          {activeFormType === 'training' && 'Training Request'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRequests.map((request) => (
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
                      {request.department && (
                        <div className="text-xs text-gray-400">{request.department} • {request.position}</div>
                      )}
                      {request.contactNumber && (
                        <div className="text-xs text-gray-400">📞 {request.contactNumber}</div>
                      )}
                      {request.emergencyContact && (
                        <div className="text-xs text-gray-400">🚨 Emergency: {request.emergencyContact}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activeFormType === 'leave' && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveTypeColor(request.leaveType)}`}>
                        {request.leaveType}
                      </span>
                    )}
                    {activeFormType === 'overtime' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {request.hours || request.totalHours} hours
                      </span>
                    )}
                    {activeFormType === 'business-trip' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {request.destination}
                      </span>
                    )}
                    {activeFormType === 'equipment' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {request.equipmentType}
                      </span>
                    )}
                    {activeFormType === 'training' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        {request.trainingTitle}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activeFormType === 'leave' && (
                      <div>
                        <div className="text-sm text-gray-900">{request.startDate} to {request.endDate}</div>
                        <div className="text-sm text-gray-500">{request.days} days</div>
                      </div>
                    )}
                    {activeFormType === 'overtime' && (
                      <div>
                        <div className="text-sm text-gray-900">{request.date}</div>
                        <div className="text-sm text-gray-500">{request.startTime} - {request.endTime}</div>
                      </div>
                    )}
                    {activeFormType === 'business-trip' && (
                      <div>
                        <div className="text-sm text-gray-900">{request.startDate} to {request.endDate}</div>
                        <div className="text-sm text-gray-500">${request.estimatedCost}</div>
                      </div>
                    )}
                    {activeFormType === 'equipment' && (
                      <div>
                        <div className="text-sm text-gray-900">{request.equipmentName}</div>
                        <div className="text-sm text-gray-500">Qty: {request.quantity}</div>
                      </div>
                    )}
                    {activeFormType === 'training' && (
                      <div>
                        <div className="text-sm text-gray-900">{request.startDate} to {request.endDate}</div>
                        <div className="text-sm text-gray-500">${request.cost}</div>
                      </div>
                    )}
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
                      <button 
                        onClick={() => exportIndividualRequest(request)}
                        className="text-purple-600 hover:text-purple-900 flex items-center"
                        title="Export to Word Document"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
