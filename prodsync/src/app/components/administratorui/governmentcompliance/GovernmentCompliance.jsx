'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon
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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const GovernmentCompliance = () => {
  const [complianceItems, setComplianceItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    agency: '',
    regulation: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    responsiblePerson: '',
    contactInfo: '',
    documentUrl: '',
    notes: '',
    isActive: true
  });

  // Firebase operations
  useEffect(() => {
    const fetchComplianceItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Real-time listener for compliance items
        const complianceRef = collection(db, 'governmentCompliance');
        const complianceQuery = query(complianceRef, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(complianceQuery, (snapshot) => {
          const complianceData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setComplianceItems(complianceData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching compliance items:', error);
          setError('Failed to load compliance items');
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up compliance listener:', error);
        setError('Failed to load compliance items');
        setLoading(false);
      }
    };

    fetchComplianceItems();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories', icon: ChartBarIcon },
    { value: 'tax', label: 'Tax Compliance', icon: DocumentTextIcon },
    { value: 'labor', label: 'Labor & Employment', icon: BuildingOfficeIcon },
    { value: 'environmental', label: 'Environmental', icon: ShieldCheckIcon },
    { value: 'safety', label: 'Safety & Health', icon: ExclamationTriangleIcon },
    { value: 'business', label: 'Business Registration', icon: BuildingOfficeIcon },
    { value: 'financial', label: 'Financial Reporting', icon: DocumentTextIcon },
    { value: 'data', label: 'Data Protection', icon: ShieldCheckIcon }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'overdue', label: 'Overdue', color: 'red' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      const complianceData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        // Update existing item
        const itemRef = doc(db, 'governmentCompliance', editingItem.id);
        await updateDoc(itemRef, complianceData);
      } else {
        // Add new item
        complianceData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'governmentCompliance'), complianceData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving compliance item:', error);
      setError('Failed to save compliance item. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      agency: '',
      regulation: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
      responsiblePerson: '',
      contactInfo: '',
      documentUrl: '',
      notes: '',
      isActive: true
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      agency: item.agency,
      regulation: item.regulation,
      dueDate: item.dueDate,
      status: item.status,
      priority: item.priority,
      responsiblePerson: item.responsiblePerson,
      contactInfo: item.contactInfo,
      documentUrl: item.documentUrl,
      notes: item.notes,
      isActive: item.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this compliance item?')) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'governmentCompliance', itemId));
      } catch (error) {
        console.error('Error deleting compliance item:', error);
        setError('Failed to delete compliance item. Please try again.');
      }
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setViewMode(true);
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : DocumentTextIcon;
  };

  const getStatusColor = (status) => {
    const statusData = statusOptions.find(s => s.value === status);
    return statusData ? statusData.color : 'gray';
  };

  const getPriorityColor = (priority) => {
    const priorityData = priorityOptions.find(p => p.value === priority);
    return priorityData ? priorityData.color : 'gray';
  };

  const getOverdueItems = () => {
    const today = new Date();
    return complianceItems.filter(item => {
      const dueDate = new Date(item.dueDate);
      return dueDate < today && item.status !== 'completed';
    });
  };

  const getUpcomingItems = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return complianceItems.filter(item => {
      const dueDate = new Date(item.dueDate);
      return dueDate >= today && dueDate <= nextWeek && item.status !== 'completed';
    });
  };

  const getStats = () => {
    const total = complianceItems.length;
    const completed = complianceItems.filter(item => item.status === 'completed').length;
    const pending = complianceItems.filter(item => item.status === 'pending').length;
    const overdue = getOverdueItems().length;
    const upcoming = getUpcomingItems().length;

    return { total, completed, pending, overdue, upcoming };
  };

  const stats = getStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Compliance</h1>
          <p className="text-gray-600">Manage regulatory compliance, deadlines, and government requirements</p>
          
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
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'compliance', name: 'Compliance Items', icon: DocumentTextIcon },
                { id: 'deadlines', name: 'Deadlines', icon: CalendarDaysIcon },
                { id: 'reports', name: 'Reports', icon: DocumentArrowDownIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BellIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {(stats.overdue > 0 || stats.upcoming > 0) && (
              <div className="space-y-4">
                {stats.overdue > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="text-sm font-medium text-red-800">
                        {stats.overdue} Overdue Compliance Item{stats.overdue > 1 ? 's' : ''}
                      </h3>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Immediate attention required for overdue compliance requirements.
                    </p>
                  </div>
                )}

                {stats.upcoming > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="text-sm font-medium text-orange-800">
                        {stats.upcoming} Upcoming Deadline{stats.upcoming > 1 ? 's' : ''}
                      </h3>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Compliance deadlines approaching within the next 7 days.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Compliance by Category</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.slice(1).map((category) => {
                    const categoryItems = complianceItems.filter(item => item.category === category.value);
                    const completed = categoryItems.filter(item => item.status === 'completed').length;
                    const IconComponent = category.icon;
                    return (
                      <div key={category.value} className="border rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <IconComponent className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-medium text-gray-900">{category.label}</h4>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Total: {categoryItems.length}</p>
                          <p className="text-sm text-gray-600">Completed: {completed}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${categoryItems.length > 0 ? (completed / categoryItems.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Items Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search compliance items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Compliance Item
                </button>
              </div>
            </div>

            {/* Compliance Items List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading compliance items...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No compliance items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding a new compliance item.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Compliance Item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const IconComponent = getCategoryIcon(item.category);
                  const statusColor = getStatusColor(item.status);
                  const priorityColor = getPriorityColor(item.priority);
                  const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
                  
                  return (
                    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.agency}</p>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
                              {item.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${priorityColor}-100 text-${priorityColor}-800`}>
                              {item.priority}
                            </span>
                            {isOverdue && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Due Date</p>
                            <p className="text-sm text-gray-900">{new Date(item.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Responsible Person</p>
                            <p className="text-sm text-gray-900">{item.responsiblePerson}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Regulation</p>
                            <p className="text-sm text-gray-900">{item.regulation}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Deadlines Tab */}
        {activeTab === 'deadlines' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overdue Items */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    Overdue Items
                  </h3>
                </div>
                <div className="p-6">
                  {getOverdueItems().length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No overdue items</p>
                  ) : (
                    <div className="space-y-3">
                      {getOverdueItems().map((item) => (
                        <div key={item.id} className="border-l-4 border-red-500 pl-4 py-2">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.agency}</p>
                          <p className="text-sm text-red-600">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Items */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <BellIcon className="h-5 w-5 text-orange-600 mr-2" />
                    Upcoming Deadlines
                  </h3>
                </div>
                <div className="p-6">
                  {getUpcomingItems().length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-3">
                      {getUpcomingItems().map((item) => (
                        <div key={item.id} className="border-l-4 border-orange-500 pl-4 py-2">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.agency}</p>
                          <p className="text-sm text-orange-600">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Reports</h3>
              <p className="text-gray-600">Reporting features will be implemented here.</p>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingItem ? 'Edit Compliance Item' : 'Add New Compliance Item'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.slice(1).map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agency
                      </label>
                      <input
                        type="text"
                        name="agency"
                        value={formData.agency}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regulation
                      </label>
                      <input
                        type="text"
                        name="regulation"
                        value={formData.regulation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statusOptions.slice(1).map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsible Person
                      </label>
                      <input
                        type="text"
                        name="responsiblePerson"
                        value={formData.responsiblePerson}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document URL
                    </label>
                    <input
                      type="url"
                      name="documentUrl"
                      value={formData.documentUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Active Compliance Item
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewMode && selectedItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Compliance Item Details</h3>
                  <button
                    onClick={() => setViewMode(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {React.createElement(getCategoryIcon(selectedItem.category), {
                        className: "h-6 w-6 text-blue-600"
                      })}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h4>
                      <p className="text-sm text-gray-600">{selectedItem.agency}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(selectedItem.status)}-100 text-${getStatusColor(selectedItem.status)}-800`}>
                        {selectedItem.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getPriorityColor(selectedItem.priority)}-100 text-${getPriorityColor(selectedItem.priority)}-800`}>
                        {selectedItem.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <p className="text-gray-900">{new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
                      <p className="text-gray-900">{selectedItem.responsiblePerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Regulation</label>
                      <p className="text-gray-900">{selectedItem.regulation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                      <p className="text-gray-900">{selectedItem.contactInfo}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{selectedItem.description}</p>
                  </div>

                  {selectedItem.documentUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Document</label>
                      <a 
                        href={selectedItem.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}

                  {selectedItem.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-gray-900">{selectedItem.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setViewMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setViewMode(false);
                      handleEdit(selectedItem);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentCompliance;

