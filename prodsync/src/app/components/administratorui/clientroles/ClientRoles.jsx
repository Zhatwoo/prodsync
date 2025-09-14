'use client';

import { useState, useEffect } from 'react';

export default function ClientRoles() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalesRep, setSelectedSalesRep] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState('');

  // Sample data - in real app, this would come from API/database
  const [salesReps, setSalesReps] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Sales Division',
      position: 'Senior Sales Manager',
      clientsCount: 15,
      totalRevenue: '$2.4M',
      performance: 87,
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Sales Division',
      position: 'Sales Representative',
      clientsCount: 12,
      totalRevenue: '$1.8M',
      performance: 92,
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales Division',
      position: 'Account Manager',
      clientsCount: 18,
      totalRevenue: '$3.1M',
      performance: 89,
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Sales Division',
      position: 'Business Development',
      clientsCount: 10,
      totalRevenue: '$1.5M',
      performance: 85,
      avatar: '👩‍💻'
    }
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Technology',
      contactPerson: 'Robert Wilson',
      email: 'robert@techcorp.com',
      phone: '+1 (555) 111-2222',
      address: '123 Tech Street, Silicon Valley, CA',
      salesRepId: 1,
      salesRepName: 'John Smith',
      status: 'Active',
      totalValue: '$450K',
      lastContact: '2024-01-15',
      products: [
        { id: 1, name: 'Enterprise Software License', value: '$200K', status: 'Active' },
        { id: 2, name: 'Cloud Infrastructure', value: '$150K', status: 'Active' },
        { id: 3, name: 'Support Services', value: '$100K', status: 'Active' }
      ],
      projects: [
        { id: 1, name: 'Digital Transformation', status: 'In Progress', deadline: '2024-03-15', value: '$300K' },
        { id: 2, name: 'System Integration', status: 'Planning', deadline: '2024-04-30', value: '$150K' }
      ]
    },
    {
      id: 2,
      name: 'Global Manufacturing Inc.',
      industry: 'Manufacturing',
      contactPerson: 'Lisa Anderson',
      email: 'lisa@globalmfg.com',
      phone: '+1 (555) 222-3333',
      address: '456 Industrial Ave, Detroit, MI',
      salesRepId: 2,
      salesRepName: 'Sarah Johnson',
      status: 'Active',
      totalValue: '$320K',
      lastContact: '2024-01-12',
      products: [
        { id: 4, name: 'Manufacturing Software', value: '$180K', status: 'Active' },
        { id: 5, name: 'Quality Control System', value: '$140K', status: 'Active' }
      ],
      projects: [
        { id: 3, name: 'Production Optimization', status: 'Completed', deadline: '2024-01-10', value: '$200K' },
        { id: 4, name: 'Supply Chain Management', status: 'In Progress', deadline: '2024-05-20', value: '$120K' }
      ]
    },
    {
      id: 3,
      name: 'Healthcare Partners LLC',
      industry: 'Healthcare',
      contactPerson: 'Dr. Michael Brown',
      email: 'mbrown@healthcarepartners.com',
      phone: '+1 (555) 333-4444',
      address: '789 Medical Plaza, Boston, MA',
      salesRepId: 3,
      salesRepName: 'Mike Chen',
      status: 'Active',
      totalValue: '$680K',
      lastContact: '2024-01-14',
      products: [
        { id: 6, name: 'Electronic Health Records', value: '$300K', status: 'Active' },
        { id: 7, name: 'Patient Management System', value: '$250K', status: 'Active' },
        { id: 8, name: 'Telemedicine Platform', value: '$130K', status: 'Active' }
      ],
      projects: [
        { id: 5, name: 'EHR Implementation', status: 'In Progress', deadline: '2024-06-30', value: '$400K' },
        { id: 6, name: 'Data Migration', status: 'Planning', deadline: '2024-08-15', value: '$280K' }
      ]
    },
    {
      id: 4,
      name: 'Financial Services Group',
      industry: 'Finance',
      contactPerson: 'Jennifer Taylor',
      email: 'j.taylor@fsg.com',
      phone: '+1 (555) 444-5555',
      address: '321 Wall Street, New York, NY',
      salesRepId: 4,
      salesRepName: 'Emily Davis',
      status: 'Active',
      totalValue: '$280K',
      lastContact: '2024-01-10',
      products: [
        { id: 9, name: 'Risk Management Software', value: '$150K', status: 'Active' },
        { id: 10, name: 'Compliance Monitoring', value: '$130K', status: 'Active' }
      ],
      projects: [
        { id: 7, name: 'Regulatory Compliance', status: 'In Progress', deadline: '2024-04-15', value: '$180K' },
        { id: 8, name: 'Security Enhancement', status: 'Planning', deadline: '2024-07-10', value: '$100K' }
      ]
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    salesRepId: '',
    status: 'Active'
  });

  // Statistics
  const getStats = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const totalRevenue = clients.reduce((sum, client) => {
      return sum + parseFloat(client.totalValue.replace(/[$,]/g, ''));
    }, 0);
    const avgClientValue = totalRevenue / totalClients;

    return {
      totalClients,
      activeClients,
      totalRevenue: `$${(totalRevenue / 1000).toFixed(0)}K`,
      avgClientValue: `$${(avgClientValue / 1000).toFixed(0)}K`
    };
  };

  const stats = getStats();

  // Filter clients based on search and sales rep selection
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSalesRep = selectedSalesRep === 'all' || client.salesRepId.toString() === selectedSalesRep;
    return matchesSearch && matchesSalesRep;
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.contactPerson || !newClient.salesRepId) {
      setError('Please fill in all required fields');
      return;
    }

    const salesRep = salesReps.find(rep => rep.id.toString() === newClient.salesRepId);
    const client = {
      id: clients.length + 1,
      ...newClient,
      salesRepName: salesRep.name,
      totalValue: '$0',
      lastContact: new Date().toISOString().split('T')[0],
      products: [],
      projects: []
    };

    setClients([...clients, client]);
    setNewClient({
      name: '',
      industry: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      salesRepId: '',
      status: 'Active'
    });
    setShowAddModal(false);
    setError('');
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Roles Management</h1>
          <p className="text-gray-600">Monitor and manage client assignments for each sales representative</p>
          
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
                <p className="text-blue-100 text-sm">Total Clients</p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
                <p className="text-blue-200 text-xs">Across all sales reps</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Clients</p>
                <p className="text-3xl font-bold">{stats.activeClients}</p>
                <p className="text-green-200 text-xs">{((stats.activeClients / stats.totalClients) * 100).toFixed(1)}% of total</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">{stats.totalRevenue}</p>
                <p className="text-purple-200 text-xs">From all clients</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg Client Value</p>
                <p className="text-3xl font-bold">{stats.avgClientValue}</p>
                <p className="text-orange-200 text-xs">Per client</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
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
                { id: 'sales-reps', name: 'Sales Representatives', icon: '👥' },
                { id: 'clients', name: 'Client Management', icon: '🏢' }
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
                  {/* Sales Rep Performance */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Sales Representative Performance</h4>
                    <div className="space-y-4">
                      {salesReps.map((rep) => (
                        <div key={rep.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white text-lg">{rep.avatar}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{rep.name}</p>
                              <p className="text-sm text-gray-600">{rep.clientsCount} clients</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{rep.totalRevenue}</p>
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${rep.performance}%`}}></div>
                              </div>
                              <span className="text-sm text-gray-600">{rep.performance}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Distribution */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Client Distribution by Industry</h4>
                    <div className="space-y-3">
                      {['Technology', 'Manufacturing', 'Healthcare', 'Finance'].map((industry) => {
                        const count = clients.filter(c => c.industry === industry).length;
                        const percentage = (count / clients.length) * 100;
                        return (
                          <div key={industry} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{industry}</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
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

            {activeTab === 'sales-reps' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Representatives</h3>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Add Sales Rep
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salesReps.map((rep) => (
                    <div key={rep.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-2xl">{rep.avatar}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{rep.name}</h4>
                          <p className="text-sm text-gray-600">{rep.position}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Clients:</span>
                          <span className="text-sm font-semibold">{rep.clientsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Revenue:</span>
                          <span className="text-sm font-semibold">{rep.totalRevenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Performance:</span>
                          <span className="text-sm font-semibold">{rep.performance}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={selectedSalesRep}
                      onChange={(e) => setSelectedSalesRep(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Sales Reps</option>
                      {salesReps.map((rep) => (
                        <option key={rep.id} value={rep.id}>{rep.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Client
                  </button>
                </div>

                {/* Clients Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Rep</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.contactPerson}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.industry}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.salesRepName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{client.totalValue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.products.length}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.projects.length}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditClient(client)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Client Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Client</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name *</label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <input
                      type="text"
                      value={newClient.industry}
                      onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person *</label>
                    <input
                      type="text"
                      value={newClient.contactPerson}
                      onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sales Representative *</label>
                    <select
                      value={newClient.salesRepId}
                      onChange={(e) => setNewClient({...newClient, salesRepId: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Sales Rep</option>
                      {salesReps.map((rep) => (
                        <option key={rep.id} value={rep.id}>{rep.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddClient}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add Client
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
