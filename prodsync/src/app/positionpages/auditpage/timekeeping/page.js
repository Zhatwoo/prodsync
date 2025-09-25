'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import AttendanceOverview from '../../../components/hrui/timekeepingcomponents/AttendanceOverview';
import TimeTracking from '../../../components/hrui/timekeepingcomponents/TimeTracking';
import LeaveManagement from '../../../components/hrui/timekeepingcomponents/LeaveManagement';
import OvertimeManagement from '../../../components/hrui/timekeepingcomponents/OvertimeManagement';
import ScheduleManagement from '../../../components/hrui/timekeepingcomponents/ScheduleManagement';
import AttendanceReports from '../../../components/hrui/timekeepingcomponents/AttendanceReports';

export default function AuditTimekeepingPage() {
  const [activeTab, setActiveTab] = useState('attendanceOverview');
  const [liveData, setLiveData] = useState({
    attendanceRate: 0,
    activeEmployees: 0,
    leaveRequests: 0,
    overtimeHours: 0,
    totalSchedules: 0,
    reportsGenerated: 0,
    isLoading: true,
    error: null
  });

  // Fetch live data from all timekeeping components
  useEffect(() => {
    fetchLiveData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
      setLiveData(prev => ({ ...prev, isLoading: true, error: null }));

      // Helper function to safely fetch data from collections
      const safeFetchCollection = async (collectionName) => {
        try {
          const ref = collection(db, collectionName);
          const snapshot = await getDocs(ref);
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          return data;
        } catch (error) {
          console.warn(`Failed to fetch ${collectionName}:`, error);
          return []; // Return empty array if collection doesn't exist or permission denied
        }
      };

      // Fetch all data in parallel with error handling
      const [
        attendanceData,
        employeesData,
        leaveData,
        overtimeData,
        schedulesData,
        reportsData
      ] = await Promise.all([
        safeFetchCollection('attendance'),
        safeFetchCollection('employees'),
        safeFetchCollection('leaveRequests'),
        safeFetchCollection('overtimeRequests'),
        safeFetchCollection('schedules'),
        safeFetchCollection('attendanceReports')
      ]);

      // Calculate live statistics with safe defaults
      const totalEmployees = employeesData.length;
      const presentEmployees = attendanceData.filter(record => 
        record.status === 'Present' || record.status === 'Completed'
      ).length;
      const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 0;
      
      const activeEmployees = new Set(attendanceData.map(record => record.employeeId)).size;
      const leaveRequests = leaveData.length;
      const overtimeHours = overtimeData.reduce((sum, record) => sum + (record.hours || 0), 0);
      const totalSchedules = schedulesData.length;
      const reportsGenerated = reportsData.length;

      setLiveData({
        attendanceRate,
        activeEmployees,
        leaveRequests,
        overtimeHours: Math.round(overtimeHours * 100) / 100,
        totalSchedules,
        reportsGenerated,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching live data:', error);
      setLiveData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message.includes('permission') 
          ? 'Permission denied. Please check your user role and Firebase rules.'
          : 'Failed to load live data'
      }));
    }
  };

  const tabs = [
    { 
      id: 'attendanceOverview', 
      name: 'Attendance Overview', 
      icon: '⏰', 
      badge: liveData.isLoading ? '...' : `${liveData.attendanceRate}%` 
    },
    { id: 'timeTracking', name: 'Time Tracking', icon: '📱' },
    { 
      id: 'leaveManagement', 
      name: 'Leave Management', 
      icon: '🏖️', 
      badge: liveData.isLoading ? '...' : liveData.leaveRequests.toString() 
    },
    { 
      id: 'overtimeManagement', 
      name: 'Overtime Management', 
      icon: '⏱️',
      badge: liveData.isLoading ? '...' : `${liveData.overtimeHours}h`
    },
    { 
      id: 'scheduleManagement', 
      name: 'Schedule Management', 
      icon: '📅',
      badge: liveData.isLoading ? '...' : liveData.totalSchedules.toString()
    },
    { 
      id: 'attendanceReports', 
      name: 'Attendance Reports', 
      icon: '📋',
      badge: liveData.isLoading ? '...' : liveData.reportsGenerated.toString()
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'attendanceOverview':
        return <AttendanceOverview />;
      case 'timeTracking':
        return <TimeTracking />;
      case 'leaveManagement':
        return <LeaveManagement />;
      case 'overtimeManagement':
        return <OvertimeManagement />;
      case 'scheduleManagement':
        return <ScheduleManagement />;
      case 'attendanceReports':
        return <AttendanceReports />;
      default:
        return <AttendanceOverview />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="p-6 bg-white shadow-sm border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center justify-center lg:justify-start">
              <span className="mr-3 text-3xl sm:text-4xl">🔍</span>
              Audit Timekeeping System
            </h1>
            <div className="flex items-center justify-between">
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Monitor and audit attendance, time tracking, leaves, overtime, and schedules</p>
              <button
                onClick={fetchLiveData}
                disabled={liveData.isLoading}
                className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {liveData.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </>
                )}
              </button>
            </div>
            {liveData.error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    ⚠️ {liveData.error}
                    {liveData.error.includes('permission') && (
                      <div className="mt-1 text-xs text-red-500">
                        Make sure you have the correct user role (HR, Admin, or Auditor) to access this data.
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={fetchLiveData}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-orange-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {liveData.isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  `${liveData.attendanceRate}%`
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Compliance Rate</div>
            </div>
            <div className="bg-purple-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {liveData.isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  liveData.activeEmployees
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Active Employees</div>
            </div>
            <div className="bg-green-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {liveData.isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  liveData.leaveRequests
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Leave Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto py-2 sm:py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
                {tab.badge && (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Live Data Summary */}
      <div className="mx-6 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Live System Overview
          </h3>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {liveData.isLoading ? '...' : liveData.attendanceRate}%
            </div>
            <div className="text-xs text-gray-600">Attendance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {liveData.isLoading ? '...' : liveData.activeEmployees}
            </div>
            <div className="text-xs text-gray-600">Active Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {liveData.isLoading ? '...' : liveData.leaveRequests}
            </div>
            <div className="text-xs text-gray-600">Leave Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {liveData.isLoading ? '...' : liveData.overtimeHours}h
            </div>
            <div className="text-xs text-gray-600">Overtime Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {liveData.isLoading ? '...' : liveData.totalSchedules}
            </div>
            <div className="text-xs text-gray-600">Total Schedules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {liveData.isLoading ? '...' : liveData.reportsGenerated}
            </div>
            <div className="text-xs text-gray-600">Reports Generated</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderActiveComponent()}
      </div>
    </>
  );
}
