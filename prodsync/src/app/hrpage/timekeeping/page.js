'use client';

import { useState } from 'react';
import HrSidebar from '../../components/hrui/HrSidebar';
import AttendanceOverview from '../../components/hrui/timekeepingcomponents/AttendanceOverview';
import TimeTracking from '../../components/hrui/timekeepingcomponents/TimeTracking';
import LeaveManagement from '../../components/hrui/timekeepingcomponents/LeaveManagement';
import OvertimeManagement from '../../components/hrui/timekeepingcomponents/OvertimeManagement';
import ScheduleManagement from '../../components/hrui/timekeepingcomponents/ScheduleManagement';
import AttendanceReports from '../../components/hrui/timekeepingcomponents/AttendanceReports';

export default function TimekeepingPage() {
  const [activeTab, setActiveTab] = useState('attendanceOverview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'attendanceOverview', name: 'Attendance Overview', icon: '⏰', badge: '94%' },
    { id: 'timeTracking', name: 'Time Tracking', icon: '📱' },
    { id: 'leaveManagement', name: 'Leave Management', icon: '🏖️', badge: '23' },
    { id: 'overtimeManagement', name: 'Overtime Management', icon: '⏱️' },
    { id: 'scheduleManagement', name: 'Schedule Management', icon: '📅' },
    { id: 'attendanceReports', name: 'Attendance Reports', icon: '📋' }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <HrSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16 sm:ml-16' : 'ml-64 sm:ml-72'
      }`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Time Keeping Management</h1>
                  <p className="mt-2 text-gray-600">Manage attendance, time tracking, leaves, overtime, and schedules</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-purple-600">94%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-blue-600">25</div>
                    <div className="text-sm text-gray-600">Active Employees</div>
                  </div>
                  <div className="bg-green-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-gray-600">Leave Requests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
