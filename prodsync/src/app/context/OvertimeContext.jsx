'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OvertimeContext = createContext();

export const useOvertimeContext = () => {
  const context = useContext(OvertimeContext);
  if (!context) {
    throw new Error('useOvertimeContext must be used within an OvertimeProvider');
  }
  return context;
};

export const OvertimeProvider = ({ children }) => {
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load overtime requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('overtimeRequests');
    if (savedRequests) {
      try {
        setOvertimeRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Error loading overtime requests from localStorage:', error);
        setOvertimeRequests([]); // Start with empty array if there's an error
      }
    }
    // No dummy data - start with empty array for real-time data only
  }, []);

  // Save to localStorage whenever overtimeRequests changes
  useEffect(() => {
    localStorage.setItem('overtimeRequests', JSON.stringify(overtimeRequests));
  }, [overtimeRequests]);

  const addOvertimeRequest = (requestData) => {
    const newRequest = {
      id: Date.now() + Math.random(), // Generate unique ID
      ...requestData,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      approvedBy: null,
      approvedDate: null,
    };
    setOvertimeRequests((prev) => [newRequest, ...prev]);
  };

  const updateOvertimeRequest = (id, updatedFields) => {
    setOvertimeRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updatedFields } : req))
    );
  };

  const approveOvertimeRequest = (id, approvedBy) => {
    updateOvertimeRequest(id, {
      status: 'Approved',
      approvedBy,
      approvedDate: new Date().toISOString().split('T')[0],
    });
  };

  const rejectOvertimeRequest = (id, rejectedBy) => {
    updateOvertimeRequest(id, {
      status: 'Rejected',
      approvedBy: rejectedBy, // Using approvedBy to store who rejected
      approvedDate: new Date().toISOString().split('T')[0],
    });
  };

  const deleteOvertimeRequest = (id) => {
    setOvertimeRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const getOvertimeRequestById = (id) => {
    return overtimeRequests.find((req) => req.id === id);
  };

  const getPendingRequests = () => {
    return overtimeRequests.filter((req) => req.status === 'Pending');
  };

  const getApprovedRequests = () => {
    return overtimeRequests.filter((req) => req.status === 'Approved');
  };

  const getRejectedRequests = () => {
    return overtimeRequests.filter((req) => req.status === 'Rejected');
  };

  const getRequestsByEmployee = (employeeId) => {
    return overtimeRequests.filter((req) => req.employeeId === employeeId);
  };

  const getRequestsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return overtimeRequests.filter((req) => {
      const requestDate = new Date(req.date);
      return requestDate >= start && requestDate <= end;
    });
  };

  const getOvertimeStatistics = () => {
    const total = overtimeRequests.length;
    const pending = getPendingRequests().length;
    const approved = getApprovedRequests().length;
    const rejected = getRejectedRequests().length;
    
    // Only count hours and pay for APPROVED requests
    const totalHours = overtimeRequests
      .filter(req => req.status === 'Approved')
      .reduce((sum, req) => sum + (req.hours || 0), 0);
    
    const totalPay = overtimeRequests
      .filter(req => req.status === 'Approved')
      .reduce((sum, req) => sum + (req.payAmount || 0), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      totalHours,
      totalPay,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  };

  const clearAllData = () => {
    setOvertimeRequests([]);
    localStorage.removeItem('overtimeRequests');
  };

  const value = {
    overtimeRequests,
    isLoading,
    addOvertimeRequest,
    updateOvertimeRequest,
    approveOvertimeRequest,
    rejectOvertimeRequest,
    deleteOvertimeRequest,
    getOvertimeRequestById,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getRequestsByEmployee,
    getRequestsByDateRange,
    getOvertimeStatistics,
    clearAllData
  };

  return (
    <OvertimeContext.Provider value={value}>
      {children}
    </OvertimeContext.Provider>
  );
};
