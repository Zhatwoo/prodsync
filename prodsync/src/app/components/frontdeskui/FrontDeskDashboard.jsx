'use client';

import { useState } from 'react';

export default function FrontDeskDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Telephone System Statistics
  const telephoneStats = [
    { 
      title: 'Active Lines', 
      value: '24', 
      change: '+2', 
      changeType: 'positive',
      icon: '📞',
      color: 'blue'
    },
    { 
      title: 'Calls Today', 
      value: '156', 
      change: '+12%', 
      changeType: 'positive',
      icon: '📊',
      color: 'green'
    },
    { 
      title: 'Missed Calls', 
      value: '8', 
      change: '-25%', 
      changeType: 'negative',
      icon: '⚠️',
      color: 'red'
    },
    { 
      title: 'Avg Call Duration', 
      value: '3.2m', 
      change: '+0.5m', 
      changeType: 'positive',
      icon: '⏱️',
      color: 'purple'
    }
  ];

  // Visitor Monitoring Statistics
  const visitorStats = [
    { 
      title: 'Visitors Today', 
      value: '47', 
      change: '+8', 
      changeType: 'positive',
      icon: '👥',
      color: 'green'
    },
    { 
      title: 'Currently Inside', 
      value: '12', 
      change: '+3', 
      changeType: 'positive',
      icon: '🏢',
      color: 'blue'
    },
    { 
      title: 'Pending Approval', 
      value: '5', 
      change: '-2', 
      changeType: 'negative',
      icon: '⏳',
      color: 'yellow'
    },
    { 
      title: 'Security Alerts', 
      value: '0', 
      change: '0', 
      changeType: 'neutral',
      icon: '🔒',
      color: 'gray'
    }
  ];

  // Recent Phone Activities
  const recentPhoneActivities = [
    { 
      id: 1, 
      action: 'Incoming call from extension 201', 
      user: 'John Smith', 
      time: '2 minutes ago', 
      type: 'incoming',
      icon: '📞',
      duration: '2:15'
    },
    { 
      id: 2, 
      action: 'Call transferred to HR department', 
      user: 'Sarah Johnson', 
      time: '5 minutes ago', 
      type: 'transfer',
      icon: '🔄',
      duration: '1:45'
    },
    { 
      id: 3, 
      action: 'Emergency call received', 
      user: 'Emergency Services', 
      time: '8 minutes ago', 
      type: 'emergency',
      icon: '🚨',
      duration: '4:30'
    },
    { 
      id: 4, 
      action: 'Voicemail left by client', 
      user: 'ABC Corporation', 
      time: '12 minutes ago', 
      type: 'voicemail',
      icon: '📝',
      duration: '0:45'
    },
    { 
      id: 5, 
      action: 'Conference call initiated', 
      user: 'Management Team', 
      time: '15 minutes ago', 
      type: 'conference',
      icon: '👥',
      duration: '25:00'
    }
  ];

  // Recent Visitor Activities
  const recentVisitorActivities = [
    { 
      id: 1, 
      action: 'Visitor checked in', 
      user: 'Michael Chen - ABC Corp', 
      time: '3 minutes ago', 
      type: 'checkin',
      icon: '✅',
      purpose: 'Business Meeting'
    },
    { 
      id: 2, 
      action: 'Visitor badge issued', 
      user: 'Lisa Rodriguez - XYZ Ltd', 
      time: '7 minutes ago', 
      type: 'badge',
      icon: '🏷️',
      purpose: 'Interview'
    },
    { 
      id: 3, 
      action: 'Visitor checked out', 
      user: 'David Wilson - Tech Solutions', 
      time: '12 minutes ago', 
      type: 'checkout',
      icon: '🚪',
      purpose: 'Consultation'
    },
    { 
      id: 4, 
      action: 'Visitor access denied', 
      user: 'Unknown Person', 
      time: '18 minutes ago', 
      type: 'denied',
      icon: '❌',
      purpose: 'No Appointment'
    },
    { 
      id: 5, 
      action: 'Visitor waiting area', 
      user: 'Emma Davis - Marketing Co', 
      time: '22 minutes ago', 
      type: 'waiting',
      icon: '⏳',
      purpose: 'Sales Meeting'
    }
  ];

  // Upcoming Appointments
  const upcomingAppointments = [
    { 
      id: 1, 
      title: 'Client Meeting - ABC Corp', 
      time: '2:00 PM', 
      duration: '1 hour',
      contact: 'Michael Chen',
      type: 'business'
    },
    { 
      id: 2, 
      title: 'Job Interview - Sarah Lee', 
      time: '3:30 PM', 
      duration: '45 minutes',
      contact: 'HR Department',
      type: 'interview'
    },
    { 
      id: 3, 
      title: 'Vendor Visit - Office Supplies', 
      time: '4:15 PM', 
      duration: '30 minutes',
      contact: 'Procurement',
      type: 'vendor'
    },
    { 
      id: 4, 
      title: 'Maintenance Check', 
      time: '5:00 PM', 
      duration: '1 hour',
      contact: 'Facilities Team',
      type: 'maintenance'
    }
  ];

  // Phone System Status
  const phoneSystemStatus = [
    { name: 'Main Lines', status: 'Active', calls: 8, color: 'bg-green-500' },
    { name: 'Extension 201', status: 'Busy', calls: 1, color: 'bg-red-500' },
    { name: 'Extension 202', status: 'Available', calls: 0, color: 'bg-green-500' },
    { name: 'Extension 203', status: 'Available', calls: 0, color: 'bg-green-500' },
    { name: 'Extension 204', status: 'Busy', calls: 1, color: 'bg-red-500' },
    { name: 'Emergency Line', status: 'Active', calls: 0, color: 'bg-blue-500' }
  ];

  return (
    <div className="transition-all duration-300">
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
              <h1 className="text-2xl font-semibold text-gray-900">Front Desk Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Emergency Alert */}
              <button className="relative p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search visitors or calls..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

          {/* Key Metrics - Telephone System */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📞 Telephone System</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Lines</p>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-blue-200 text-xs">+2 new lines</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📞</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Calls Today</p>
                    <p className="text-3xl font-bold">156</p>
                    <p className="text-green-200 text-xs">+12% vs yesterday</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Missed Calls</p>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-red-200 text-xs">-25% improvement</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Call Duration</p>
                    <p className="text-3xl font-bold">3.2m</p>
                    <p className="text-purple-200 text-xs">+0.5m longer</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics - Visitor Monitoring */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">👥 Visitor Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Visitors Today</p>
                    <p className="text-3xl font-bold">47</p>
                    <p className="text-green-200 text-xs">+8 vs yesterday</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Currently Inside</p>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-blue-200 text-xs">+3 in building</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Pending Approval</p>
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-yellow-200 text-xs">-2 from this morning</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm">Security Alerts</p>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-gray-200 text-xs">All clear</p>
                  </div>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Phone System Status */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone System Status</h3>
              <div className="space-y-4">
                {phoneSystemStatus.map((line, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${line.color} rounded-full mr-3`}></div>
                      <span className="text-sm text-gray-600">{line.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-3">{line.status}</span>
                      <span className="text-sm font-semibold text-gray-900">{line.calls} calls</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Flow Chart */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Flow (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-32 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '70%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Mon</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '85%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Tue</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '60%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Wed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '90%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Thu</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-green-500 rounded-t" style={{height: '75%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Fri</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '25%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Sat</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 bg-orange-500 rounded-t" style={{height: '15%'}}></div>
                  <span className="text-xs text-gray-500 mt-2">Sun</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Average: 47 visitors/day</span>
                <span className="text-green-600">+8% vs last week</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone Actions</h3>
                  <p className="text-sm text-gray-600">Manage calls & extensions</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">Answer Incoming Call</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                  <span className="text-gray-700 font-medium">Transfer Call</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visitor Actions</h3>
                  <p className="text-sm text-gray-600">Handle visitor registration</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors border border-green-200">
                  <span className="text-gray-700 font-medium">Register New Visitor</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-colors border border-green-200">
                  <span className="text-gray-700 font-medium">Issue Visitor Badge</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🚨</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Actions</h3>
                  <p className="text-sm text-gray-600">Handle urgent situations</p>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors border border-orange-200">
                  <span className="text-gray-700 font-medium">Emergency Call</span>
                </button>
                <button className="w-full text-left p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors border border-orange-200">
                  <span className="text-gray-700 font-medium">Security Alert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Phone Activities */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Phone Activities</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentPhoneActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{activity.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Visitor Activities */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Visitor Activities</h3>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {recentVisitorActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Purpose</p>
                      <p className="text-sm font-semibold text-gray-900">{activity.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View Calendar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.type === 'business' ? 'bg-blue-100 text-blue-800' :
                      appointment.type === 'interview' ? 'bg-green-100 text-green-800' :
                      appointment.type === 'vendor' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.type}
                    </span>
                    <span className="text-xs text-gray-500">{appointment.duration}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{appointment.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">{appointment.contact}</p>
                  <p className="text-sm font-semibold text-orange-600">{appointment.time}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
    </div>
  );
}
