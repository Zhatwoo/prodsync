'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon
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
import { db } from '../../../lib/firebaseClient';

const Permits = () => {
  const [permits, setPermits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    permitNumber: '',
    permitType: '',
    applicantName: '',
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    description: '',
    applicationDate: '',
    expiryDate: '',
    fee: '',
    status: 'pending',
    issuedBy: '',
    notes: '',
    documents: []
  });

  // Firebase operations
  useEffect(() => {
    const fetchPermits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Real-time listener for permits
        const permitsRef = collection(db, 'permits');
        const permitsQuery = query(permitsRef, orderBy('applicationDate', 'desc'));
        
        const unsubscribe = onSnapshot(permitsQuery, (snapshot) => {
          const permitsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPermits(permitsData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching permits:', error);
          setError('Failed to load permits');
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up permits listener:', error);
        setError('Failed to load permits');
        setLoading(false);
      }
    };

    fetchPermits();
  }, []);

  const permitTypes = [
    { value: 'business', label: 'Business License', icon: BuildingOfficeIcon },
    { value: 'construction', label: 'Construction Permit', icon: DocumentTextIcon },
    { value: 'health', label: 'Health Permit', icon: CheckCircleIcon },
    { value: 'fire', label: 'Fire Safety Permit', icon: ExclamationTriangleIcon },
    { value: 'environmental', label: 'Environmental Permit', icon: MapPinIcon },
    { value: 'zoning', label: 'Zoning Permit', icon: MapPinIcon },
    { value: 'signage', label: 'Signage Permit', icon: DocumentTextIcon },
    { value: 'parking', label: 'Parking Permit', icon: MapPinIcon }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow', icon: ClockIcon },
    { value: 'approved', label: 'Approved', color: 'green', icon: CheckCircleIcon },
    { value: 'rejected', label: 'Rejected', color: 'red', icon: XCircleIcon },
    { value: 'expired', label: 'Expired', color: 'gray', icon: ExclamationTriangleIcon },
    { value: 'renewal', label: 'Renewal Required', color: 'blue', icon: CalendarIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePermitNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PER-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      const permitData = {
        ...formData,
        fee: parseFloat(formData.fee) || 0,
        updatedAt: new Date().toISOString()
      };

      if (editingPermit) {
        // Update existing permit
        const permitRef = doc(db, 'permits', editingPermit.id);
        await updateDoc(permitRef, permitData);
      } else {
        // Add new permit
        permitData.permitNumber = generatePermitNumber();
        permitData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'permits'), permitData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving permit:', error);
      setError('Failed to save permit. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      permitNumber: '',
      permitType: '',
      applicantName: '',
      companyName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      description: '',
      applicationDate: '',
      expiryDate: '',
      fee: '',
      status: 'pending',
      issuedBy: '',
      notes: '',
      documents: []
    });
    setEditingPermit(null);
    setShowModal(false);
  };

  const handleEdit = (permit) => {
    setEditingPermit(permit);
    setFormData({
      permitNumber: permit.permitNumber,
      permitType: permit.permitType,
      applicantName: permit.applicantName,
      companyName: permit.companyName,
      contactEmail: permit.contactEmail,
      contactPhone: permit.contactPhone,
      address: permit.address,
      description: permit.description,
      applicationDate: permit.applicationDate,
      expiryDate: permit.expiryDate,
      fee: permit.fee.toString(),
      status: permit.status,
      issuedBy: permit.issuedBy,
      notes: permit.notes,
      documents: permit.documents || []
    });
    setShowModal(true);
  };

  const handleDelete = async (permitId) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'permits', permitId));
      } catch (error) {
        console.error('Error deleting permit:', error);
        setError('Failed to delete permit. Please try again.');
      }
    }
  };

  const handleView = (permit) => {
    setSelectedPermit(permit);
    setViewMode(true);
  };

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || permit.status === filterStatus;
    const matchesType = filterType === 'all' || permit.permitType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    const statusData = statusOptions.find(s => s.value === status);
    return statusData ? statusData.color : 'gray';
  };

  const getStatusIcon = (status) => {
    const statusData = statusOptions.find(s => s.value === status);
    return statusData ? statusData.icon : ClockIcon;
  };

  const getTypeIcon = (type) => {
    const typeData = permitTypes.find(t => t.value === type);
    return typeData ? typeData.icon : DocumentTextIcon;
  };

  const getTotalFees = () => {
    return permits.reduce((total, permit) => total + (permit.fee || 0), 0);
  };

  const getStatusStats = () => {
    const stats = {};
    statusOptions.forEach(status => {
      if (status.value !== 'all') {
        const count = permits.filter(p => p.status === status.value).length;
        stats[status.value] = count;
      }
    });
    return stats;
  };

  const getTypeStats = () => {
    const stats = {};
    permitTypes.forEach(type => {
      const count = permits.filter(p => p.permitType === type.value).length;
      stats[type.value] = count;
    });
    return stats;
  };

  const statusStats = getStatusStats();
  const typeStats = getTypeStats();

  return (
    <>
        {/* Header */}
        <div className="p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Permits Management</h1>
          <p className="text-gray-600">Manage corporate permits, licenses, and regulatory compliance</p>
          
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
        <div className="px-6 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'permits', name: 'Permits', icon: DocumentTextIcon },
                { id: 'reports', name: 'Reports', icon: ChartBarIcon }
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
          <div className="px-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Permits</p>
                    <p className="text-2xl font-bold text-gray-900">{permits.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{statusStats.approved || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{statusStats.pending || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Fees</p>
                    <p className="text-2xl font-bold text-gray-900">${getTotalFees().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Permits by Status</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {statusOptions.slice(1).map((status) => {
                      const count = statusStats[status.value] || 0;
                      const percentage = permits.length > 0 ? (count / permits.length) * 100 : 0;
                      const IconComponent = status.icon;
                      return (
                        <div key={status.value} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconComponent className={`h-5 w-5 text-${status.color}-600 mr-3`} />
                            <span className="text-sm font-medium text-gray-900 capitalize">{status.label}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-${status.color}-600 h-2 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Permits by Type</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {permitTypes.map((type) => {
                      const count = typeStats[type.value] || 0;
                      const percentage = permits.length > 0 ? (count / permits.length) * 100 : 0;
                      const IconComponent = type.icon;
                      return (
                        <div key={type.value} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 text-gray-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{type.label}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permits Tab */}
        {activeTab === 'permits' && (
          <div className="px-6 space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search permits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    {statusOptions.slice(1).map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    {permitTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Permit
                </button>
              </div>
            </div>

            {/* Permits Table */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading permits...</span>
              </div>
            ) : filteredPermits.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No permits found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding a new permit.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Permit
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredPermits.map((permit) => {
                    const StatusIcon = getStatusIcon(permit.status);
                    const TypeIcon = getTypeIcon(permit.permitType);
                    const statusColor = getStatusColor(permit.status);
                    return (
                      <li key={permit.id}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <TypeIcon className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">{permit.permitNumber}</p>
                                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {permit.status}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">{permit.applicantName} - {permit.companyName}</p>
                                  <p className="text-sm text-gray-500">{permit.permitType} • ${permit.fee}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleView(permit)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(permit)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(permit.id)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="px-6 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permits Reports</h3>
              <p className="text-gray-600">Reports and analytics features will be implemented here.</p>
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
                    {editingPermit ? 'Edit Permit' : 'Add New Permit'}
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
                        Permit Number
                      </label>
                      <input
                        type="text"
                        name="permitNumber"
                        value={formData.permitNumber}
                        onChange={handleInputChange}
                        disabled={!editingPermit}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permit Type
                      </label>
                      <select
                        name="permitType"
                        value={formData.permitType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        {permitTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Applicant Name
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Application Date
                      </label>
                      <input
                        type="date"
                        name="applicationDate"
                        value={formData.applicationDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fee ($)
                      </label>
                      <input
                        type="number"
                        name="fee"
                        value={formData.fee}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      Issued By
                    </label>
                    <input
                      type="text"
                      name="issuedBy"
                      value={formData.issuedBy}
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
                      {editingPermit ? 'Update Permit' : 'Add Permit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewMode && selectedPermit && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Permit Details</h3>
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
                      {React.createElement(getTypeIcon(selectedPermit.permitType), {
                        className: "h-6 w-6 text-blue-600"
                      })}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedPermit.permitNumber}</h4>
                      <p className="text-sm text-gray-600 capitalize">{selectedPermit.permitType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applicant</label>
                      <p className="text-gray-900">{selectedPermit.applicantName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <p className="text-gray-900">{selectedPermit.companyName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <p className="text-gray-900">{selectedPermit.contactEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <p className="text-gray-900">{selectedPermit.contactPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Date</label>
                      <p className="text-gray-900">{selectedPermit.applicationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <p className="text-gray-900">{selectedPermit.expiryDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fee</label>
                      <p className="text-gray-900">${selectedPermit.fee}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(selectedPermit.status)}-100 text-${getStatusColor(selectedPermit.status)}-800`}>
                        {React.createElement(getStatusIcon(selectedPermit.status), {
                          className: "h-3 w-3 mr-1"
                        })}
                        {selectedPermit.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{selectedPermit.address}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{selectedPermit.description}</p>
                  </div>

                  {selectedPermit.issuedBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Issued By</label>
                      <p className="text-gray-900">{selectedPermit.issuedBy}</p>
                    </div>
                  )}

                  {selectedPermit.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-gray-900">{selectedPermit.notes}</p>
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
                      handleEdit(selectedPermit);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Permit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Permits;


