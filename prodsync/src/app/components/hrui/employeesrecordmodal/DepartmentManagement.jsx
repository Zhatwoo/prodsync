'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch departments from Firebase
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const departmentsRef = collection(db, 'departments');
        const q = query(departmentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const departmentsData = [];
        querySnapshot.forEach((doc) => {
          departmentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setDepartments(departmentsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingDepartment) {
        // Update existing department
        const departmentRef = doc(db, 'departments', editingDepartment.id);
        await updateDoc(departmentRef, {
          ...newDepartment,
          updatedAt: serverTimestamp()
        });
        
        setDepartments(prev => prev.map(dept => 
          dept.id === editingDepartment.id 
            ? { ...dept, ...newDepartment, updatedAt: new Date() }
            : dept
        ));
        setEditingDepartment(null);
        alert('Department updated successfully!');
      } else {
        // Add new department
        const departmentData = {
          ...newDepartment,
          employeeCount: 0,
          status: 'Active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'departments'), departmentData);
        const newDept = {
          id: docRef.id,
          ...departmentData
        };
        setDepartments(prev => [newDept, ...prev]);
        alert('Department added successfully!');
      }
      
      setNewDepartment({
        name: '',
        description: '',
        manager: '',
        budget: '',
        location: ''
      });
      setIsAddingNew(false);
    } catch (err) {
      console.error('Error saving department:', err);
      setError('Failed to save department. Please try again.');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      description: department.description,
      manager: department.manager,
      budget: department.budget,
      location: department.location
    });
    setIsAddingNew(true);
  };

  const handleDelete = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'departments', departmentToDelete.id));
      setDepartments(prev => prev.filter(dept => dept.id !== departmentToDelete.id));
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
      alert('Department deleted successfully!');
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Failed to delete department');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingDepartment(null);
    setNewDepartment({
      name: '',
      description: '',
      manager: '',
      budget: '',
      location: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading departments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
            <p className="text-gray-600 mt-1">Manage company departments and their information</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Department
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <input
                  type="text"
                  name="manager"
                  value={newDepartment.manager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter manager name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={newDepartment.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newDepartment.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newDepartment.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingDepartment ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                      <div className="text-sm text-gray-500">{department.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{department.manager}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{department.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{department.budget}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{department.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(department)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                        <button
                          onClick={() => handleDelete(department)}
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

      {/* Summary */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{departments.length}</div>
            <div className="text-sm text-gray-600">Total Departments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {departments.filter(dept => dept.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Departments</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDepartmentToDelete(null);
        }}
        onConfirm={confirmDeleteDepartment}
        title="Delete Department"
        message="Are you sure you want to delete this department? This will affect all employees in this department."
        itemName={departmentToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}