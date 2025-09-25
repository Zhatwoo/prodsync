'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AuditDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [liveData, setLiveData] = useState({
    timekeeping: {
      attendanceCompliance: 94,
      overtimeHours: 156,
      leaveRequests: 23,
      scheduleDeviations: 8,
      lastUpdate: new Date()
    },
    appsuite: {
      activeUsers: 145,
      systemUptime: 99.8,
      failedLogins: 12,
      dataBackups: 28,
      lastUpdate: new Date()
    },
    activities: [],
    isLoading: false
  });
  const { user } = useAuth();

  // Live data fetching functions
  const fetchTimekeepingData = async () => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/timekeeping-stats');
      if (response.ok) {
        const data = await response.json();
        setLiveData(prev => ({
          ...prev,
          timekeeping: {
            ...data,
            lastUpdate: new Date()
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching timekeeping data:', error);
      // Fallback to simulated data
      setLiveData(prev => ({
        ...prev,
        timekeeping: {
          attendanceCompliance: Math.floor(Math.random() * 10) + 90,
          overtimeHours: Math.floor(Math.random() * 50) + 120,
          leaveRequests: Math.floor(Math.random() * 20) + 15,
          scheduleDeviations: Math.floor(Math.random() * 10) + 5,
          lastUpdate: new Date()
        }
      }));
    }
  };

  const fetchAppSuiteData = async () => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/appsuite-stats');
      if (response.ok) {
        const data = await response.json();
        setLiveData(prev => ({
          ...prev,
          appsuite: {
            ...data,
            lastUpdate: new Date()
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching appsuite data:', error);
      // Fallback to simulated data
      setLiveData(prev => ({
        ...prev,
        appsuite: {
          activeUsers: Math.floor(Math.random() * 50) + 120,
          systemUptime: 99.5 + Math.random() * 0.5,
          failedLogins: Math.floor(Math.random() * 20) + 5,
          dataBackups: Math.floor(Math.random() * 10) + 25,
          lastUpdate: new Date()
        }
      }));
    }
  };

  const fetchAuditActivities = async () => {
    try {
      const response = await fetch('/api/audit-activities');
      if (response.ok) {
        const data = await response.json();
        setLiveData(prev => ({
          ...prev,
          activities: data
        }));
      }
    } catch (error) {
      console.error('Error fetching audit activities:', error);
      // Fallback to simulated data
      const activities = [
        {
          id: Date.now(),
          type: 'timekeeping',
          title: 'Live Timekeeping Update',
          description: 'Real-time attendance monitoring',
          timestamp: 'Just now',
          status: 'in-progress',
          severity: 'low'
        }
      ];
      setLiveData(prev => ({
        ...prev,
        activities: activities
      }));
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTimekeepingData();
      fetchAppSuiteData();
      fetchAuditActivities();
    }, 30000);

    // Initial data fetch
    fetchTimekeepingData();
    fetchAppSuiteData();
    fetchAuditActivities();

    return () => clearInterval(interval);
  }, []);

  // Update data when time range changes
  useEffect(() => {
    fetchTimekeepingData();
    fetchAppSuiteData();
    fetchAuditActivities();
  }, [selectedTimeRange]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'timekeeping', name: 'Timekeeping Audit', icon: '⏰' },
    { id: 'appsuite', name: 'App Suite Monitoring', icon: '📱' },
    { id: 'reports', name: 'Audit Reports', icon: '📋' }
  ];

  // Dynamic stats based on live data
  const timekeepingStats = [
    { 
      label: 'Attendance Compliance', 
      value: `${liveData.timekeeping.attendanceCompliance}%`, 
      change: '+2%', 
      color: 'green',
      lastUpdate: liveData.timekeeping.lastUpdate
    },
    { 
      label: 'Overtime Hours', 
      value: `${liveData.timekeeping.overtimeHours}h`, 
      change: '-12%', 
      color: 'blue',
      lastUpdate: liveData.timekeeping.lastUpdate
    },
    { 
      label: 'Leave Requests', 
      value: `${liveData.timekeeping.leaveRequests}`, 
      change: '+5', 
      color: 'purple',
      lastUpdate: liveData.timekeeping.lastUpdate
    },
    { 
      label: 'Schedule Deviations', 
      value: `${liveData.timekeeping.scheduleDeviations}`, 
      change: '-3', 
      color: 'orange',
      lastUpdate: liveData.timekeeping.lastUpdate
    }
  ];

  const appSuiteStats = [
    { 
      label: 'Active Users', 
      value: `${liveData.appsuite.activeUsers}`, 
      change: '+8', 
      color: 'green',
      lastUpdate: liveData.appsuite.lastUpdate
    },
    { 
      label: 'System Uptime', 
      value: `${liveData.appsuite.systemUptime.toFixed(1)}%`, 
      change: '+0.2%', 
      color: 'blue',
      lastUpdate: liveData.appsuite.lastUpdate
    },
    { 
      label: 'Failed Logins', 
      value: `${liveData.appsuite.failedLogins}`, 
      change: '-4', 
      color: 'red',
      lastUpdate: liveData.appsuite.lastUpdate
    },
    { 
      label: 'Data Backups', 
      value: `${liveData.appsuite.dataBackups}`, 
      change: '+2', 
      color: 'purple',
      lastUpdate: liveData.appsuite.lastUpdate
    }
  ];

  // Use live activities data, fallback to static if empty
  const recentAuditActivities = liveData.activities.length > 0 ? liveData.activities : [
    {
      id: 1,
      type: 'timekeeping',
      title: 'Timekeeping Audit Completed',
      description: 'Monthly attendance review for all departments',
      timestamp: '2 hours ago',
      status: 'completed',
      severity: 'low'
    },
    {
      id: 2,
      type: 'appsuite',
      title: 'System Access Review',
      description: 'User permission audit for administrative functions',
      timestamp: '4 hours ago',
      status: 'in-progress',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Compliance Check',
      description: 'Data protection and privacy policy verification',
      timestamp: '1 day ago',
      status: 'completed',
      severity: 'high'
    },
    {
      id: 4,
      type: 'timekeeping',
      title: 'Overtime Analysis',
      description: 'Weekly overtime pattern analysis',
      timestamp: '2 days ago',
      status: 'completed',
      severity: 'medium'
    }
  ];

  // Sidebar data structure from AuditSidebar.jsx
  const sidebarItems = {
    timekeeping: {
      title: 'Time Keeping',
      icon: '⏰',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      href: '/positionpages/auditpage/timekeeping',
      description: 'Attendance Overview, Time Tracking, Leave Management, Overtime Management, Schedule Management, Attendance Reports',
      features: [
        'Attendance Overview',
        'Time Tracking', 
        'Leave Management',
        'Overtime Management',
        'Schedule Management',
        'Attendance Reports'
      ]
    },
    appsuite: {
      title: 'App Suite',
      icon: '📱',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      href: '/positionpages/auditpage/appsuite',
      description: 'Application Suite, System Tools, Management Interface, Administrative Functions',
      features: [
        'Application Suite',
        'System Tools',
        'Management Interface', 
        'Administrative Functions'
      ]
    }
  };

  const quickActions = [
    {
      title: 'Audit Timekeeping',
      description: 'Review attendance, time tracking, and leave management',
      icon: '🔍',
      href: '/positionpages/auditpage/timekeeping',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Attendance Reports',
        'Time Tracking Review',
        'Leave Management Audit',
        'Overtime Analysis',
        'Schedule Compliance'
      ]
    },
    {
      title: 'Monitor App Suite',
      description: 'System tools and administrative functions oversight',
      icon: '📱',
      href: '/positionpages/auditpage/appsuite',
      color: 'from-indigo-500 to-indigo-600',
      features: [
        'Daily Reports Review',
        'System Tools Monitoring',
        'Administrative Functions',
        'Management Interface',
        'Security Monitoring'
      ]
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive audit reports and analysis',
      icon: '📋',
      href: '#',
      color: 'from-orange-500 to-orange-600',
      features: [
        'Compliance Reports',
        'Timekeeping Analysis',
        'App Suite Usage',
        'System Audit Trail',
        'Performance Metrics'
      ]
    },
    {
      title: 'Compliance Check',
      description: 'Review system compliance and security measures',
      icon: '🛡️',
      href: '#',
      color: 'from-green-500 to-green-600',
      features: [
        'Security Audits',
        'Compliance Verification',
        'Policy Review',
        'Risk Assessment',
        'Control Testing'
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timekeeping Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">⏰</span>
              Timekeeping Audit
            </h3>
            <Link 
              href={sidebarItems.timekeeping.href}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {timekeepingStats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg relative">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className={`text-xs font-medium ${
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                }`}>
                  {stat.change}
                </div>
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Data"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Updated: {stat.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Suite Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📱</span>
              App Suite Monitoring
            </h3>
            <Link 
              href={sidebarItems.appsuite.href}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {appSuiteStats.map((stat, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg relative">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className={`text-xs font-medium ${
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'red' ? 'text-red-600' : 'text-purple-600'
                }`}>
                  {stat.change}
                </div>
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Data"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Updated: {stat.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="group relative">
              <Link
                href={action.href}
                className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 block`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{action.icon}</span>
                  <h4 className="font-semibold">{action.title}</h4>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
                <div className="mt-2 text-xs opacity-75">
                  <span className="font-medium">Features:</span>
                  <ul className="mt-1 space-y-1">
                    {action.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                    {action.features.length > 3 && (
                      <li className="text-xs opacity-60">+{action.features.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Items Integration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(sidebarItems).map(([key, item]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl ${item.color}`}>
                  {item.icon}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Available Features:</h5>
                <div className="grid grid-cols-2 gap-1">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-600">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href={item.href}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:shadow-lg transition-all duration-200 ${item.color}`}
              >
                <span className="mr-2">Access</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Audit Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Audit Activities</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchTimekeepingData();
                fetchAppSuiteData();
                fetchAuditActivities();
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 text-black"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {recentAuditActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {activity.type === 'timekeeping' && <span className="text-2xl">⏰</span>}
                  {activity.type === 'appsuite' && <span className="text-2xl">📱</span>}
                  {activity.type === 'compliance' && <span className="text-2xl">🛡️</span>}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(activity.severity)}`}>
                  {activity.severity}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimekeepingAudit = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timekeeping Audit Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Overall Compliance Rate</div>
            <div className="text-xs text-purple-600 mt-1">↑ 2% from last month</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">156h</div>
            <div className="text-sm text-gray-600">Total Overtime Hours</div>
            <div className="text-xs text-blue-600 mt-1">↓ 12% from last month</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">23</div>
            <div className="text-sm text-gray-600">Pending Leave Requests</div>
            <div className="text-xs text-green-600 mt-1">↑ 5 from last week</div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link 
            href={sidebarItems.timekeeping.href}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="mr-2">{sidebarItems.timekeeping.icon}</span>
            Access {sidebarItems.timekeeping.title} System
          </Link>
        </div>
      </div>
    </div>
  );

  const renderAppSuiteMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">App Suite Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">System Uptime</span>
              <span className="text-lg font-bold text-green-600">99.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Users</span>
              <span className="text-lg font-bold text-blue-600">145</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Failed Logins</span>
              <span className="text-lg font-bold text-red-600">12</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Data Backups</span>
              <span className="text-lg font-bold text-purple-600">28</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Security Alerts</span>
              <span className="text-lg font-bold text-orange-600">3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">API Calls</span>
              <span className="text-lg font-bold text-indigo-600">1.2K</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link 
            href={sidebarItems.appsuite.href}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span className="mr-2">{sidebarItems.appsuite.icon}</span>
            Access {sidebarItems.appsuite.title}
          </Link>
        </div>
      </div>
    </div>
  );

  const renderAuditReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Monthly Compliance Report</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive audit of all systems and processes</p>
            <button className="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Generate Report
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Timekeeping Analysis</h4>
            <p className="text-sm text-gray-600 mb-3">Detailed analysis of attendance and time tracking</p>
            <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Generate Report
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">System Usage Report</h4>
            <p className="text-sm text-gray-600 mb-3">App suite usage and performance metrics</p>
            <button className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'timekeeping':
        return renderTimekeepingAudit();
      case 'appsuite':
        return renderAppSuiteMonitoring();
      case 'reports':
        return renderAuditReports();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center lg:justify-start">
                  <span className="mr-3 text-4xl">🔍</span>
                  Audit Dashboard
                </h1>
                <p className="mt-2 text-gray-600">Internal audit monitoring and compliance tracking</p>
                <div className="mt-3 flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="font-medium">
                      Welcome, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Audit Manager'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">Live Data Active</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Active Audits</div>
                </div>
                <div className="bg-green-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Compliance Rate</div>
                </div>
                <div className="bg-blue-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Pending Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <nav className="flex space-x-8 px-6 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
