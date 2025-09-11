'use client';

import { useState } from 'react';
import HrSidebar from './HrSidebar';
import Navbar from '../Navbar';

export default function HrDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Employee Record Statistics
  const employeeStats = [
    { 
      title: 'Total Employees', 
      value: '1,247', 
      change: '+5.2%', 
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    { 
      title: 'New Hires This Month', 
      value: '23', 
      change: '+15%', 
      changeType: 'positive',
      icon: '➕',
      color: 'green'
    },
    { 
      title: 'Departments', 
      value: '6', 
      change: '+1', 
      changeType: 'positive',
      icon: '🏢',
      color: 'purple'
    },
    { 
      title: 'Positions', 
      value: '12', 
      change: '+2', 
      changeType: 'positive',
      icon: '💼',
      color: 'indigo'
    }
  ];

  // Payroll Statistics
  const payrollStats = [
    { 
      title: 'Monthly Payroll', 
      value: '$2.4M', 
      change: '+3.1%', 
      changeType: 'positive',
      icon: '💰',
      color: 'green'
    },
    { 
      title: 'Average Salary', 
      value: '$4,200', 
      change: '+2.5%', 
      changeType: 'positive',
      icon: '📊',
      color: 'blue'
    },
    { 
      title: 'Benefits Cost', 
      value: '$480K', 
      change: '+1.8%', 
      changeType: 'positive',
      icon: '🎁',
      color: 'yellow'
    },
    { 
      title: 'Tax Deductions', 
      value: '$360K', 
      change: '+4.2%', 
      changeType: 'positive',
      icon: '🧾',
      color: 'red'
    }
  ];

  // Time Keeping Statistics
  const timeKeepingStats = [
    { 
      title: 'Attendance Rate', 
      value: '94.5%', 
      change: '+1.8%', 
      changeType: 'positive',
      icon: '⏰',
      color: 'green'
    },
    { 
      title: 'Pending Leaves', 
      value: '23', 
      change: '-12%', 
      changeType: 'negative',
      icon: '🏖️',
      color: 'yellow'
    },
    { 
      title: 'Overtime Hours', 
      value: '1,247', 
      change: '+8.5%', 
      changeType: 'positive',
      icon: '⏱️',
      color: 'purple'
    },
    { 
      title: 'Late Arrivals', 
      value: '45', 
      change: '-15%', 
      changeType: 'negative',
      icon: '📱',
      color: 'red'
    }
  ];

  // Recent Activities
  const recentActivities = [
    { 
      id: 1, 
      action: 'New employee onboarded', 
      user: 'Sarah Johnson', 
      time: '2 hours ago', 
      type: 'employee',
      icon: '👤'
    },
    { 
      id: 2, 
      action: 'Payroll processed for March', 
      user: 'Mike Chen', 
      time: '4 hours ago', 
      type: 'payroll',
      icon: '💰'
    },
    { 
      id: 3, 
      action: 'Leave request approved', 
      user: 'Emily Davis', 
      time: '6 hours ago', 
      type: 'leave',
      icon: '🏖️'
    },
    { 
      id: 4, 
      action: 'Department restructured', 
      user: 'David Wilson', 
      time: '8 hours ago', 
      type: 'department',
      icon: '🏢'
    },
    { 
      id: 5, 
      action: 'Overtime hours logged', 
      user: 'Lisa Brown', 
      time: '10 hours ago', 
      type: 'overtime',
      icon: '⏱️'
    }
  ];

  // Upcoming Events
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Performance Review Meeting', 
      date: 'Today, 2:00 PM', 
      type: 'meeting',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Payroll Deadline', 
      date: 'Tomorrow, 5:00 PM', 
      type: 'deadline',
      priority: 'high'
    },
    { 
      id: 3, 
      title: 'HR Training Session', 
      date: 'Friday, 10:00 AM', 
      type: 'training',
      priority: 'medium'
    },
    { 
      id: 4, 
      title: 'Employee Survey Launch', 
      date: 'Next Monday', 
      type: 'survey',
      priority: 'medium'
    }
  ];

  // Department Overview
  const departmentStats = [
    { name: 'Engineering', employees: 245, growth: '+8%', color: 'bg-blue-500' },
    { name: 'Marketing', employees: 89, growth: '+12%', color: 'bg-green-500' },
    { name: 'Sales', employees: 156, growth: '+5%', color: 'bg-purple-500' },
    { name: 'HR', employees: 23, growth: '+15%', color: 'bg-yellow-500' },
    { name: 'Finance', employees: 45, growth: '+3%', color: 'bg-red-500' },
    { name: 'Operations', employees: 189, growth: '+7%', color: 'bg-indigo-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <HrSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">HR Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">

          {/* Key Metrics with Visual Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Employees</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-blue-200 text-xs">+5.2% this month</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Monthly Payroll</p>
                  <p className="text-3xl font-bold">$2.4M</p>
                  <p className="text-green-200 text-xs">+3.1% vs last month</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Attendance Rate</p>
                  <p className="text-3xl font-bold">94.5%</p>
                  <p className="text-purple-200 text-xs">+1.8% improvement</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending Leaves</p>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-orange-200 text-xs">-12% from last week</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏖️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Department Distribution Chart */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Engineering</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">245</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Sales</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">156</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Marketing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">89</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Operations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">189</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Trend */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-32 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Mon</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Tue</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Wed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Thu</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-blue-500 rounded-t" style={{height: '85%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Fri</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '45%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Sat</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '30%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Sun</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Average: 94.5%</span>
                <span className="text-green-600">+2.1% vs last week</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Employee Actions</h3>
                  <p className="text-sm text-gray-600">Manage your workforce</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">Add New Employee</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">View All Employees</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payroll Actions</h3>
                  <p className="text-sm text-gray-600">Handle salary & benefits</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors border border-green-200">
                  <span className="text-gray-700 font-medium">Process Payroll</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors border border-green-200">
                  <span className="text-gray-700 font-medium">Salary Reports</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Time Actions</h3>
                  <p className="text-sm text-gray-600">Track attendance & time</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-purple-50 rounded-lg transition-colors border border-purple-200">
                  <span className="text-gray-700 font-medium">Attendance Report</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-purple-50 rounded-lg transition-colors border border-purple-200">
                  <span className="text-gray-700 font-medium">Leave Requests</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
