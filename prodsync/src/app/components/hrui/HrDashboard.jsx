'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';
import { useRouter } from 'next/navigation';
import { useEmployeeStats } from '../../hooks/useEmployeeStats';
import { usePayrollStats } from '../../hooks/usePayrollStats';

export default function HrDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const employeeStats = useEmployeeStats();
  const payrollStatsData = usePayrollStats();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      // Clear localStorage
      localStorage.removeItem('user');
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
    }
  };

  // Employee Record Statistics - Now using real Firebase data
  const employeeStatsData = [
    { 
      title: 'Total Employees', 
      value: employeeStats.loading ? '...' : employeeStats.totalEmployees.toLocaleString(), 
      change: employeeStats.newHiresThisMonth > 0 ? `+${employeeStats.newHiresThisMonth} this month` : 'No new hires',
      changeType: employeeStats.newHiresThisMonth > 0 ? 'positive' : 'neutral',
      icon: '👥',
      color: 'blue'
    },
    { 
      title: 'New Hires This Month', 
      value: employeeStats.loading ? '...' : employeeStats.newHiresThisMonth.toString(), 
      change: employeeStats.newHiresThisMonth > 0 ? 'Active hiring' : 'No new hires',
      changeType: employeeStats.newHiresThisMonth > 0 ? 'positive' : 'neutral',
      icon: '➕',
      color: 'green'
    },
    { 
      title: 'Departments', 
      value: employeeStats.loading ? '...' : employeeStats.totalDepartments.toString(), 
      change: employeeStats.totalDepartments > 0 ? 'Active departments' : 'No departments',
      changeType: 'positive',
      icon: '🏢',
      color: 'purple'
    },
    { 
      title: 'Positions', 
      value: employeeStats.loading ? '...' : employeeStats.totalPositions.toString(), 
      change: employeeStats.totalPositions > 0 ? 'Available positions' : 'No positions',
      changeType: 'positive',
      icon: '💼',
      color: 'indigo'
    }
  ];

  // Payroll Statistics - Now using real Firebase data
  const payrollStats = [
    { 
      title: 'Monthly Payroll', 
      value: payrollStatsData.loading ? '...' : `$${(payrollStatsData.totalGrossPay / 1000000).toFixed(1)}M`, 
      change: payrollStatsData.totalGrossPay > 0 ? 'Live data' : 'No data',
      changeType: payrollStatsData.totalGrossPay > 0 ? 'positive' : 'neutral',
      icon: '💰',
      color: 'green'
    },
    { 
      title: 'Average Salary', 
      value: payrollStatsData.loading ? '...' : `$${payrollStatsData.averageSalary.toLocaleString()}`, 
      change: payrollStatsData.averageSalary > 0 ? 'Calculated' : 'No data',
      changeType: payrollStatsData.averageSalary > 0 ? 'positive' : 'neutral',
      icon: '📊',
      color: 'blue'
    },
    { 
      title: 'Net Pay', 
      value: payrollStatsData.loading ? '...' : `$${(payrollStatsData.totalNetPay / 1000).toFixed(0)}K`, 
      change: payrollStatsData.totalNetPay > 0 ? 'After deductions' : 'No data',
      changeType: payrollStatsData.totalNetPay > 0 ? 'positive' : 'neutral',
      icon: '🎁',
      color: 'yellow'
    },
    { 
      title: 'Tax Deductions', 
      value: payrollStatsData.loading ? '...' : `$${(payrollStatsData.totalDeductions / 1000).toFixed(0)}K`, 
      change: payrollStatsData.totalDeductions > 0 ? 'Total deductions' : 'No data',
      changeType: payrollStatsData.totalDeductions > 0 ? 'positive' : 'neutral',
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
    <div className="transition-all duration-300 bg-white min-h-screen">

        {/* Dashboard Content */}
        <main className="w-full p-6">

          {/* Key Metrics with Visual Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Employees</p>
                  <p className="text-3xl font-bold">
                    {employeeStats.loading ? '...' : employeeStats.totalEmployees.toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {employeeStats.newHiresThisMonth > 0 ? `+${employeeStats.newHiresThisMonth} this month` : 'No new hires'}
                  </p>
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
                  <p className="text-3xl font-bold">
                    {payrollStatsData.loading ? '...' : `$${(payrollStatsData.totalGrossPay / 1000000).toFixed(1)}M`}
                  </p>
                  <p className="text-green-200 text-xs">
                    {payrollStatsData.totalGrossPay > 0 ? 'Live data from employees' : 'No data available'}
                  </p>
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

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Are you sure you want to logout?</h4>
                      <p className="text-gray-600 text-sm">You will need to sign in again to access the HR dashboard.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={isLoggingOut}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
