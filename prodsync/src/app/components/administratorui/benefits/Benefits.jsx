'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CurrencyDollarIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
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

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    cost: '',
    coverage: '',
    eligibility: '',
    provider: '',
    effectiveDate: '',
    expiryDate: '',
    isActive: true
  });

  // Firebase operations
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Real-time listener for benefits
        const benefitsRef = collection(db, 'benefits');
        const benefitsQuery = query(benefitsRef, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(benefitsQuery, (snapshot) => {
          const benefitsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBenefits(benefitsData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching benefits:', error);
          setError('Failed to load benefits');
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up benefits listener:', error);
        setError('Failed to load benefits');
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('name', 'asc'));
        
        const snapshot = await getDocs(employeesQuery);
        const employeesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
        // Don't set error for employees as it's not critical
      }
    };

    fetchBenefits();
    fetchEmployees();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories', icon: ChartBarIcon },
    { value: 'health', label: 'Health & Wellness', icon: HeartIcon },
    { value: 'retirement', label: 'Retirement', icon: CurrencyDollarIcon },
    { value: 'insurance', label: 'Insurance', icon: ShieldCheckIcon },
    { value: 'education', label: 'Education & Training', icon: AcademicCapIcon },
    { value: 'worklife', label: 'Work-Life Balance', icon: HomeIcon },
    { value: 'transportation', label: 'Transportation', icon: TruckIcon },
    { value: 'timeoff', label: 'Time Off', icon: ClockIcon }
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
      
      const benefitData = {
        ...formData,
        cost: parseFloat(formData.cost),
        enrolledEmployees: editingBenefit ? editingBenefit.enrolledEmployees : 0,
        updatedAt: new Date().toISOString()
      };

      if (editingBenefit) {
        // Update existing benefit
        const benefitRef = doc(db, 'benefits', editingBenefit.id);
        await updateDoc(benefitRef, benefitData);
      } else {
        // Add new benefit
        benefitData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'benefits'), benefitData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving benefit:', error);
      setError('Failed to save benefit. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      cost: '',
      coverage: '',
      eligibility: '',
      provider: '',
      effectiveDate: '',
      expiryDate: '',
      isActive: true
    });
    setEditingBenefit(null);
    setShowModal(false);
  };

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit);
    setFormData({
      name: benefit.name,
      category: benefit.category,
      description: benefit.description,
      cost: benefit.cost.toString(),
      coverage: benefit.coverage,
      eligibility: benefit.eligibility,
      provider: benefit.provider,
      effectiveDate: benefit.effectiveDate,
      expiryDate: benefit.expiryDate,
      isActive: benefit.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (benefitId) => {
    if (window.confirm('Are you sure you want to delete this benefit?')) {
      try {
        setError(null);
        await deleteDoc(doc(db, 'benefits', benefitId));
      } catch (error) {
        console.error('Error deleting benefit:', error);
        setError('Failed to delete benefit. Please try again.');
      }
    }
  };

  const handleView = (benefit) => {
    setSelectedBenefit(benefit);
    setViewMode(true);
  };

  const filteredBenefits = benefits.filter(benefit => {
    const matchesSearch = benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || benefit.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : ChartBarIcon;
  };

  const getTotalCost = () => {
    return benefits.reduce((total, benefit) => total + (benefit.cost * benefit.enrolledEmployees), 0);
  };

  const getTotalEnrolled = () => {
    return benefits.reduce((total, benefit) => total + benefit.enrolledEmployees, 0);
  };

  const getCategoryStats = () => {
    const stats = {};
    categories.forEach(category => {
      if (category.value !== 'all') {
        const categoryBenefits = benefits.filter(b => b.category === category.value);
        stats[category.value] = {
          count: categoryBenefits.length,
          totalCost: categoryBenefits.reduce((sum, b) => sum + (b.cost * b.enrolledEmployees), 0),
          totalEnrolled: categoryBenefits.reduce((sum, b) => sum + b.enrolledEmployees, 0)
        };
      }
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Benefits Management</h2>
            <p className="text-gray-600 mt-1">Manage employee benefits, coverage, and enrollment</p>
          </div>
        </div>
        
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
              { id: 'benefits', name: 'Benefits', icon: HeartIcon },
              { id: 'enrollment', name: 'Enrollment', icon: AcademicCapIcon }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HeartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Benefits</p>
                  <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalEnrolled()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${getTotalCost().toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Benefits</p>
                  <p className="text-2xl font-bold text-gray-900">{benefits.filter(b => b.isActive).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Benefits by Category</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.slice(1).map((category) => {
                  const stats = categoryStats[category.value];
                  const IconComponent = category.icon;
                  return (
                    <div key={category.value} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <IconComponent className="h-5 w-5 text-gray-600 mr-2" />
                        <h4 className="font-medium text-gray-900">{category.label}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Benefits: {stats?.count || 0}</p>
                        <p className="text-sm text-gray-600">Enrolled: {stats?.totalEnrolled || 0}</p>
                        <p className="text-sm text-gray-600">Cost: ${stats?.totalCost?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search benefits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Add Benefit
              </button>
            </div>
          </div>

          {/* Benefits Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading benefits...</span>
            </div>
          ) : filteredBenefits.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No benefits found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new benefit.'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Benefit
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBenefits.map((benefit) => {
              const IconComponent = getCategoryIcon(benefit.category);
              return (
                <div key={benefit.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{benefit.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{benefit.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        benefit.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {benefit.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{benefit.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="font-medium">${benefit.cost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrolled:</span>
                        <span className="font-medium">{benefit.enrolledEmployees} employees</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Provider:</span>
                        <span className="font-medium">{benefit.provider}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(benefit)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(benefit)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(benefit.id)}
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

      {/* Enrollment Tab */}
      {activeTab === 'enrollment' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Enrollment</h3>
            <p className="text-gray-600">Enrollment management features will be implemented here.</p>
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
                  {editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}
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
                      Benefit Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      Monthly Cost ($)
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider
                    </label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      name="effectiveDate"
                      value={formData.effectiveDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coverage Details
                  </label>
                  <textarea
                    name="coverage"
                    value={formData.coverage}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility
                  </label>
                  <textarea
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    Active Benefit
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
                    {editingBenefit ? 'Update Benefit' : 'Add Benefit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewMode && selectedBenefit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Benefit Details</h3>
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
                    {React.createElement(getCategoryIcon(selectedBenefit.category), {
                      className: "h-6 w-6 text-blue-600"
                    })}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedBenefit.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{selectedBenefit.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Cost</label>
                    <p className="text-lg font-semibold text-gray-900">${selectedBenefit.cost}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <p className="text-gray-900">{selectedBenefit.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                    <p className="text-gray-900">{selectedBenefit.effectiveDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <p className="text-gray-900">{selectedBenefit.expiryDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrolled Employees</label>
                    <p className="text-gray-900">{selectedBenefit.enrolledEmployees}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedBenefit.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedBenefit.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedBenefit.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Coverage</label>
                  <p className="text-gray-900">{selectedBenefit.coverage}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Eligibility</label>
                  <p className="text-gray-900">{selectedBenefit.eligibility}</p>
                </div>
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
                    handleEdit(selectedBenefit);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Benefit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benefits;
