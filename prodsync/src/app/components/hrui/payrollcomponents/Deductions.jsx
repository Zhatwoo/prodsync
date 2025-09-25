'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import { useCurrency } from '../../../context/CurrencyContext';
import PermissionGuard from '../../PermissionGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function Deductions() {
  const { formatCurrency } = useCurrency();
  const [deductions, setDeductions] = useState([]);
  const [taxSettings, setTaxSettings] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('deductions');
  
  // Permission checking
  const { can, canPerform, isHR, isAdmin } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    category: '',
    amount: '',
    calculationType: '',
    description: '',
    isMandatory: false,
    isPercentage: false,
    // Tax-specific fields
    jurisdiction: '',
    rate: '',
    isActive: true
  });

  // Fetch deductions, tax settings and employee data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch deductions
        const deductionsRef = collection(db, 'deductions');
        const deductionsQuery = query(deductionsRef, orderBy('createdAt', 'desc'));
        const deductionsSnapshot = await getDocs(deductionsQuery);
        
        const deductionsData = [];
        deductionsSnapshot.forEach((doc) => {
          deductionsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Fetch tax settings
        const taxSettingsRef = collection(db, 'taxSettings');
        const taxSettingsQuery = query(taxSettingsRef, orderBy('createdAt', 'desc'));
        const taxSettingsSnapshot = await getDocs(taxSettingsQuery);
        
        const taxSettingsData = [];
        taxSettingsSnapshot.forEach((doc) => {
          taxSettingsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Fetch employees to count how many are affected
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        const activeEmployeeCount = employeesSnapshot.size;
        
        // Update deductions and tax settings with employee counts
        const updatedDeductions = deductionsData.map(deduction => ({
          ...deduction,
          employeeCount: activeEmployeeCount
        }));
        
        const updatedTaxSettings = taxSettingsData.map(taxSetting => ({
          ...taxSetting,
          employeeCount: activeEmployeeCount
        }));
        
        setDeductions(updatedDeductions);
        setTaxSettings(updatedTaxSettings);
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

  const deductionTypes = ['Tax', 'Insurance', 'Retirement', 'Union', 'Loan', 'Other'];
  const categories = ['Government', 'Health', 'Retirement', 'Union', 'Loan', 'Transportation', 'Other'];
  const calculationTypes = ['Fixed', 'Percentage'];
  
  // Tax-specific options
  const taxTypes = ['Income Tax', 'Social Security', 'Medicare', 'Unemployment', 'Workers Comp', 'Other'];
  const jurisdictions = ['Federal', 'State', 'Local'];
  const taxCalculationTypes = ['Fixed Percentage', 'Progressive', 'Fixed Amount'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'deductions') {
        // Handle deductions
        const deductionData = {
          ...newItem,
          amount: parseFloat(newItem.amount) || 0,
          percentage: parseFloat(newItem.percentage) || 0,
          status: 'Active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        if (editingItem) {
          // Update existing deduction
          const deductionRef = doc(db, 'deductions', editingItem.id);
          await updateDoc(deductionRef, {
            ...deductionData,
            updatedAt: serverTimestamp()
          });
          
          setDeductions(prev => prev.map(deduction => 
            deduction.id === editingItem.id 
              ? { ...deduction, ...deductionData }
              : deduction
          ));
          setEditingItem(null);
        } else {
          // Add new deduction
          const docRef = await addDoc(collection(db, 'deductions'), deductionData);
          const newDeductionItem = {
            id: docRef.id,
            ...deductionData
          };
          setDeductions(prev => [newDeductionItem, ...prev]);
        }
        alert('Deduction saved successfully!');
      } else {
        // Handle tax settings
        const taxData = {
          ...newItem,
          rate: parseFloat(newItem.rate) || 0,
          isActive: newItem.isActive,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        if (editingItem) {
          // Update existing tax setting
          const taxRef = doc(db, 'taxSettings', editingItem.id);
          await updateDoc(taxRef, {
            ...taxData,
            updatedAt: serverTimestamp()
          });
          
          setTaxSettings(prev => prev.map(tax => 
            tax.id === editingItem.id 
              ? { ...tax, ...taxData }
              : tax
          ));
          setEditingItem(null);
        } else {
          // Add new tax setting
          const docRef = await addDoc(collection(db, 'taxSettings'), taxData);
          const newTaxItem = {
            id: docRef.id,
            ...taxData
          };
          setTaxSettings(prev => [newTaxItem, ...prev]);
        }
        alert('Tax setting saved successfully!');
      }
      
      setNewItem({
        name: '',
        type: '',
        category: '',
        amount: '',
        calculationType: '',
        description: '',
        isMandatory: false,
        isPercentage: false,
        jurisdiction: '',
        rate: '',
        isActive: true
      });
      setIsAddingNew(false);
    } catch (err) {
      console.error('Error saving data:', err);
      alert('Failed to save data');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      type: item.type,
      category: item.category,
      amount: item.amount?.toString() || '',
      calculationType: item.calculationType,
      description: item.description,
      isMandatory: item.isMandatory,
      isPercentage: item.isPercentage,
      percentage: item.percentage?.toString() || '',
      // Tax-specific fields
      jurisdiction: item.jurisdiction || '',
      rate: item.rate?.toString() || '',
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsAddingNew(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      if (activeTab === 'deductions') {
        await deleteDoc(doc(db, 'deductions', itemToDelete.id));
        setDeductions(prev => prev.filter(deduction => deduction.id !== itemToDelete.id));
        alert('Deduction deleted successfully!');
      } else {
        await deleteDoc(doc(db, 'taxSettings', itemToDelete.id));
        setTaxSettings(prev => prev.filter(tax => tax.id !== itemToDelete.id));
        alert('Tax setting deleted successfully!');
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingItem(null);
    setNewItem({
      name: '',
      type: '',
      category: '',
      amount: '',
      calculationType: '',
      description: '',
      isMandatory: false,
      isPercentage: false,
      jurisdiction: '',
      rate: '',
      isActive: true
    });
  };

  // Inline editing functions
  const startInlineEdit = (itemId, field, currentValue) => {
    setEditingField(`${itemId}-${field}`);
    setEditingValue(currentValue.toString());
  };

  const cancelInlineEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const saveInlineEdit = async (itemId, field) => {
    if (!editingValue.trim()) {
      alert('Value cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const collectionName = activeTab === 'deductions' ? 'deductions' : 'taxSettings';
      const itemRef = doc(db, collectionName, itemId);
      let updateData = {};

      // Handle different field types
      if (field === 'amount' || field === 'percentage' || field === 'rate') {
        const numericValue = parseFloat(editingValue);
        if (isNaN(numericValue) || numericValue < 0) {
          alert('Please enter a valid positive number');
          setIsSaving(false);
          return;
        }
        updateData[field] = numericValue;
      } else if (field === 'isMandatory' || field === 'isActive') {
        updateData[field] = editingValue === 'true';
      } else {
        updateData[field] = editingValue;
      }

      updateData.updatedAt = serverTimestamp();

      await updateDoc(itemRef, updateData);

      // Update local state
      if (activeTab === 'deductions') {
        setDeductions(prev => prev.map(deduction => 
          deduction.id === itemId 
            ? { ...deduction, ...updateData }
            : deduction
        ));
      } else {
        setTaxSettings(prev => prev.map(tax => 
          tax.id === itemId 
            ? { ...tax, ...updateData }
            : tax
        ));
      }

      setEditingField(null);
      setEditingValue('');
      alert(`${activeTab === 'deductions' ? 'Deduction' : 'Tax setting'} updated successfully!`);
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Tax': return 'bg-red-100 text-red-800';
      case 'Insurance': return 'bg-blue-100 text-blue-800';
      case 'Retirement': return 'bg-yellow-100 text-yellow-800';
      case 'Union': return 'bg-purple-100 text-purple-800';
      case 'Loan': return 'bg-orange-100 text-orange-800';
      // Tax-specific types
      case 'Income Tax': return 'bg-red-100 text-red-800';
      case 'Social Security': return 'bg-blue-100 text-blue-800';
      case 'Medicare': return 'bg-green-100 text-green-800';
      case 'Unemployment': return 'bg-yellow-100 text-yellow-800';
      case 'Workers Comp': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJurisdictionColor = (jurisdiction) => {
    switch (jurisdiction) {
      case 'Federal': return 'bg-red-100 text-red-800';
      case 'State': return 'bg-blue-100 text-blue-800';
      case 'Local': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading data...</div>
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

  const currentData = activeTab === 'deductions' ? deductions : taxSettings;

  return (
    <PermissionGuard permission={PERMISSIONS.PAYROLL_VIEW}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Deductions & Tax Management</h2>
              <p className="text-gray-600 mt-1">Manage payroll deductions, withholdings, and tax settings</p>
            </div>
            {can(PERMISSIONS.PAYROLL_MANAGE) && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Add {activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}
              </button>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('deductions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'deductions'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Deductions
                </button>
                <button
                  onClick={() => setActiveTab('tax')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tax'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tax Settings
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAddingNew && (
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? `Edit ${activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}` : `Add New ${activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                💡 Tip: You can also click on any field in the table below to edit it directly
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'deductions' ? 'Deduction Name *' : 'Tax Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder={activeTab === 'deductions' ? 'Enter deduction name' : 'Enter tax name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    name="type"
                    value={newItem.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select Type</option>
                    {(activeTab === 'deductions' ? deductionTypes : taxTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {activeTab === 'deductions' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={newItem.category}
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
                )}
                {activeTab === 'tax' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction *</label>
                    <select
                      name="jurisdiction"
                      value={newItem.jurisdiction}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select Jurisdiction</option>
                      {jurisdictions.map(jurisdiction => (
                        <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type *</label>
                  <select
                    name="calculationType"
                    value={newItem.calculationType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select Calculation Type</option>
                    {(activeTab === 'deductions' ? calculationTypes : taxCalculationTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {activeTab === 'deductions' && newItem.calculationType === 'Fixed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                    <input
                      type="number"
                      name="amount"
                      value={newItem.amount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter fixed amount"
                    />
                  </div>
                )}
                {activeTab === 'deductions' && newItem.calculationType === 'Percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage *</label>
                    <input
                      type="number"
                      name="percentage"
                      value={newItem.percentage}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter percentage"
                    />
                  </div>
                )}
                {activeTab === 'tax' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%) *</label>
                    <input
                      type="number"
                      name="rate"
                      value={newItem.rate}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter tax rate"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder={activeTab === 'deductions' ? 'Enter deduction description' : 'Enter tax description'}
                  />
                </div>
                <div className="md:col-span-2">
                  {activeTab === 'deductions' ? (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isMandatory"
                        checked={newItem.isMandatory}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mandatory Deduction</span>
                    </label>
                  ) : (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={newItem.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active Tax Setting</span>
                    </label>
                  )}
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
                  {editingItem ? `Update ${activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}` : `Add ${activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'deductions' ? 'Deductions List' : 'Tax Settings List'}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Click on any field to edit directly</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'deductions' ? 'Deduction' : 'Tax Name'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  {activeTab === 'deductions' ? (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  ) : (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'deductions' ? 'Amount/Percentage' : 'Rate'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'deductions' ? 'Properties' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'deductions' ? (
                        <div className="text-sm text-gray-900">{item.category}</div>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJurisdictionColor(item.jurisdiction)}`}>
                          {item.jurisdiction}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeTab === 'deductions' ? (
                          item.calculationType === 'Fixed' 
                            ? formatCurrency(item.amount)
                            : `${item.percentage}%`
                        ) : (
                          `${item.rate}%`
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.calculationType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.employeeCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'deductions' ? (
                        item.isMandatory && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Mandatory
                          </span>
                        )
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.updatedAt?.toDate ? 
                          item.updatedAt.toDate().toLocaleDateString() + ' ' + item.updatedAt.toDate().toLocaleTimeString() :
                          item.createdAt?.toDate ? 
                          item.createdAt.toDate().toLocaleDateString() + ' ' + item.createdAt.toDate().toLocaleTimeString() :
                          'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {can(PERMISSIONS.PAYROLL_MANAGE) && (
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                        {can(PERMISSIONS.PAYROLL_DELETE) && (
                          <button 
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
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

        {/* Tax Summary */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{taxSettings.length}</div>
              <div className="text-sm text-gray-600">Total Tax Settings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {taxSettings.filter(tax => tax.jurisdiction === 'Federal').length}
              </div>
              <div className="text-sm text-gray-600">Federal Taxes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {taxSettings.filter(tax => tax.jurisdiction === 'State').length}
              </div>
              <div className="text-sm text-gray-600">State Taxes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {taxSettings.filter(tax => tax.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Settings</div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={confirmDeleteItem}
          title={`Delete ${activeTab === 'deductions' ? 'Deduction' : 'Tax Setting'}`}
          message={`Are you sure you want to delete this ${activeTab === 'deductions' ? 'deduction' : 'tax setting'}? This action cannot be undone.`}
          itemName={itemToDelete?.name}
          isLoading={isDeleting}
        />
      </div>
    </PermissionGuard>
  );
}