'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function PositionManagement() {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryRange: '',
    level: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch positions and departments from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
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
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static options for form dropdowns
  const levels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPosition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
    if (editingPosition) {
      // Update existing position
        const positionRef = doc(db, 'positions', editingPosition.id);
        await updateDoc(positionRef, {
          ...newPosition,
          updatedAt: serverTimestamp()
        });
        
      setPositions(prev => prev.map(pos => 
        pos.id === editingPosition.id 
            ? { ...pos, ...newPosition, updatedAt: new Date() }
          : pos
      ));
      setEditingPosition(null);
        alert('Position updated successfully!');
    } else {
      // Add new position
        const positionData = {
        ...newPosition,
        employeeCount: 0,
          status: 'Active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'positions'), positionData);
        const newPos = {
          id: docRef.id,
          ...positionData
        };
        setPositions(prev => [newPos, ...prev]);
        alert('Position added successfully!');
    }
    
    setNewPosition({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryRange: '',
      level: ''
    });
    setIsAddingNew(false);
    } catch (err) {
      console.error('Error saving position:', err);
      setError('Failed to save position. Please try again.');
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setNewPosition({
      title: position.title,
      department: position.department,
      description: position.description,
      requirements: position.requirements,
      salaryRange: position.salaryRange,
      level: position.level
    });
    setIsAddingNew(true);
  };

  const handleDelete = (position) => {
    setPositionToDelete(position);
    setShowDeleteModal(true);
  };

  const confirmDeletePosition = async () => {
    if (!positionToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'positions', positionToDelete.id));
      setPositions(prev => prev.filter(pos => pos.id !== positionToDelete.id));
      setShowDeleteModal(false);
      setPositionToDelete(null);
      alert('Position deleted successfully!');
    } catch (err) {
      console.error('Error deleting position:', err);
      alert('Failed to delete position');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingPosition(null);
    setNewPosition({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryRange: '',
      level: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading positions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Position Management</h2>
            <p className="text-gray-600 mt-1">Manage job positions and their requirements</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Position
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
              {editingPosition ? 'Edit Position' : 'Add New Position'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newPosition.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter position title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={newPosition.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  name="level"
                  value={newPosition.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={newPosition.salaryRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $50,000 - $75,000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPosition.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter position description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={newPosition.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job requirements"
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
                {editingPosition ? 'Update Position' : 'Add Position'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Positions List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{position.title}</div>
                      <div className="text-sm text-gray-500">{position.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      position.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                      position.level === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                      position.level === 'Entry-level' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {position.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.salaryRange}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(position)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                          onClick={() => handleDelete(position)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{positions.length}</div>
            <div className="text-sm text-gray-600">Total Positions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {positions.reduce((sum, pos) => sum + pos.employeeCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {positions.filter(pos => pos.level === 'Senior').length}
            </div>
            <div className="text-sm text-gray-600">Senior Positions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {positions.filter(pos => pos.level === 'Entry-level').length}
            </div>
            <div className="text-sm text-gray-600">Entry-level Positions</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPositionToDelete(null);
        }}
        onConfirm={confirmDeletePosition}
        title="Delete Position"
        message="Are you sure you want to delete this position? This will affect all employees with this position."
        itemName={positionToDelete?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}