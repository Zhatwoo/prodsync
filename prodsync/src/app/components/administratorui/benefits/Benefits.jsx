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
  const [enrollments, setEnrollments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enrollment modal states
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedBenefitForEnrollment, setSelectedBenefitForEnrollment] = useState(null);
  const [bulkEnrollmentMode, setBulkEnrollmentMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

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

    const fetchEnrollments = async () => {
      try {
        const enrollmentsRef = collection(db, 'benefitEnrollments');
        const enrollmentsQuery = query(enrollmentsRef, orderBy('enrolledAt', 'desc'));
        
        const unsubscribe = onSnapshot(enrollmentsQuery, (snapshot) => {
          const enrollmentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setEnrollments(enrollmentsData);
        }, (error) => {
          console.error('Error fetching enrollments:', error);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up enrollments listener:', error);
      }
    };

    fetchBenefits();
    fetchEmployees();
    fetchEnrollments();
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

  // Enrollment functions
  const handleEnrollEmployee = async (employeeId, benefitId) => {
    try {
      setError(null);
      
      const response = await fetch('/api/benefits/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          benefitId,
          status: 'active',
          effectiveDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll employee');
      }

      setShowEnrollmentModal(false);
      setSelectedEmployee(null);
      setSelectedBenefitForEnrollment(null);
    } catch (error) {
      console.error('Error enrolling employee:', error);
      setError(error.message);
    }
  };

  const handleBulkEnroll = async () => {
    try {
      setError(null);
      
      const enrollPromises = selectedEmployees.map(employeeId => 
        handleEnrollEmployee(employeeId, selectedBenefitForEnrollment.id)
      );

      await Promise.all(enrollPromises);
      
      setBulkEnrollmentMode(false);
      setSelectedEmployees([]);
      setSelectedBenefitForEnrollment(null);
    } catch (error) {
      console.error('Error in bulk enrollment:', error);
      setError(error.message);
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to remove this enrollment?')) {
      try {
        setError(null);
        
        const response = await fetch(`/api/benefits/enrollment/${enrollmentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove enrollment');
        }
      } catch (error) {
        console.error('Error removing enrollment:', error);
        setError(error.message);
      }
    }
  };

  const openEnrollmentModal = (benefit) => {
    setSelectedBenefitForEnrollment(benefit);
    setShowEnrollmentModal(true);
  };

  const getEnrollmentsForBenefit = (benefitId) => {
    return enrollments.filter(enrollment => enrollment.benefitId === benefitId);
  };

  const getEnrollmentsForEmployee = (employeeId) => {
    return enrollments.filter(enrollment => enrollment.employeeId === employeeId);
  };

  const isEmployeeEnrolled = (employeeId, benefitId) => {
    return enrollments.some(enrollment => 
      enrollment.employeeId === employeeId && enrollment.benefitId === benefitId
    );
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
      {/* Custom styles for modal animations */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-popup {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        .modal-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
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
                        onClick={() => openEnrollmentModal(benefit)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                        disabled={!benefit.isActive}
                      >
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        Enroll
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
          {/* Enrollment Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Employee Enrollment Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage employee enrollments and track benefit participation</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setBulkEnrollmentMode(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Bulk Enrollment
                </button>
              </div>
            </div>
          </div>

          {/* Enrollment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.filter(e => e.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Enrollment Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${enrollments.reduce((total, enrollment) => {
                      const benefit = benefits.find(b => b.id === enrollment.benefitId);
                      return total + (benefit ? benefit.cost : 0);
                    }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
            </div>
            <div className="overflow-x-auto">
              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by enrolling employees in available benefits.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Benefit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map((enrollment) => {
                      const employee = employees.find(e => e.id === enrollment.employeeId);
                      const benefit = benefits.find(b => b.id === enrollment.benefitId);
                      
                      if (!employee || !benefit) return null;
                      
                      return (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.name || 'Unknown Employee'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.position || 'No Position'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{benefit.name}</div>
                            <div className="text-sm text-gray-500">{benefit.provider}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {benefit.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${benefit.cost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enrollment.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleRemoveEnrollment(enrollment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingBenefit ? 'Update benefit information' : 'Create a new employee benefit'}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">

              <form id="benefit-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Benefit Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Health Insurance Premium"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monthly Cost ($) *
                      </label>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Provider *
                      </label>
                      <input
                        type="text"
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Blue Cross Blue Shield"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Effective Dates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Effective Date *
                      </label>
                      <input
                        type="date"
                        name="effectiveDate"
                        value={formData.effectiveDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Benefit Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Provide a detailed description of this benefit..."
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Coverage Details *
                      </label>
                      <textarea
                        name="coverage"
                        value={formData.coverage}
                        onChange={handleInputChange}
                        required
                        rows={2}
                        placeholder="Describe what is covered by this benefit..."
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Eligibility Requirements *
                      </label>
                      <textarea
                        name="eligibility"
                        value={formData.eligibility}
                        onChange={handleInputChange}
                        required
                        rows={2}
                        placeholder="Describe who is eligible for this benefit..."
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Status</h4>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Active Benefit
                      </label>
                      <p className="text-xs text-gray-500">
                        Check this box to make the benefit available for enrollment
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="benefit-form"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {editingBenefit ? 'Update Benefit' : 'Add Benefit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewMode && selectedBenefit && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewMode(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Benefit Details</h3>
                  <p className="text-sm text-gray-600 mt-1">View benefit information and details</p>
                </div>
                <button
                  onClick={() => setViewMode(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">

              <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {React.createElement(getCategoryIcon(selectedBenefit.category), {
                        className: "h-8 w-8 text-blue-600"
                      })}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{selectedBenefit.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{selectedBenefit.category}</p>
                      <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                        selectedBenefit.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBenefit.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Cost</label>
                      <p className="text-xl font-bold text-gray-900">${selectedBenefit.cost}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Provider</label>
                      <p className="text-gray-900">{selectedBenefit.provider}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Effective Date</label>
                      <p className="text-gray-900">{selectedBenefit.effectiveDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                      <p className="text-gray-900">{selectedBenefit.expiryDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Enrolled Employees</label>
                      <p className="text-gray-900">{selectedBenefit.enrolledEmployees} employees</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-900 leading-relaxed">{selectedBenefit.description}</p>
                </div>

                {/* Coverage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">Coverage Details</h5>
                  <p className="text-gray-900 leading-relaxed">{selectedBenefit.coverage}</p>
                </div>

                {/* Eligibility */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">Eligibility Requirements</h5>
                  <p className="text-gray-900 leading-relaxed">{selectedBenefit.eligibility}</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setViewMode(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewMode(false);
                    handleEdit(selectedBenefit);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Benefit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && selectedBenefitForEnrollment && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEnrollmentModal(false);
              setSelectedEmployee(null);
              setSelectedBenefitForEnrollment(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Enroll Employees in {selectedBenefitForEnrollment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select employees to enroll in this benefit
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEnrollmentModal(false);
                    setSelectedEmployee(null);
                    setSelectedBenefitForEnrollment(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Benefit Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {React.createElement(getCategoryIcon(selectedBenefitForEnrollment.category), {
                        className: "h-8 w-8 text-blue-600"
                      })}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedBenefitForEnrollment.name}</h4>
                      <p className="text-sm text-gray-600">${selectedBenefitForEnrollment.cost} per month</p>
                    </div>
                  </div>
                </div>

                {/* Employee Selection */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Select Employees</h5>
                  <div className="max-h-96 overflow-y-auto">
                    {employees.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No employees found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employees.map((employee) => {
                          const isEnrolled = isEmployeeEnrolled(employee.id, selectedBenefitForEnrollment.id);
                          return (
                            <div
                              key={employee.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                isEnrolled 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              onClick={() => {
                                if (!isEnrolled) {
                                  handleEnrollEmployee(employee.id, selectedBenefitForEnrollment.id);
                                }
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {employee.name || 'Unknown Employee'}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {employee.position || 'No Position'}
                                  </p>
                                </div>
                                {isEnrolled && (
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Enrolled
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Enrollment Modal */}
      {bulkEnrollmentMode && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setBulkEnrollmentMode(false);
              setSelectedEmployees([]);
              setSelectedBenefitForEnrollment(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Bulk Employee Enrollment</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select a benefit and multiple employees for bulk enrollment
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBulkEnrollmentMode(false);
                    setSelectedEmployees([]);
                    setSelectedBenefitForEnrollment(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Benefit Selection */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Select Benefit</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {benefits.filter(b => b.isActive).map((benefit) => (
                      <div
                        key={benefit.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedBenefitForEnrollment?.id === benefit.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                        onClick={() => setSelectedBenefitForEnrollment(benefit)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {React.createElement(getCategoryIcon(benefit.category), {
                              className: "h-5 w-5 text-blue-600"
                            })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{benefit.name}</p>
                            <p className="text-sm text-gray-500">${benefit.cost}/month</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employee Selection */}
                {selectedBenefitForEnrollment && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Employees for {selectedBenefitForEnrollment.name}
                    </h5>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employees.map((employee) => {
                          const isEnrolled = isEmployeeEnrolled(employee.id, selectedBenefitForEnrollment.id);
                          const isSelected = selectedEmployees.includes(employee.id);
                          
                          return (
                            <div
                              key={employee.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                isEnrolled 
                                  ? 'border-green-300 bg-green-50 cursor-not-allowed'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              onClick={() => {
                                if (!isEnrolled) {
                                  if (isSelected) {
                                    setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
                                  } else {
                                    setSelectedEmployees(prev => [...prev, employee.id]);
                                  }
                                }
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {employee.name || 'Unknown Employee'}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {employee.position || 'No Position'}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  {isEnrolled ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Enrolled
                                    </span>
                                  ) : isSelected ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Selected
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setBulkEnrollmentMode(false);
                      setSelectedEmployees([]);
                      setSelectedBenefitForEnrollment(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkEnroll}
                    disabled={!selectedBenefitForEnrollment || selectedEmployees.length === 0}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enroll {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benefits;
