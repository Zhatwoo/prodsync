'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../../lib/firebaseClient';
import { availableRoles } from '../../../lib/roleRoutes';

export default function NewEmployee() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    position: '',
    department: '',
    role: 'Sales', // Default role
    company: 'ProdSync Inc.', // Company name
    salary: '',
    startDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: '',
    notes: '',
    createAccount: true // Option to create account or just employee record
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Debug Firebase configuration
  useEffect(() => {
    console.log('🔧 Firebase Debug Info:', {
      hasAuth: !!auth,
      hasDb: !!db,
      authApp: auth?.app?.options?.projectId || 'N/A',
      dbApp: db?.app?.options?.projectId || 'N/A'
    });
  }, []);

  // Fetch positions and departments from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch positions
        const positionsRef = collection(db, 'positions');
        const positionsQuery = query(positionsRef, orderBy('createdAt', 'desc'));
        const positionsSnapshot = await getDocs(positionsQuery);
        
        const positionsData = [];
        positionsSnapshot.forEach((doc) => {
          positionsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setPositions(positionsData);

        // Fetch departments
        const departmentsRef = collection(db, 'departments');
        const departmentsQuery = query(departmentsRef, orderBy('createdAt', 'desc'));
        const departmentsSnapshot = await getDocs(departmentsQuery);
        
        const departmentsData = [];
        departmentsSnapshot.forEach((doc) => {
          departmentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setDepartments(departmentsData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.createAccount) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!validateForm()) {
      setError('Please fix the form errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      let userId = null;

      // Create user account if requested
      if (formData.createAccount) {
        try {
          console.log('🚀 Creating employee account via server API...');
          
          const response = await fetch('/api/create-employee-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              role: formData.role,
              company: formData.company,
              phone: formData.phone,
              position: formData.position,
              department: formData.department,
              salary: formData.salary,
              startDate: formData.startDate,
              address: formData.address,
              emergencyContact: formData.emergencyContact,
              emergencyPhone: formData.emergencyPhone,
              skills: formData.skills,
              notes: formData.notes
            })
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to create employee account');
          }

          userId = result.userId;
          console.log('✅ Employee account created successfully via server API:', {
            userId: result.userId,
            userData: result.userData,
            employeeData: result.employeeData
          });

        } catch (apiError) {
          console.error('Error creating employee account via API:', apiError);
          
          if (apiError.message.includes('Email is already in use')) {
            setError('Email is already in use. Please use a different email or uncheck "Create Account".');
          } else if (apiError.message.includes('weak-password')) {
            setError('Password is too weak. Please use a stronger password.');
          } else if (apiError.message.includes('invalid-email')) {
            setError('Invalid email address. Please check your email format.');
          } else {
            setError(`Failed to create employee account: ${apiError.message}`);
          }
          setLoading(false);
          return;
        }
      }

      // If account creation was not requested, create employee record only
      if (!formData.createAccount) {
        // Prepare employee data for Firebase (employee only, no account)
      const employeeData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
          role: formData.role,
          company: formData.company,
        salary: formData.salary,
        joinDate: formData.startDate,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
        notes: formData.notes,
        status: 'Active',
        avatar: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`,
          userId: null, // No user account
          hasAccount: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add employee to Firebase
        console.log('💾 Saving employee data to Firestore employees collection:', { 
          employeeData,
          collection: 'employees'
        });
      const docRef = await addDoc(collection(db, 'employees'), employeeData);
        console.log('✅ Employee added to Firestore employees collection with ID:', docRef.id);
      }
      
      const successMessage = formData.createAccount 
        ? `Employee ${formData.firstName} ${formData.lastName} added successfully and user account created! User ID: ${userId}. They can now log in with their email and password. Please wait a few seconds before trying to log in.`
        : `Employee ${formData.firstName} ${formData.lastName} added successfully!`;
      
      alert(successMessage);
      
      // Also log the success for debugging
      console.log('🎉 Employee creation completed successfully:', {
        userId: userId,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hasAccount: formData.createAccount
      });
      
      if (formData.createAccount) {
        console.log('📋 Data saved to collections via server API:');
        console.log('  👤 users collection: User account created with Firebase Auth');
        console.log('  👥 employees collection: Employee record created with user link');
      } else {
        console.log('📋 Data saved to collections:');
        console.log('  👥 employees collection: Employee record created (no user account)');
      }
      
      // Test the getRole API if user was created
      if (userId) {
        setTimeout(async () => {
          try {
            console.log('🧪 Testing getRole API for user:', userId);
            const response = await fetch(`/api/getRole?uid=${userId}`);
            const data = await response.json();
            if (response.ok) {
              console.log('✅ getRole API test successful:', data);
            } else {
              console.error('❌ getRole API test failed:', data);
            }
          } catch (testError) {
            console.error('❌ getRole API test error:', testError);
          }
        }, 3000); // Wait 3 seconds before testing
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        position: '',
        department: '',
        role: 'Sales',
        company: 'ProdSync Inc.',
        salary: '',
        startDate: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        skills: '',
        notes: '',
        createAccount: true
      });
    } catch (err) {
      console.error('Error adding employee:', err);
      setError('Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading form data...</div>
        </div>
      </div>
    );
  }

  const refreshData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch positions
      const positionsRef = collection(db, 'positions');
      const positionsQuery = query(positionsRef, orderBy('createdAt', 'desc'));
      const positionsSnapshot = await getDocs(positionsQuery);
      
      const positionsData = [];
      positionsSnapshot.forEach((doc) => {
        positionsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setPositions(positionsData);

      // Fetch departments
      const departmentsRef = collection(db, 'departments');
      const departmentsQuery = query(departmentsRef, orderBy('createdAt', 'desc'));
      const departmentsSnapshot = await getDocs(departmentsQuery);
      
      const departmentsData = [];
      departmentsSnapshot.forEach((doc) => {
        departmentsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setDepartments(departmentsData);

    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh form data');
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
            <p className="text-gray-600 mt-1">Create a new employee record</p>
          </div>
          <button
            type="button"
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh Options
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Account Creation Option */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Account Creation</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="createAccount"
                checked={formData.createAccount}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Create user account for this employee
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              If checked, the employee will be able to log in to the system with their email and password.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Credentials (only show if creating account) */}
        {formData.createAccount && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Account Credentials</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={formData.createAccount}
                    className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password (min 8 characters)"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={formData.createAccount}
                    className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employment Information */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.title}>{pos.title}</option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {availableRoles.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter salary amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 text-gray-900 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter emergency contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter emergency contact phone"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter skills and qualifications"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Additional notes or comments"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                position: '',
                department: '',
                role: 'Sales',
                company: 'ProdSync Inc.',
                salary: '',
                startDate: '',
                address: '',
                emergencyContact: '',
                emergencyPhone: '',
                skills: '',
                notes: '',
                createAccount: true
              });
              setErrors({});
              setError(null);
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding Employee...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}