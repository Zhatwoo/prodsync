'use client';

import { useState, useEffect } from 'react';

export default function TaxManagement() {
  const [taxSettings, setTaxSettings] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [newTax, setNewTax] = useState({
    name: '',
    type: '',
    jurisdiction: '',
    rate: '',
    calculationType: '',
    description: '',
    isActive: true
  });

  // Sample tax settings data
  useEffect(() => {
    const sampleTaxSettings = [
      {
        id: 1,
        name: 'Federal Income Tax',
        type: 'Income Tax',
        jurisdiction: 'Federal',
        rate: 22,
        calculationType: 'Progressive',
        description: 'Federal income tax based on progressive brackets',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 2,
        name: 'Social Security Tax',
        type: 'Social Security',
        jurisdiction: 'Federal',
        rate: 6.2,
        calculationType: 'Fixed Percentage',
        description: 'Social Security tax on wages up to wage base',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 3,
        name: 'Medicare Tax',
        type: 'Medicare',
        jurisdiction: 'Federal',
        rate: 1.45,
        calculationType: 'Fixed Percentage',
        description: 'Medicare tax on all wages',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 4,
        name: 'State Income Tax',
        type: 'Income Tax',
        jurisdiction: 'State',
        rate: 5.5,
        calculationType: 'Fixed Percentage',
        description: 'State income tax',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 5,
        name: 'Local Income Tax',
        type: 'Income Tax',
        jurisdiction: 'Local',
        rate: 2.0,
        calculationType: 'Fixed Percentage',
        description: 'Local municipality income tax',
        isActive: true,
        employeeCount: 20,
        lastUpdated: '2024-01-01'
      },
      {
        id: 6,
        name: 'Unemployment Tax',
        type: 'Unemployment',
        jurisdiction: 'Federal',
        rate: 0.6,
        calculationType: 'Fixed Percentage',
        description: 'Federal unemployment tax (FUTA)',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 7,
        name: 'State Unemployment Tax',
        type: 'Unemployment',
        jurisdiction: 'State',
        rate: 2.7,
        calculationType: 'Fixed Percentage',
        description: 'State unemployment tax (SUTA)',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      },
      {
        id: 8,
        name: 'Workers Compensation',
        type: 'Workers Comp',
        jurisdiction: 'State',
        rate: 1.2,
        calculationType: 'Fixed Percentage',
        description: 'Workers compensation insurance',
        isActive: true,
        employeeCount: 25,
        lastUpdated: '2024-01-01'
      }
    ];
    setTaxSettings(sampleTaxSettings);
  }, []);

  const taxTypes = ['Income Tax', 'Social Security', 'Medicare', 'Unemployment', 'Workers Comp', 'Other'];
  const jurisdictions = ['Federal', 'State', 'Local'];
  const calculationTypes = ['Fixed Percentage', 'Progressive', 'Fixed Amount'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTax(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTax) {
      // Update existing tax setting
      setTaxSettings(prev => prev.map(tax => 
        tax.id === editingTax.id 
          ? { ...tax, ...newTax, rate: parseFloat(newTax.rate) }
          : tax
      ));
      setEditingTax(null);
    } else {
      // Add new tax setting
      const tax = {
        id: taxSettings.length + 1,
        ...newTax,
        rate: parseFloat(newTax.rate),
        employeeCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setTaxSettings(prev => [...prev, tax]);
    }
    
    setNewTax({
      name: '',
      type: '',
      jurisdiction: '',
      rate: '',
      calculationType: '',
      description: '',
      isActive: true
    });
    setIsAddingNew(false);
  };

  const handleEdit = (tax) => {
    setEditingTax(tax);
    setNewTax({
      name: tax.name,
      type: tax.type,
      jurisdiction: tax.jurisdiction,
      rate: tax.rate.toString(),
      calculationType: tax.calculationType,
      description: tax.description,
      isActive: tax.isActive
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this tax setting?')) {
      setTaxSettings(prev => prev.filter(tax => tax.id !== id));
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingTax(null);
    setNewTax({
      name: '',
      type: '',
      jurisdiction: '',
      rate: '',
      calculationType: '',
      description: '',
      isActive: true
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tax Management</h2>
            <p className="text-gray-600 mt-1">Manage tax settings and calculations</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Add Tax Setting
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingTax ? 'Edit Tax Setting' : 'Add New Tax Setting'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newTax.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter tax name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type *</label>
                <select
                  name="type"
                  value={newTax.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Tax Type</option>
                  {taxTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction *</label>
                <select
                  name="jurisdiction"
                  value={newTax.jurisdiction}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Jurisdiction</option>
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%) *</label>
                <input
                  type="number"
                  name="rate"
                  value={newTax.rate}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter tax rate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type *</label>
                <select
                  name="calculationType"
                  value={newTax.calculationType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Calculation Type</option>
                  {calculationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newTax.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter tax description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newTax.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
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
                {editingTax ? 'Update Tax Setting' : 'Add Tax Setting'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tax Settings List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxSettings.map((tax) => (
                <tr key={tax.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tax.name}</div>
                      <div className="text-sm text-gray-500">{tax.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(tax.type)}`}>
                      {tax.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJurisdictionColor(tax.jurisdiction)}`}>
                      {tax.jurisdiction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tax.rate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tax.calculationType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tax.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tax.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(tax)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(tax.id)}
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
            <div className="text-2xl font-bold text-red-600">{taxSettings.length}</div>
            <div className="text-sm text-gray-600">Total Tax Settings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
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
    </div>
  );
}
