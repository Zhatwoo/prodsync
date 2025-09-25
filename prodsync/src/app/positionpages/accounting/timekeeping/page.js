'use client';

import { useState } from 'react';
import HrSidebar from '../../../components/hrui/HrSidebar';
import AttendanceOverview from '../../../components/hrui/timekeepingcomponents/AttendanceOverview';
import TimeTracking from '../../../components/hrui/timekeepingcomponents/TimeTracking';
import LeaveManagement from '../../../components/hrui/timekeepingcomponents/LeaveManagement';
import OvertimeManagement from '../../../components/hrui/timekeepingcomponents/OvertimeManagement';
import ScheduleManagement from '../../../components/hrui/timekeepingcomponents/ScheduleManagement';
import AttendanceReports from '../../../components/hrui/timekeepingcomponents/AttendanceReports';
import RequireRole from '../../../components/RequireRole';
import { useTimekeepingStats } from '../../../hooks/useTimekeepingStats';

export default function TimekeepingPage() {
  const [activeTab, setActiveTab] = useState('attendanceOverview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Get real-time statistics
  const stats = useTimekeepingStats();

  const tabs = [
    { id: 'attendanceOverview', name: 'Attendance Overview', icon: '⏰', badge: `${stats.attendanceRate}%` },
    { id: 'timeTracking', name: 'Time Tracking', icon: '📱' },
    { id: 'leaveManagement', name: 'Leave Management', icon: '🏖️', badge: stats.leaveRequests },
    { id: 'overtimeManagement', name: 'Overtime Management', icon: '⏱️', badge: stats.pendingOvertime },
    { id: 'scheduleManagement', name: 'Schedule Management', icon: '📅', badge: stats.totalSchedules },
    { id: 'attendanceReports', name: 'Attendance Reports', icon: '📋', badge: stats.totalReports }
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
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator', 'accounting', 'accountant']}>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content Area - Centered */}
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-4 sm:mb-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                  <div className="text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Time Keeping Management</h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage attendance, time tracking, leaves, overtime, and schedules</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-purple-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {stats.isLoading ? '...' : `${stats.attendanceRate}%`}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Attendance Rate</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {stats.isLoading ? '...' : stats.activeEmployees}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Active Employees</div>
                    </div>
                    <div className="bg-green-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {stats.isLoading ? '...' : stats.leaveRequests}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Leave Requests</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg mb-4 sm:mb-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto py-2 sm:py-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors min-w-0 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
                    {tab.badge && (
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-800'
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

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-2 sm:p-4 lg:p-6">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
