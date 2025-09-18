'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LeaveContext = createContext();

export const useLeaveContext = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeaveContext must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load leave requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('leaveRequests');
    if (savedRequests) {
      try {
        setLeaveRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Error loading leave requests from localStorage:', error);
        setLeaveRequests([]); // Start with empty array if there's an error
      }
    }
    // No dummy data - start with empty array for real-time data only
  }, []);

  // Save to localStorage whenever leaveRequests changes
  useEffect(() => {
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const addLeaveRequest = (requestData) => {
    const newRequest = {
      id: Date.now() + Math.random(), // Generate unique ID
      ...requestData,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null,
      createdAt: new Date().toISOString()
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateLeaveRequest = (id, updates) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, ...updates, updatedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const approveLeaveRequest = (id, approvedBy = 'HR Manager') => {
    updateLeaveRequest(id, {
      status: 'Approved',
      approvedBy,
      approvedDate: new Date().toISOString().split('T')[0]
    });
  };

  const rejectLeaveRequest = (id, approvedBy = 'HR Manager') => {
    updateLeaveRequest(id, {
      status: 'Rejected',
      approvedBy,
      approvedDate: new Date().toISOString().split('T')[0]
    });
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests(prev => prev.filter(request => request.id !== id));
  };

  const getLeaveRequestById = (id) => {
    return leaveRequests.find(request => request.id === id);
  };

  const getPendingRequests = () => {
    return leaveRequests.filter(request => request.status === 'Pending');
  };

  const getApprovedRequests = () => {
    return leaveRequests.filter(request => request.status === 'Approved');
  };

  const getRejectedRequests = () => {
    return leaveRequests.filter(request => request.status === 'Rejected');
  };

  const getRequestsByEmployee = (employeeName) => {
    return leaveRequests.filter(request => request.employeeName === employeeName);
  };

  const getRequestsByDateRange = (startDate, endDate) => {
    return leaveRequests.filter(request => {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);
      
      return (requestStart >= filterStart && requestStart <= filterEnd) ||
             (requestEnd >= filterStart && requestEnd <= filterEnd) ||
             (requestStart <= filterStart && requestEnd >= filterEnd);
    });
  };

  const getLeaveStatistics = () => {
    const total = leaveRequests.length;
    const pending = getPendingRequests().length;
    const approved = getApprovedRequests().length;
    const rejected = getRejectedRequests().length;
    const totalDays = leaveRequests.reduce((sum, req) => sum + (req.days || 0), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      totalDays,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  };

  const clearAllData = () => {
    setLeaveRequests([]);
    localStorage.removeItem('leaveRequests');
  };

  const value = {
    leaveRequests,
    isLoading,
    addLeaveRequest,
    updateLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeaveRequest,
    getLeaveRequestById,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getRequestsByEmployee,
    getRequestsByDateRange,
    getLeaveStatistics,
    clearAllData
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
};
