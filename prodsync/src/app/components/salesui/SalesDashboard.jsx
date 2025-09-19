'use client';

import { useState, useEffect } from 'react';

export default function SalesDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeAgents: 0,
    inventoryItems: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  });

  const [salesData, setSalesData] = useState({
    clientRoles: {
      total: 0,
      active: 0,
      premium: 0,
      standard: 0
    },
    inventory: {
      totalItems: 0,
      lowStock: 0,
      outOfStock: 0,
      categories: 0
    },
    reinvestment: {
      pending: 0,
      approved: 0,
      rejected: 0,
      totalAmount: 0
    },
    agentMonitoring: {
      totalAgents: 0,
      activeAgents: 0,
      topPerformers: 0,
      needsImprovement: 0
    },
    telephones: {
      totalLines: 0,
      activeCalls: 0,
      missedCalls: 0,
      avgCallDuration: 0
    },
    timestamp: {
      totalEmployees: 0,
      presentToday: 0,
      lateArrivals: 0,
      overtimeHours: 0
    }
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const [charts] = useState([
    {
      title: 'Sales Performance Trend',
      type: 'line',
      data: [12000, 15000, 18000, 16000, 20000, 22000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    {
      title: 'Client Distribution',
      type: 'doughnut',
      data: [45, 30, 15, 10],
      labels: ['Active', 'Prospect', 'Inactive', 'Lost']
    }
  ]);

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalClients: 248,
      activeAgents: 12,
      inventoryItems: 156,
      pendingRequests: 8,
      monthlyRevenue: 125000,
      conversionRate: 24.5
    });

    // Populate sales data for each section
    setSalesData({
      clientRoles: {
        total: 248,
        active: 198,
        premium: 45,
        standard: 203
      },
      inventory: {
        totalItems: 156,
        lowStock: 12,
        outOfStock: 3,
        categories: 8
      },
      reinvestment: {
        pending: 8,
        approved: 15,
        rejected: 2,
        totalAmount: 125000
      },
      agentMonitoring: {
        totalAgents: 12,
        activeAgents: 10,
        topPerformers: 4,
        needsImprovement: 2
      },
      telephones: {
        totalLines: 8,
        activeCalls: 3,
        missedCalls: 5,
        avgCallDuration: 4.2
      },
      timestamp: {
        totalEmployees: 45,
        presentToday: 42,
        lateArrivals: 3,
        overtimeHours: 12.5
      }
    });

    setRecentActivities([
      {
        id: 1,
        action: 'New client role assigned to premium tier',
        time: '30 minutes ago',
        type: 'clientroles',
        status: 'completed'
      },
      {
        id: 2,
        action: 'Inventory updated - 25 new products added',
        time: '1 hour ago',
        type: 'inventory',
        status: 'completed'
      },
      {
        id: 3,
        action: 'Agent performance review completed',
        time: '2 hours ago',
        type: 'agentmonitoring',
        status: 'completed'
      },
      {
        id: 4,
        action: 'Reinvestment request approved for Q3',
        time: '3 hours ago',
        type: 'reinvestment',
        status: 'completed'
      },
      {
        id: 5,
        action: 'Telephone system maintenance scheduled',
        time: '1 day ago',
        type: 'telephones',
        status: 'pending'
      },
      {
        id: 6,
        action: 'Time tracking report generated',
        time: '2 days ago',
        type: 'timestamp',
        status: 'completed'
      }
    ]);
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      clientroles: '👤',
      inventory: '📦',
      reinvestment: '🔄',
      agentmonitoring: '🎯',
      telephones: '📞',
      timestamp: '⏱️'
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      clientroles: 'text-blue-600 bg-blue-100',
      inventory: 'text-emerald-600 bg-emerald-100',
      reinvestment: 'text-purple-600 bg-purple-100',
      agentmonitoring: 'text-orange-600 bg-orange-100',
      telephones: 'text-indigo-600 bg-indigo-100',
      timestamp: 'text-pink-600 bg-pink-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of sales operations and performance metrics</p>
        </div>

        {/* Main Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Operations Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Client Roles Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Client Roles</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Clients</span>
                <span className="font-semibold text-gray-900">{salesData.clientRoles.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-green-600">{salesData.clientRoles.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium</span>
                <span className="font-semibold text-blue-600">{salesData.clientRoles.premium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Standard</span>
                <span className="font-semibold text-gray-600">{salesData.clientRoles.standard}</span>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Inventory</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Items</span>
                <span className="font-semibold text-gray-900">{salesData.inventory.totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="font-semibold text-emerald-600">{salesData.inventory.categories}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="font-semibold text-yellow-600">{salesData.inventory.lowStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="font-semibold text-red-600">{salesData.inventory.outOfStock}</span>
              </div>
            </div>
          </div>

          {/* Reinvestment Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Reinvestment</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{salesData.reinvestment.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <span className="font-semibold text-green-600">{salesData.reinvestment.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">{salesData.reinvestment.rejected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-semibold text-purple-600">${salesData.reinvestment.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Agent Monitoring Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Agent Monitoring</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Agents</span>
                <span className="font-semibold text-gray-900">{salesData.agentMonitoring.totalAgents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-green-600">{salesData.agentMonitoring.activeAgents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top Performers</span>
                <span className="font-semibold text-orange-600">{salesData.agentMonitoring.topPerformers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Needs Improvement</span>
                <span className="font-semibold text-red-600">{salesData.agentMonitoring.needsImprovement}</span>
              </div>
            </div>
          </div>

          {/* Telephones Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📞</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Telephones</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Lines</span>
                <span className="font-semibold text-gray-900">{salesData.telephones.totalLines}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Calls</span>
                <span className="font-semibold text-green-600">{salesData.telephones.activeCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Missed Calls</span>
                <span className="font-semibold text-red-600">{salesData.telephones.missedCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Duration</span>
                <span className="font-semibold text-indigo-600">{salesData.telephones.avgCallDuration}m</span>
              </div>
            </div>
          </div>

          {/* Timestamp Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⏱️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Time Tracking</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Employees</span>
                <span className="font-semibold text-gray-900">{salesData.timestamp.totalEmployees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Present Today</span>
                <span className="font-semibold text-green-600">{salesData.timestamp.presentToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Late Arrivals</span>
                <span className="font-semibold text-yellow-600">{salesData.timestamp.lateArrivals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overtime Hours</span>
                <span className="font-semibold text-pink-600">{salesData.timestamp.overtimeHours}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
