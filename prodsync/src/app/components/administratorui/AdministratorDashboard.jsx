'use client';

import { useState } from 'react';

export default function AdministratorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // HR Operations Statistics
  const hrStats = [
    { 
      title: 'Total Employees', 
      value: '1,247', 
      change: '+5.2%', 
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    { 
      title: 'Active Payroll', 
      value: '$2.4M', 
      change: '+3.1%', 
      changeType: 'positive',
      icon: '💰',
      color: 'green'
    },
    { 
      title: 'Attendance Rate', 
      value: '94.5%', 
      change: '+1.8%', 
      changeType: 'positive',
      icon: '⏰',
      color: 'purple'
    },
    { 
      title: 'Benefits Coverage', 
      value: '89%', 
      change: '+2.3%', 
      changeType: 'positive',
      icon: '🎁',
      color: 'yellow'
    }
  ];

  // Finance Statistics
  const financeStats = [
    { 
      title: 'Account Payables', 
      value: '$450K', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: '📋',
      color: 'red'
    },
    { 
      title: 'Monthly Expenses', 
      value: '$1.2M', 
      change: '+4.5%', 
      changeType: 'positive',
      icon: '💸',
      color: 'orange'
    },
    { 
      title: 'Cash Flow', 
      value: '$3.8M', 
      change: '+12.1%', 
      changeType: 'positive',
      icon: '💹',
      color: 'green'
    },
    { 
      title: 'Budget Utilization', 
      value: '76%', 
      change: '+2.8%', 
      changeType: 'positive',
      icon: '📊',
      color: 'blue'
    }
  ];

  // Sales Division Statistics
  const salesStats = [
    { 
      title: 'Active Clients', 
      value: '342', 
      change: '+15.3%', 
      changeType: 'positive',
      icon: '👤',
      color: 'emerald'
    },
    { 
      title: 'Inventory Value', 
      value: '$850K', 
      change: '+6.7%', 
      changeType: 'positive',
      icon: '📦',
      color: 'blue'
    },
    { 
      title: 'Agent Performance', 
      value: '87%', 
      change: '+4.2%', 
      changeType: 'positive',
      icon: '🎯',
      color: 'purple'
    },
    { 
      title: 'Reinvestment Rate', 
      value: '23%', 
      change: '+8.9%', 
      changeType: 'positive',
      icon: '🔄',
      color: 'green'
    }
  ];

  // Operations & Technology Statistics
  const opsTechStats = [
    { 
      title: 'Active Permits', 
      value: '156', 
      change: '+3 new', 
      changeType: 'positive',
      icon: '📜',
      color: 'orange'
    },
    { 
      title: 'Daily Visitors', 
      value: '89', 
      change: '+12.4%', 
      changeType: 'positive',
      icon: '👀',
      color: 'blue'
    },
    { 
      title: 'System Uptime', 
      value: '99.8%', 
      change: '+0.1%', 
      changeType: 'positive',
      icon: '📱',
      color: 'green'
    },
    { 
      title: 'Active Lines', 
      value: '24', 
      change: '100%', 
      changeType: 'neutral',
      icon: '📞',
      color: 'indigo'
    }
  ];

  // Recent Activities
  const recentActivities = [
    { 
      id: 1, 
      action: 'New employee onboarded', 
      user: 'Sarah Johnson', 
      time: '2 hours ago', 
      type: 'hr',
      icon: '👤',
      section: 'HR Operations'
    },
    { 
      id: 2, 
      action: 'Government compliance report submitted', 
      user: 'Mike Chen', 
      time: '4 hours ago', 
      type: 'government',
      icon: '📋',
      section: 'Government & Compliance'
    },
    { 
      id: 3, 
      action: 'Monthly expenses processed', 
      user: 'Emily Davis', 
      time: '6 hours ago', 
      type: 'finance',
      icon: '💸',
      section: 'Finance'
    },
    { 
      id: 4, 
      action: 'New permit approved', 
      user: 'David Wilson', 
      time: '8 hours ago', 
      type: 'operations',
      icon: '📜',
      section: 'Operations'
    },
    { 
      id: 5, 
      action: 'System backup completed', 
      user: 'Lisa Brown', 
      time: '10 hours ago', 
      type: 'technology',
      icon: '📱',
      section: 'Technology'
    },
    { 
      id: 6, 
      action: 'Client onboarding completed', 
      user: 'John Smith', 
      time: '12 hours ago', 
      type: 'sales',
      icon: '👤',
      section: 'Sales Division'
    }
  ];

  // Upcoming Events
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Government Audit Meeting', 
      date: 'Today, 2:00 PM', 
      type: 'compliance',
      priority: 'high',
      section: 'Government & Compliance'
    },
    { 
      id: 2, 
      title: 'Monthly Financial Review', 
      date: 'Tomorrow, 10:00 AM', 
      type: 'finance',
      priority: 'high',
      section: 'Finance'
    },
    { 
      id: 3, 
      title: 'Sales Team Meeting', 
      date: 'Friday, 3:00 PM', 
      type: 'sales',
      priority: 'medium',
      section: 'Sales Division'
    },
    { 
      id: 4, 
      title: 'System Maintenance Window', 
      date: 'Sunday, 2:00 AM', 
      type: 'technology',
      priority: 'medium',
      section: 'Technology'
    }
  ];

  // Department/Division Overview
  const divisionStats = [
    { name: 'HR Operations', employees: 45, growth: '+8%', color: 'bg-blue-500', value: '$2.4M' },
    { name: 'Sales Division', employees: 156, growth: '+12%', color: 'bg-emerald-500', value: '$4.2M' },
    { name: 'Finance', employees: 23, growth: '+5%', color: 'bg-purple-500', value: '$1.8M' },
    { name: 'Operations', employees: 89, growth: '+7%', color: 'bg-orange-500', value: '$1.2M' },
    { name: 'Technology', employees: 34, growth: '+15%', color: 'bg-indigo-500', value: '$850K' },
    { name: 'Government & Compliance', employees: 12, growth: '+3%', color: 'bg-green-500', value: '$320K' }
  ];

  return (
    <div>
      {/* Dashboard Content */}
      <main className="p-6">

          {/* Key Metrics - HR Operations */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">HR Operations Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Benefits Coverage</p>
                    <p className="text-3xl font-bold">89%</p>
                    <p className="text-yellow-200 text-xs">+2.3% increase</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎁</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Finance & Sales Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Finance Overview */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Finance Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Account Payables</p>
                      <p className="text-sm text-gray-600">$450K</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+8.2%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">💸</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Monthly Expenses</p>
                      <p className="text-sm text-gray-600">$1.2M</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+4.5%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">💹</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Cash Flow</p>
                      <p className="text-sm text-gray-600">$3.8M</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+12.1%</span>
                </div>
              </div>
            </div>

            {/* Sales Division Overview */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Division</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Active Clients</p>
                      <p className="text-sm text-gray-600">342</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+15.3%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📦</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Inventory Value</p>
                      <p className="text-sm text-gray-600">$850K</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+6.7%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Agent Performance</p>
                      <p className="text-sm text-gray-600">87%</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+4.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operations & Technology */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Operations Overview */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations & Compliance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📜</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Active Permits</p>
                      <p className="text-sm text-gray-600">156</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+3 new</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">👀</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Daily Visitors</p>
                      <p className="text-sm text-gray-600">89</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+12.4%</span>
                </div>
              </div>
            </div>

            {/* Technology Overview */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology & Systems</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">System Uptime</p>
                      <p className="text-sm text-gray-600">99.8%</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+0.1%</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Active Lines</p>
                      <p className="text-sm text-gray-600">24</p>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm font-semibold">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Division Performance Chart */}
          <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Division Performance Overview</h3>
            <div className="space-y-4">
              {divisionStats.map((division, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 ${division.color} rounded-full mr-3`}></div>
                    <span className="text-sm text-gray-600 font-medium">{division.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className={`${division.color} h-2 rounded-full`} style={{width: `${(division.employees / 200) * 100}%`}}></div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{division.employees}</span>
                      <span className="text-xs text-gray-700 ml-2">({division.value})</span>
                      <span className="text-xs text-green-600 ml-2">{division.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  <h3 className="text-lg font-semibold text-gray-900">HR Operations</h3>
                  <p className="text-sm text-gray-600">Manage workforce</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">Employee Records</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">Payroll Management</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sales Division</h3>
                  <p className="text-sm text-gray-600">Manage sales operations</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200">
                  <span className="text-gray-700 font-medium">Client Management</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200">
                  <span className="text-gray-700 font-medium">Inventory Control</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">System Admin</h3>
                  <p className="text-sm text-gray-600">System management</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200">
                  <span className="text-gray-700 font-medium">System Overview</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200">
                  <span className="text-gray-700 font-medium">Admin Tools</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent System Activities</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {activity.section}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
    </div>
  );
}
