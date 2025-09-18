'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function Deductions() {
  const [deductions, setDeductions] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deductionToDelete, setDeductionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newDeduction, setNewDeduction] = useState({
    name: '',
    type: '',
    category: '',
    amount: '',
    calculationType: '',
    description: '',
    isMandatory: false,
    isPercentage: false
  });

  // Fetch deductions and employee data from Firebase
  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        setLoading(true);
        
        // Fetch deductions
        const deductionsRef = collection(db, 'deductions');
        const q = query(deductionsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const deductionsData = [];
        querySnapshot.forEach((doc) => {
          deductionsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Fetch employees to count how many are affected by deductions
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        const activeEmployeeCount = employeesSnapshot.size;
        
        // Update deductions with employee counts (assuming all active employees are subject to deductions)
        const updatedDeductions = deductionsData.map(deduction => ({
          ...deduction,
          employeeCount: activeEmployeeCount
        }));
        
        setDeductions(updatedDeductions);
        setError(null);
      } catch (err) {
        console.error('Error fetching deductions:', err);
        setError('Failed to load deductions');
      } finally {
        setLoading(false);
      }
    };

    fetchDeductions();
  }, []);

  const deductionTypes = ['Tax', 'Insurance', 'Retirement', 'Union', 'Loan', 'Other'];
  const categories = ['Government', 'Health', 'Retirement', 'Union', 'Loan', 'Transportation', 'Other'];
  const calculationTypes = ['Fixed', 'Percentage'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDeduction(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deductionData = {
        ...newDeduction,
        amount: parseFloat(newDeduction.amount) || 0,
        percentage: parseFloat(newDeduction.percentage) || 0,
        status: 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

    if (editingDeduction) {
      // Update existing deduction
        const deductionRef = doc(db, 'deductions', editingDeduction.id);
        await updateDoc(deductionRef, {
          ...deductionData,
          updatedAt: serverTimestamp()
        });
        
      setDeductions(prev => prev.map(deduction => 
        deduction.id === editingDeduction.id 
            ? { ...deduction, ...deductionData }
          : deduction
      ));
      setEditingDeduction(null);
    } else {
      // Add new deduction
        const docRef = await addDoc(collection(db, 'deductions'), deductionData);
        const newDeductionItem = {
          id: docRef.id,
          ...deductionData
        };
        setDeductions(prev => [newDeductionItem, ...prev]);
    }
    
    setNewDeduction({
      name: '',
      type: '',
      category: '',
      amount: '',
      calculationType: '',
      description: '',
      isMandatory: false,
      isPercentage: false
    });
    setIsAddingNew(false);
      alert('Deduction saved successfully!');
    } catch (err) {
      console.error('Error saving deduction:', err);
      alert('Failed to save deduction');
    }
  };

  const handleEdit = (deduction) => {
    setEditingDeduction(deduction);
    setNewDeduction({
      name: deduction.name,
      type: deduction.type,
      category: deduction.category,
      amount: deduction.amount.toString(),
      calculationType: deduction.calculationType,
      description: deduction.description,
      isMandatory: deduction.isMandatory,
      isPercentage: deduction.isPercentage,
      percentage: deduction.percentage?.toString() || ''
    });
    setIsAddingNew(true);
  };

  const handleDelete = (deduction) => {
    setDeductionToDelete(deduction);
    setShowDeleteModal(true);
  };

  const confirmDeleteDeduction = async () => {
    if (!deductionToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'deductions', deductionToDelete.id));
      setDeductions(prev => prev.filter(deduction => deduction.id !== deductionToDelete.id));
      setShowDeleteModal(false);
      setDeductionToDelete(null);
      alert('Deduction deleted successfully!');
    } catch (err) {
      console.error('Error deleting deduction:', err);
      alert('Failed to delete deduction');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingDeduction(null);
    setNewDeduction({
      name: '',
      type: '',
      category: '',
      amount: '',
      calculationType: '',
      description: '',
      isMandatory: false,
      isPercentage: false
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Tax': return 'bg-red-100 text-red-800';
      case 'Insurance': return 'bg-blue-100 text-blue-800';
      case 'Retirement': return 'bg-yellow-100 text-yellow-800';
      case 'Union': return 'bg-purple-100 text-purple-800';
      case 'Loan': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading deductions...</div>
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
            <h2 className="text-2xl font-bold text-gray-900">Deductions</h2>
            <p className="text-gray-600 mt-1">Manage payroll deductions and withholdings</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Add Deduction
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingDeduction ? 'Edit Deduction' : 'Add New Deduction'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deduction Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newDeduction.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter deduction name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="type"
                  value={newDeduction.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Type</option>
                  {deductionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={newDeduction.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type *</label>
                <select
                  name="calculationType"
                  value={newDeduction.calculationType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Calculation Type</option>
                  {calculationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {newDeduction.calculationType === 'Fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={newDeduction.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter fixed amount"
                  />
                </div>
              )}
              {newDeduction.calculationType === 'Percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentage *</label>
                  <input
                    type="number"
                    name="percentage"
                    value={newDeduction.percentage}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter percentage"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newDeduction.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter deduction description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isMandatory"
                    checked={newDeduction.isMandatory}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mandatory Deduction</span>
                </label>
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
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {editingDeduction ? 'Update Deduction' : 'Add Deduction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deductions List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount/Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deductions.map((deduction) => (
                <tr key={deduction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deduction.name}</div>
                      <div className="text-sm text-gray-500">{deduction.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(deduction.type)}`}>
                      {deduction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deduction.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {deduction.calculationType === 'Fixed' 
                        ? `$${deduction.amount.toLocaleString()}` 
                        : `${deduction.percentage}%`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deduction.calculationType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deduction.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deduction.isMandatory && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Mandatory
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {deduction.updatedAt?.toDate ? 
                        deduction.updatedAt.toDate().toLocaleDateString() + ' ' + deduction.updatedAt.toDate().toLocaleTimeString() :
                        deduction.createdAt?.toDate ? 
                        deduction.createdAt.toDate().toLocaleDateString() + ' ' + deduction.createdAt.toDate().toLocaleTimeString() :
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(deduction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(deduction)}
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
      <div className="mt-6 bg-red-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">{deductions.length}</div>
            <div className="text-sm text-gray-600">Total Deductions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {deductions.filter(deduction => deduction.type === 'Tax').length}
            </div>
            <div className="text-sm text-gray-600">Tax Deductions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {deductions.filter(deduction => deduction.isMandatory).length}
            </div>
            <div className="text-sm text-gray-600">Mandatory</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {deductions.filter(deduction => deduction.calculationType === 'Percentage').length}
            </div>
            <div className="text-sm text-gray-600">Percentage Based</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeductionToDelete(null);
        }}
        onConfirm={confirmDeleteDeduction}
        title="Delete Deduction"
        message="Are you sure you want to delete this deduction? This action cannot be undone."
        itemName={deductionToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
