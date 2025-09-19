'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';

export default function NewEmployee() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    startDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare employee data for Firebase
      const employeeData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        salary: formData.salary,
        joinDate: formData.startDate,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
        notes: formData.notes,
        status: 'Active',
        avatar: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add employee to Firebase
      const docRef = await addDoc(collection(db, 'employees'), employeeData);
      console.log('Employee added with ID:', docRef.id);
      
      alert('Employee added successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        startDate: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        skills: '',
        notes: ''
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
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter email address"
                />
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
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.title}>{pos.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
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
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
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
                phone: '',
                position: '',
                department: '',
                salary: '',
                startDate: '',
                address: '',
                emergencyContact: '',
                emergencyPhone: '',
                skills: '',
                notes: ''
              });
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