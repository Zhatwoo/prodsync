'use client';

import { useState, useEffect } from 'react';

export default function AgentMonitoring() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedAgentData, setSelectedAgentData] = useState(null);
  const [error, setError] = useState('');

  // Sample data - in real app, this would come from API/database
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'John Santos',
      email: 'john.santos@company.com',
      phone: '+63 912 345 6789',
      status: 'Active',
      hireDate: '2023-01-15',
      territory: 'Metro Manila',
      commissionRate: 0.15,
      totalSales: 2500000,
      totalCommission: 375000,
      activeClients: 12,
      totalProjects: 8,
      image: '👨‍💼'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      phone: '+63 917 234 5678',
      status: 'Active',
      hireDate: '2023-03-20',
      territory: 'Cebu',
      commissionRate: 0.12,
      totalSales: 1800000,
      totalCommission: 216000,
      activeClients: 9,
      totalProjects: 6,
      image: '👩‍💼'
    },
    {
      id: 3,
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@company.com',
      phone: '+63 918 345 6789',
      status: 'On Leave',
      hireDate: '2022-11-10',
      territory: 'Davao',
      commissionRate: 0.18,
      totalSales: 3200000,
      totalCommission: 576000,
      activeClients: 15,
      totalProjects: 11,
      image: '👨‍💻'
    }
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'ABC Manufacturing Corp.',
      contactPerson: 'Roberto Cruz',
      email: 'roberto@abcmanufacturing.com',
      phone: '+63 2 8123 4567',
      industry: 'Manufacturing',
      agentId: 1,
      status: 'Active',
      totalProjects: 3,
      totalValue: 850000,
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      name: 'TechStart Solutions',
      contactPerson: 'Ana Dela Cruz',
      email: 'ana@techstart.com',
      phone: '+63 32 234 5678',
      industry: 'Technology',
      agentId: 2,
      status: 'Active',
      totalProjects: 2,
      totalValue: 450000,
      lastContact: '2024-01-14'
    },
    {
      id: 3,
      name: 'Global Logistics Inc.',
      contactPerson: 'Miguel Torres',
      email: 'miguel@globallogistics.com',
      phone: '+63 82 345 6789',
      industry: 'Logistics',
      agentId: 3,
      status: 'Prospect',
      totalProjects: 1,
      totalValue: 200000,
      lastContact: '2024-01-12'
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'ERP System Implementation',
      clientId: 1,
      agentId: 1,
      status: 'In Progress',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: 500000,
      spent: 150000,
      products: ['Enterprise Software License', 'Cloud Infrastructure Package'],
      commission: 75000,
      progress: 30
    },
    {
      id: 2,
      name: 'Manufacturing Software Upgrade',
      clientId: 1,
      agentId: 1,
      status: 'Completed',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      budget: 350000,
      spent: 350000,
      products: ['Manufacturing Software Suite'],
      commission: 52500,
      progress: 100
    },
    {
      id: 3,
      name: 'Cloud Migration Project',
      clientId: 2,
      agentId: 2,
      status: 'Planning',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 300000,
      spent: 0,
      products: ['Cloud Infrastructure Package'],
      commission: 36000,
      progress: 5
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      agentId: 1,
      date: '2024-01-15',
      category: 'Travel',
      description: 'Client meeting in Makati',
      amount: 2500,
      receipt: 'receipt_001.jpg',
      status: 'Approved'
    },
    {
      id: 2,
      agentId: 1,
      date: '2024-01-14',
      category: 'Meals',
      description: 'Business lunch with client',
      amount: 1800,
      receipt: 'receipt_002.jpg',
      status: 'Pending'
    },
    {
      id: 3,
      agentId: 2,
      date: '2024-01-13',
      category: 'Transportation',
      description: 'Taxi fare to client site',
      amount: 450,
      receipt: 'receipt_003.jpg',
      status: 'Approved'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    agentId: '',
    date: '',
    category: '',
    description: '',
    amount: '',
    receipt: ''
  });

  // Statistics
  const getStats = () => {
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'Active').length;
    const totalSales = agents.reduce((sum, agent) => sum + agent.totalSales, 0);
    const totalCommission = agents.reduce((sum, agent) => sum + agent.totalCommission, 0);
    const totalClients = clients.length;
    const activeProjects = projects.filter(p => p.status === 'In Progress').length;

    return {
      totalAgents,
      activeAgents,
      totalSales: `₱${(totalSales / 1000000).toFixed(1)}M`,
      totalCommission: `₱${(totalCommission / 1000).toFixed(0)}K`,
      totalClients,
      activeProjects
    };
  };

  const stats = getStats();

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.territory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddExpense = () => {
    if (!newExpense.agentId || !newExpense.date || !newExpense.category || !newExpense.amount) {
      setError('Please fill in all required fields');
      return;
    }

    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      status: 'Pending'
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      agentId: '',
      date: '',
      category: '',
      description: '',
      amount: '',
      receipt: ''
    });
    setShowExpenseModal(false);
    setError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-purple-100 text-purple-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAgentClients = (agentId) => {
    return clients.filter(client => client.agentId === agentId);
  };

  const getAgentProjects = (agentId) => {
    return projects.filter(project => project.agentId === agentId);
  };

  const getAgentExpenses = (agentId) => {
    return expenses.filter(expense => expense.agentId === agentId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Monitoring Dashboard</h1>
          <p className="text-gray-600">Monitor sales agents, track client relationships, projects, and commission performance</p>
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Agents</p>
                <p className="text-3xl font-bold">{stats.totalAgents}</p>
                <p className="text-blue-200 text-xs">{stats.activeAgents} active</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Sales</p>
                <p className="text-3xl font-bold">{stats.totalSales}</p>
                <p className="text-green-200 text-xs">This period</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Commission</p>
                <p className="text-3xl font-bold">{stats.totalCommission}</p>
                <p className="text-purple-200 text-xs">Paid to agents</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Projects</p>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="text-orange-200 text-xs">In progress</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'agents', name: 'Agents', icon: '👥' },
                { id: 'clients', name: 'Clients', icon: '🏢' },
                { id: 'projects', name: 'Projects', icon: '🚀' },
                { id: 'expenses', name: 'Expenses', icon: '💸' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Performers */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performing Agents</h4>
                    <div className="space-y-4">
                      {agents
                        .sort((a, b) => b.totalSales - a.totalSales)
                        .slice(0, 3)
                        .map((agent, index) => (
                          <div key={agent.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-lg">{agent.image}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{agent.name}</p>
                                <p className="text-sm text-gray-600">{agent.territory}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(agent.totalSales)}</p>
                              <p className="text-sm text-gray-600">#{index + 1}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Project Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Project Status Distribution</h4>
                    <div className="space-y-4">
                      {['In Progress', 'Completed', 'Planning'].map((status) => {
                        const count = projects.filter(p => p.status === status).length;
                        const percentage = (count / projects.length) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-3 ${
                                status === 'In Progress' ? 'bg-blue-500' :
                                status === 'Completed' ? 'bg-green-500' : 'bg-purple-500'
                              }`}></div>
                              <span className="text-sm text-gray-600">{status}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className={`h-2 rounded-full ${
                                    status === 'In Progress' ? 'bg-blue-500' :
                                    status === 'Completed' ? 'bg-green-500' : 'bg-purple-500'
                                  }`}
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map((agent) => (
                    <div key={agent.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                            <span className="text-white text-2xl">{agent.image}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                            <p className="text-sm text-gray-600">{agent.territory}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Sales:</span>
                          <span className="text-sm font-semibold">{formatCurrency(agent.totalSales)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Commission:</span>
                          <span className="text-sm font-semibold">{formatCurrency(agent.totalCommission)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Clients:</span>
                          <span className="text-sm font-semibold">{agent.activeClients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Projects:</span>
                          <span className="text-sm font-semibold">{agent.totalProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Commission Rate:</span>
                          <span className="text-sm font-semibold">{(agent.commissionRate * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAgentData(agent);
                            setActiveTab('clients');
                          }}
                          className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                        >
                          View Clients
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAgentData(agent);
                            setActiveTab('projects');
                          }}
                          className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm hover:bg-green-100 transition-colors"
                        >
                          View Projects
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedAgentData ? `${selectedAgentData.name}'s Clients` : 'All Clients'}
                  </h3>
                  {selectedAgentData && (
                    <button
                      onClick={() => setSelectedAgentData(null)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View All Clients
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedAgentData ? getAgentClients(selectedAgentData.id) : clients).map((client) => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.contactPerson}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Industry:</span>
                          <span className="text-sm font-semibold">{client.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Projects:</span>
                          <span className="text-sm font-semibold">{client.totalProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Value:</span>
                          <span className="text-sm font-semibold">{formatCurrency(client.totalValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Contact:</span>
                          <span className="text-sm font-semibold">{client.lastContact}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors">
                          Contact
                        </button>
                        <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm hover:bg-green-100 transition-colors">
                          View Projects
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedAgentData ? `${selectedAgentData.name}'s Projects` : 'All Projects'}
                  </h3>
                  {selectedAgentData && (
                    <button
                      onClick={() => setSelectedAgentData(null)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View All Projects
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(selectedAgentData ? getAgentProjects(selectedAgentData.id) : projects).map((project) => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-600">
                            {clients.find(c => c.id === project.clientId)?.name}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Budget:</span>
                          <span className="text-sm font-semibold">{formatCurrency(project.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Spent:</span>
                          <span className="text-sm font-semibold">{formatCurrency(project.spent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Commission:</span>
                          <span className="text-sm font-semibold">{formatCurrency(project.commission)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Duration:</span>
                          <span className="text-sm font-semibold">
                            {project.startDate} - {project.endDate}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{width: `${project.progress}%`}}
                          ></div>
                        </div>
                      </div>

                      {/* Products Used */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Products/Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.products.map((product, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors">
                          Update Progress
                        </button>
                        <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm hover:bg-green-100 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedAgentData ? `${selectedAgentData.name}'s Expenses` : 'All Expenses'}
                  </h3>
                  <div className="flex space-x-2">
                    {selectedAgentData && (
                      <button
                        onClick={() => setSelectedAgentData(null)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        View All Expenses
                      </button>
                    )}
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(selectedAgentData ? getAgentExpenses(selectedAgentData.id) : expenses).map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {agents.find(a => a.id === expense.agentId)?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{expense.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{expense.category}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{expense.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">View Receipt</button>
                              <button className="text-green-600 hover:text-green-900">Approve</button>
                              <button className="text-red-600 hover:text-red-900">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agent *</label>
                    <select
                      value={newExpense.agentId}
                      onChange={(e) => setNewExpense({...newExpense, agentId: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date *</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Travel">Travel</option>
                      <option value="Meals">Meals</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount *</label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowExpenseModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExpense}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
