'use client';

import { useState, useEffect } from 'react';
import { useLeaveContext } from '../../context/LeaveContext';
import { useOvertimeContext } from '../../context/OvertimeContext';

export default function ApplicationFormModal({ isOpen, onClose }) {
  const { addLeaveRequest } = useLeaveContext();
  const { addOvertimeRequest } = useOvertimeContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeForm, setActiveForm] = useState('leave');
  const [isClosing, setIsClosing] = useState(false);
  
  // Leave Application Form State
  const [leaveForm, setLeaveForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    totalDays: '',
    reason: '',
    contactNumber: '',
    emergencyContact: '',
    supervisorApproval: false,
    hrApproval: false
  });

  // Overtime Application Form State
  const [overtimeForm, setOvertimeForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    date: '',
    startTime: '',
    endTime: '',
    totalHours: '',
    reason: '',
    supervisorApproval: false,
    hrApproval: false
  });

  // Business Trip Application Form State
  const [businessTripForm, setBusinessTripForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    destination: '',
    purpose: '',
    startDate: '',
    endDate: '',
    estimatedCost: '',
    transportation: '',
    accommodation: '',
    supervisorApproval: false,
    hrApproval: false
  });

  // Equipment Request Form State
  const [equipmentForm, setEquipmentForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    equipmentType: '',
    equipmentName: '',
    quantity: '',
    reason: '',
    urgency: '',
    supervisorApproval: false,
    itApproval: false
  });

  // Training Request Form State
  const [trainingForm, setTrainingForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    trainingTitle: '',
    trainingProvider: '',
    startDate: '',
    endDate: '',
    cost: '',
    reason: '',
    supervisorApproval: false,
    hrApproval: false
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  };

  const handleFormSubmit = (formType) => {
    let formData;
    switch (formType) {
      case 'leave':
        // Calculate days for leave request
        const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
        formData = {
          ...leaveForm,
          days: days,
          employeeId: leaveForm.employeeId || `EMP${Date.now().toString().slice(-6)}`
        };
        
        // Add to shared leave context
        addLeaveRequest(formData);
        alert('Leave application submitted successfully! HR will review your request.\n\n✅ Your request is now visible in the Leave Management system.');
        break;
      case 'overtime':
        // Calculate hours for overtime request
        const hours = calculateHours(overtimeForm.startTime, overtimeForm.endTime);
        const baseRate = 50; // Assuming $50 base rate
        const payAmount = hours * 1.5 * baseRate; // Default 1.5x overtime rate
        
        formData = {
          ...overtimeForm,
          hours: hours,
          rate: 1.5,
          payAmount: payAmount,
          employeeId: overtimeForm.employeeId || `EMP${Date.now().toString().slice(-6)}`,
          project: 'General Project', // Default project
          projectId: 'GEN001'
        };
        
        // Add to shared overtime context
        addOvertimeRequest(formData);
        alert('Overtime application submitted successfully! HR will review your request.\n\n✅ Your request is now visible in the Overtime Management system.');
        break;
      case 'business-trip':
        formData = businessTripForm;
        // Here you would typically send business trip data to your backend
        console.log('Business trip form submitted:', formData);
        alert('Business trip application submitted successfully!');
        break;
      case 'equipment':
        formData = equipmentForm;
        // Here you would typically send equipment data to your backend
        console.log('Equipment form submitted:', formData);
        alert('Equipment request submitted successfully!');
        break;
      case 'training':
        formData = trainingForm;
        // Here you would typically send training data to your backend
        console.log('Training form submitted:', formData);
        alert('Training request submitted successfully!');
        break;
      default:
        return;
    }
    
    // Reset form after submission
    switch (formType) {
      case 'leave':
        setLeaveForm({
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          leaveType: '',
          startDate: '',
          endDate: '',
          totalDays: '',
          reason: '',
          contactNumber: '',
          emergencyContact: '',
          supervisorApproval: false,
          hrApproval: false
        });
        break;
      case 'overtime':
        setOvertimeForm({
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          date: '',
          startTime: '',
          endTime: '',
          totalHours: '',
          reason: '',
          supervisorApproval: false,
          hrApproval: false
        });
        break;
      case 'business-trip':
        setBusinessTripForm({
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          destination: '',
          purpose: '',
          startDate: '',
          endDate: '',
          estimatedCost: '',
          transportation: '',
          accommodation: '',
          supervisorApproval: false,
          hrApproval: false
        });
        break;
      case 'equipment':
        setEquipmentForm({
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          equipmentType: '',
          equipmentName: '',
          quantity: '',
          reason: '',
          urgency: '',
          supervisorApproval: false,
          itApproval: false
        });
        break;
      case 'training':
        setTrainingForm({
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          trainingTitle: '',
          trainingProvider: '',
          startDate: '',
          endDate: '',
          cost: '',
          reason: '',
          supervisorApproval: false,
          hrApproval: false
        });
        break;
    }
  };

  const formTypes = [
    { id: 'leave', name: 'Leave Request', icon: '🏖️' },
    { id: 'overtime', name: 'Overtime', icon: '⏰' },
    { id: 'business-trip', name: 'Business Trip', icon: '✈️' },
    { id: 'equipment', name: 'Equipment', icon: '💻' },
    { id: 'training', name: 'Training', icon: '📚' }
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed top-16 right-50 z-50 w-[900px] max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
    }`} data-modal="application-form">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Application Forms</h2>
              <p className="text-indigo-100 mt-1">{formatDate(currentTime)}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-indigo-200 transition-colors"
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

          {/* Form Type Selection */}
          <div className="bg-white border border-gray-200 rounded-lg mb-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-900">Select Form Type</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {formTypes.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setActiveForm(form.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      activeForm === form.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-800'
                    }`}
                  >
                    <div className="text-2xl mb-2">{form.icon}</div>
                    <div className="text-sm font-medium text-center">{form.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-900">
                {formTypes.find(f => f.id === activeForm)?.name} Form
              </h3>
            </div>

            <div className="p-4">
              {/* Leave Application Form */}
              {activeForm === 'leave' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee Name</label>
                      <input
                        type="text"
                        value={leaveForm.employeeName}
                        onChange={(e) => setLeaveForm({...leaveForm, employeeName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee ID</label>
                      <input
                        type="text"
                        value={leaveForm.employeeId}
                        onChange={(e) => setLeaveForm({...leaveForm, employeeId: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Employee ID"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Department</label>
                      <select
                        value={leaveForm.department}
                        onChange={(e) => setLeaveForm({...leaveForm, department: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Department</option>
                        <option value="HR">Human Resources</option>
                        <option value="IT">Information Technology</option>
                        <option value="Finance">Finance & Accounting</option>
                        <option value="Marketing">Marketing & Sales</option>
                        <option value="Operations">Operations</option>
                        <option value="Customer Service">Customer Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Position</label>
                      <input
                        type="text"
                        value={leaveForm.position}
                        onChange={(e) => setLeaveForm({...leaveForm, position: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Position"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Leave Type</label>
                      <select
                        value={leaveForm.leaveType}
                        onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Leave Type</option>
                        <option value="Annual Leave">Annual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Personal Leave">Personal Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Paternity Leave">Paternity Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Total Days</label>
                      <input
                        type="number"
                        value={leaveForm.totalDays}
                        onChange={(e) => setLeaveForm({...leaveForm, totalDays: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Days"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">End Date</label>
                      <input
                        type="date"
                        value={leaveForm.endDate}
                        onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Reason for Leave</label>
                    <textarea
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Reason for leave request"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        value={leaveForm.contactNumber}
                        onChange={(e) => setLeaveForm({...leaveForm, contactNumber: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Contact number"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Emergency Contact</label>
                      <input
                        type="text"
                        value={leaveForm.emergencyContact}
                        onChange={(e) => setLeaveForm({...leaveForm, emergencyContact: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Emergency contact"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFormSubmit('leave')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Submit Leave Request
                    </button>
                  </div>
                </div>
              )}

              {/* Overtime Application Form */}
              {activeForm === 'overtime' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee Name</label>
                      <input
                        type="text"
                        value={overtimeForm.employeeName}
                        onChange={(e) => setOvertimeForm({...overtimeForm, employeeName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee ID</label>
                      <input
                        type="text"
                        value={overtimeForm.employeeId}
                        onChange={(e) => setOvertimeForm({...overtimeForm, employeeId: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Employee ID"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Date</label>
                      <input
                        type="date"
                        value={overtimeForm.date}
                        onChange={(e) => setOvertimeForm({...overtimeForm, date: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={overtimeForm.startTime}
                        onChange={(e) => setOvertimeForm({...overtimeForm, startTime: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">End Time</label>
                      <input
                        type="time"
                        value={overtimeForm.endTime}
                        onChange={(e) => setOvertimeForm({...overtimeForm, endTime: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Total Hours</label>
                      <input
                        type="number"
                        value={overtimeForm.totalHours}
                        onChange={(e) => setOvertimeForm({...overtimeForm, totalHours: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Hours"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Reason for Overtime</label>
                    <textarea
                      value={overtimeForm.reason}
                      onChange={(e) => setOvertimeForm({...overtimeForm, reason: e.target.value})}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Reason for overtime work"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFormSubmit('overtime')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Submit Overtime Request
                    </button>
                  </div>
                </div>
              )}

              {/* Business Trip Application Form */}
              {activeForm === 'business-trip' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee Name</label>
                      <input
                        type="text"
                        value={businessTripForm.employeeName}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, employeeName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Destination</label>
                      <input
                        type="text"
                        value={businessTripForm.destination}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, destination: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Destination"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={businessTripForm.startDate}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, startDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">End Date</label>
                      <input
                        type="date"
                        value={businessTripForm.endDate}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, endDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Estimated Cost</label>
                      <input
                        type="number"
                        value={businessTripForm.estimatedCost}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, estimatedCost: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Cost (USD)"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Transportation</label>
                      <select
                        value={businessTripForm.transportation}
                        onChange={(e) => setBusinessTripForm({...businessTripForm, transportation: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Transportation</option>
                        <option value="Flight">Flight</option>
                        <option value="Train">Train</option>
                        <option value="Car">Car</option>
                        <option value="Bus">Bus</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Purpose of Trip</label>
                    <textarea
                      value={businessTripForm.purpose}
                      onChange={(e) => setBusinessTripForm({...businessTripForm, purpose: e.target.value})}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Purpose of business trip"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFormSubmit('business-trip')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Submit Business Trip Request
                    </button>
                  </div>
                </div>
              )}

              {/* Equipment Request Form */}
              {activeForm === 'equipment' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee Name</label>
                      <input
                        type="text"
                        value={equipmentForm.employeeName}
                        onChange={(e) => setEquipmentForm({...equipmentForm, employeeName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Equipment Type</label>
                      <select
                        value={equipmentForm.equipmentType}
                        onChange={(e) => setEquipmentForm({...equipmentForm, equipmentType: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Equipment Type</option>
                        <option value="Computer">Computer</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Printer">Printer</option>
                        <option value="Phone">Phone</option>
                        <option value="Software">Software</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Equipment Name</label>
                      <input
                        type="text"
                        value={equipmentForm.equipmentName}
                        onChange={(e) => setEquipmentForm({...equipmentForm, equipmentName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Equipment name/model"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Quantity</label>
                      <input
                        type="number"
                        value={equipmentForm.quantity}
                        onChange={(e) => setEquipmentForm({...equipmentForm, quantity: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Quantity"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Urgency</label>
                      <select
                        value={equipmentForm.urgency}
                        onChange={(e) => setEquipmentForm({...equipmentForm, urgency: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Urgency</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Reason for Request</label>
                    <textarea
                      value={equipmentForm.reason}
                      onChange={(e) => setEquipmentForm({...equipmentForm, reason: e.target.value})}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Reason for equipment request"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFormSubmit('equipment')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Submit Equipment Request
                    </button>
                  </div>
                </div>
              )}

              {/* Training Request Form */}
              {activeForm === 'training' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Employee Name</label>
                      <input
                        type="text"
                        value={trainingForm.employeeName}
                        onChange={(e) => setTrainingForm({...trainingForm, employeeName: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Training Title</label>
                      <input
                        type="text"
                        value={trainingForm.trainingTitle}
                        onChange={(e) => setTrainingForm({...trainingForm, trainingTitle: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Training title"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Training Provider</label>
                      <input
                        type="text"
                        value={trainingForm.trainingProvider}
                        onChange={(e) => setTrainingForm({...trainingForm, trainingProvider: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Provider/institution"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Cost</label>
                      <input
                        type="number"
                        value={trainingForm.cost}
                        onChange={(e) => setTrainingForm({...trainingForm, cost: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Cost (USD)"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={trainingForm.startDate}
                        onChange={(e) => setTrainingForm({...trainingForm, startDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-2">End Date</label>
                      <input
                        type="date"
                        value={trainingForm.endDate}
                        onChange={(e) => setTrainingForm({...trainingForm, endDate: e.target.value})}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Reason for Training</label>
                    <textarea
                      value={trainingForm.reason}
                      onChange={(e) => setTrainingForm({...trainingForm, reason: e.target.value})}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Reason for training request"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFormSubmit('training')}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Submit Training Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
