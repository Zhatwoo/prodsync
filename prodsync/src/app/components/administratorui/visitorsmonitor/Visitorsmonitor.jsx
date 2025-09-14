'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  UserPlusIcon,
  ClockIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Visitorsmonitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    hostEmployee: '',
    department: '',
    expectedArrival: '',
    expectedDeparture: '',
    idNumber: '',
    vehicleNumber: '',
    notes: '',
    status: 'scheduled',
    checkInTime: null,
    checkOutTime: null,
    badgeNumber: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    totalVisitors: 0,
    checkedIn: 0,
    scheduled: 0,
    completed: 0,
    todayVisitors: 0
  });

  // Firebase operations
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const visitorsRef = collection(db, 'visitors');
        const q = query(visitorsRef, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const visitorsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setVisitors(visitorsData);
          calculateStats(visitorsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching visitors:', error);
        setError('Failed to fetch visitors data');
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const calculateStats = (visitorsData) => {
    const today = new Date().toDateString();
    const todayVisitors = visitorsData.filter(visitor => 
      new Date(visitor.expectedArrival).toDateString() === today
    ).length;

    setStats({
      totalVisitors: visitorsData.length,
      checkedIn: visitorsData.filter(v => v.status === 'checked-in').length,
      scheduled: visitorsData.filter(v => v.status === 'scheduled').length,
      completed: visitorsData.filter(v => v.status === 'completed').length,
      todayVisitors
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitorData = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingVisitor) {
        await updateDoc(doc(db, 'visitors', editingVisitor.id), {
          ...visitorData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'visitors'), visitorData);
      }

      setShowModal(false);
      setEditingVisitor(null);
      resetForm();
    } catch (error) {
      console.error('Error saving visitor:', error);
      setError('Failed to save visitor data');
    }
  };

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
    setFormData(visitor);
    setShowModal(true);
  };

  const handleView = (visitor) => {
    setSelectedVisitor(visitor);
    setViewMode(true);
    setShowModal(true);
  };

  const handleDelete = async (visitorId) => {
    if (window.confirm('Are you sure you want to delete this visitor record?')) {
      try {
        await deleteDoc(doc(db, 'visitors', visitorId));
      } catch (error) {
        console.error('Error deleting visitor:', error);
        setError('Failed to delete visitor record');
      }
    }
  };

  const handleCheckIn = async (visitor) => {
    try {
      const badgeNumber = `B${Date.now().toString().slice(-6)}`;
      await updateDoc(doc(db, 'visitors', visitor.id), {
        status: 'checked-in',
        checkInTime: serverTimestamp(),
        badgeNumber,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error checking in visitor:', error);
      setError('Failed to check in visitor');
    }
  };

  const handleCheckOut = async (visitor) => {
    try {
      await updateDoc(doc(db, 'visitors', visitor.id), {
        status: 'completed',
        checkOutTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error checking out visitor:', error);
      setError('Failed to check out visitor');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      purpose: '',
      hostEmployee: '',
      department: '',
      expectedArrival: '',
      expectedDeparture: '',
      idNumber: '',
      vehicleNumber: '',
      notes: '',
      status: 'scheduled',
      checkInTime: null,
      checkOutTime: null,
      badgeNumber: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostEmployee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
    
    const matchesDate = !filterDate || 
      new Date(visitor.expectedArrival).toDateString() === new Date(filterDate).toDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      'checked-in': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'completed': { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon }
    };
    
    const config = statusConfig[status] || statusConfig['scheduled'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600">{change}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitors Monitor</h1>
              <p className="text-gray-600 mt-2">Manage and track corporate visitors</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Add Visitor</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'visitors', name: 'Visitors', icon: UsersIcon },
                { id: 'reports', name: 'Reports', icon: PrinterIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                title="Total Visitors"
                value={stats.totalVisitors}
                icon={UsersIcon}
                color="bg-blue-500"
              />
              <StatCard
                title="Today's Visitors"
                value={stats.todayVisitors}
                icon={CalendarIcon}
                color="bg-green-500"
              />
              <StatCard
                title="Checked In"
                value={stats.checkedIn}
                icon={CheckCircleIcon}
                color="bg-yellow-500"
              />
              <StatCard
                title="Scheduled"
                value={stats.scheduled}
                icon={ClockIcon}
                color="bg-purple-500"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={XCircleIcon}
                color="bg-gray-500"
              />
            </div>

            {/* Recent Visitors */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Visitors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Host
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arrival
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visitors.slice(0, 5).map((visitor) => (
                      <tr key={visitor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {visitor.firstName?.[0]}{visitor.lastName?.[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{visitor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.hostEmployee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(visitor.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(visitor.expectedArrival).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(visitor)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(visitor)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-4 w-4" />
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

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search visitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="checked-in">Checked In</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterDate('');
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Visitors Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Visitors ({filteredVisitors.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Host
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arrival
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {visitor.firstName?.[0]}{visitor.lastName?.[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{visitor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.hostEmployee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(visitor.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(visitor.expectedArrival).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(visitor)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(visitor)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            {visitor.status === 'scheduled' && (
                              <button
                                onClick={() => handleCheckIn(visitor)}
                                className="text-green-600 hover:text-green-900"
                                title="Check In"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                            )}
                            {visitor.status === 'checked-in' && (
                              <button
                                onClick={() => handleCheckOut(visitor)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Check Out"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(visitor.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
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

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visitor Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-8 w-8 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Daily Report</div>
                      <div className="text-sm text-gray-500">Today's visitor activity</div>
                    </div>
                  </div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <ChartBarIcon className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Monthly Report</div>
                      <div className="text-sm text-gray-500">Monthly visitor statistics</div>
                    </div>
                  </div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Company Report</div>
                      <div className="text-sm text-gray-500">Visitors by company</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {viewMode ? 'Visitor Details' : editingVisitor ? 'Edit Visitor' : 'Add New Visitor'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setViewMode(false);
                      setEditingVisitor(null);
                      setSelectedVisitor(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {viewMode && selectedVisitor ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedVisitor.firstName} {selectedVisitor.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.company}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.purpose}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Host Employee</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.hostEmployee}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedVisitor.status)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Badge Number</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.badgeNumber || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedVisitor.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedVisitor.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purpose *
                        </label>
                        <select
                          required
                          value={formData.purpose}
                          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Purpose</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Interview">Interview</option>
                          <option value="Delivery">Delivery</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Client Visit">Client Visit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Host Employee *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.hostEmployee}
                          onChange={(e) => setFormData({...formData, hostEmployee: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Arrival *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={formData.expectedArrival}
                          onChange={(e) => setFormData({...formData, expectedArrival: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Departure
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.expectedDeparture}
                          onChange={(e) => setFormData({...formData, expectedDeparture: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number
                        </label>
                        <input
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          value={formData.vehicleNumber}
                          onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes or special instructions..."
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingVisitor(null);
                          resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingVisitor ? 'Update Visitor' : 'Add Visitor'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visitorsmonitor;
