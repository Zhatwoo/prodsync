'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import { useCurrency } from '../../../context/CurrencyContext';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function SalaryStructure() {
  const { formatCurrency } = useCurrency();
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [newStructure, setNewStructure] = useState({
    position: '',
    department: '',
    level: '',
    baseSalary: '',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [structureToDelete, setStructureToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch salary structures and employee data from Firebase
  useEffect(() => {
    const fetchSalaryStructures = async () => {
      try {
        setLoading(true);
        
        // Fetch salary structures
        const structuresRef = collection(db, 'salaryStructures');
        const q = query(structuresRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const structuresData = [];
        querySnapshot.forEach((doc) => {
          structuresData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Fetch employees to count how many are in each position
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        const employeeCounts = {};
        employeesSnapshot.forEach((doc) => {
          const employee = doc.data();
          const position = employee.position;
          if (position) {
            employeeCounts[position] = (employeeCounts[position] || 0) + 1;
          }
        });
        
        // Update structures with employee counts
        const updatedStructures = structuresData.map(structure => ({
          ...structure,
          employeeCount: employeeCounts[structure.position] || 0
        }));
        
        setSalaryStructures(updatedStructures);
        setError(null);
      } catch (err) {
        console.error('Error fetching salary structures:', err);
        setError('Failed to load salary structures');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryStructures();
  }, []);

  const [departments, setDepartments] = useState(['IT', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations', 'Customer Service']);
  const levels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  // Fetch departments and positions from Firebase
  useEffect(() => {
    const fetchDepartmentsAndPositions = async () => {
      try {
        // Fetch departments
        const departmentsRef = collection(db, 'departments');
        const departmentsQuery = query(departmentsRef, orderBy('createdAt', 'desc'));
        const departmentsSnapshot = await getDocs(departmentsQuery);
        
        const departmentsData = [];
        departmentsSnapshot.forEach((doc) => {
          departmentsData.push(doc.data().name);
        });
        
        if (departmentsData.length > 0) {
          setDepartments(departmentsData);
        }
        
        // Also fetch positions to show actual positions from employee records
        const positionsRef = collection(db, 'positions');
        const positionsQuery = query(positionsRef, orderBy('createdAt', 'desc'));
        const positionsSnapshot = await getDocs(positionsQuery);
        
        const positionsData = [];
        positionsSnapshot.forEach((doc) => {
          positionsData.push(doc.data().title);
        });
        
        // Update departments to include positions if needed
        if (positionsData.length > 0) {
          const uniquePositions = [...new Set(positionsData)];
          // You could also set positions state here if needed
        }
      } catch (err) {
        console.error('Error fetching departments and positions:', err);
        // Keep default departments if fetch fails
      }
    };

    fetchDepartmentsAndPositions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStructure(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const structureData = {
        ...newStructure,
        baseSalary: parseFloat(newStructure.baseSalary),
        minSalary: parseFloat(newStructure.minSalary),
        maxSalary: parseFloat(newStructure.maxSalary),
        status: 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingStructure) {
        // Update existing structure
        const structureRef = doc(db, 'salaryStructures', editingStructure.id);
        await updateDoc(structureRef, {
          ...structureData,
          updatedAt: serverTimestamp()
        });
        
        setSalaryStructures(prev => prev.map(structure => 
          structure.id === editingStructure.id 
            ? { ...structure, ...structureData }
            : structure
        ));
        setEditingStructure(null);
      } else {
        // Add new structure
        const docRef = await addDoc(collection(db, 'salaryStructures'), structureData);
        const newSalaryStructure = {
          id: docRef.id,
          ...structureData
        };
        setSalaryStructures(prev => [newSalaryStructure, ...prev]);
      }
      
      setNewStructure({
        position: '',
        department: '',
        level: '',
        baseSalary: '',
        minSalary: '',
        maxSalary: '',
        currency: 'USD',
        description: ''
      });
      setIsAddingNew(false);
      alert('Salary structure saved successfully!');
    } catch (err) {
      console.error('Error saving salary structure:', err);
      alert('Failed to save salary structure');
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setNewStructure({
      position: structure.position,
      department: structure.department,
      level: structure.level,
      baseSalary: structure.baseSalary.toString(),
      minSalary: structure.minSalary.toString(),
      maxSalary: structure.maxSalary.toString(),
      currency: structure.currency,
      description: structure.description
    });
    setIsAddingNew(true);
  };

  const handleDelete = (structure) => {
    setStructureToDelete(structure);
    setShowDeleteModal(true);
  };

  const confirmDeleteStructure = async () => {
    if (!structureToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'salaryStructures', structureToDelete.id));
      setSalaryStructures(prev => prev.filter(structure => structure.id !== structureToDelete.id));
      setShowDeleteModal(false);
      setStructureToDelete(null);
      alert('Salary structure deleted successfully!');
    } catch (err) {
      console.error('Error deleting salary structure:', err);
      alert('Failed to delete salary structure');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingStructure(null);
    setNewStructure({
      position: '',
      department: '',
      level: '',
      baseSalary: '',
      minSalary: '',
      maxSalary: '',
      currency: 'USD',
      description: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading salary structures...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Salary Structure</h2>
            <p className="text-gray-600 mt-1">Manage salary ranges and compensation structures</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Add Structure
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingStructure ? 'Edit Salary Structure' : 'Add New Salary Structure'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={newStructure.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter position title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={newStructure.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  name="level"
                  value={newStructure.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={newStructure.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary *</label>
                <input
                  type="number"
                  name="baseSalary"
                  value={newStructure.baseSalary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter base salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary *</label>
                <input
                  type="number"
                  name="minSalary"
                  value={newStructure.minSalary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter minimum salary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary *</label>
                <input
                  type="number"
                  name="maxSalary"
                  value={newStructure.maxSalary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter maximum salary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newStructure.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter position description"
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {editingStructure ? 'Update Structure' : 'Add Structure'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Salary Structures List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryStructures.map((structure) => (
                <tr key={structure.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{structure.position}</div>
                      <div className="text-sm text-gray-500">{structure.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{structure.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      structure.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                      structure.level === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                      structure.level === 'Entry-level' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {structure.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(structure.baseSalary)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(structure.minSalary)} - {formatCurrency(structure.maxSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{structure.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {structure.updatedAt?.toDate ? 
                        structure.updatedAt.toDate().toLocaleDateString() + ' ' + structure.updatedAt.toDate().toLocaleTimeString() :
                        structure.createdAt?.toDate ? 
                        structure.createdAt.toDate().toLocaleDateString() + ' ' + structure.createdAt.toDate().toLocaleTimeString() :
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(structure)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(structure)}
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
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{salaryStructures.length}</div>
            <div className="text-sm text-gray-600">Total Structures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {salaryStructures.reduce((sum, structure) => sum + structure.employeeCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {salaryStructures.filter(structure => structure.level === 'Senior').length}
            </div>
            <div className="text-sm text-gray-600">Senior Positions</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStructureToDelete(null);
        }}
        onConfirm={confirmDeleteStructure}
        title="Delete Salary Structure"
        message="Are you sure you want to delete this salary structure? This action cannot be undone."
        itemName={structureToDelete?.position}
        isLoading={isDeleting}
      />
    </div>
  );
}
