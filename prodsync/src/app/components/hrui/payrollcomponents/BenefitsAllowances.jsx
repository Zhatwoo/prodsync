'use client';

import { useState, useEffect } from 'react';

export default function BenefitsAllowances() {
  const [benefits, setBenefits] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    type: '',
    category: '',
    amount: '',
    frequency: '',
    description: '',
    isTaxable: false,
    isMandatory: false
  });

  // Sample benefits data
  useEffect(() => {
    const sampleBenefits = [
      {
        id: 1,
        name: 'Health Insurance',
        type: 'Insurance',
        category: 'Health',
        amount: 500,
        frequency: 'Monthly',
        description: 'Comprehensive health insurance coverage',
        isTaxable: false,
        isMandatory: true,
        employeeCount: 25,
        status: 'Active'
      },
      {
        id: 2,
        name: 'Transportation Allowance',
        type: 'Allowance',
        category: 'Transportation',
        amount: 200,
        frequency: 'Monthly',
        description: 'Monthly transportation allowance',
        isTaxable: true,
        isMandatory: false,
        employeeCount: 20,
        status: 'Active'
      },
      {
        id: 3,
        name: 'Meal Allowance',
        type: 'Allowance',
        category: 'Food',
        amount: 150,
        frequency: 'Monthly',
        description: 'Monthly meal allowance',
        isTaxable: true,
        isMandatory: false,
        employeeCount: 18,
        status: 'Active'
      },
      {
        id: 4,
        name: 'Dental Insurance',
        type: 'Insurance',
        category: 'Health',
        amount: 50,
        frequency: 'Monthly',
        description: 'Dental insurance coverage',
        isTaxable: false,
        isMandatory: false,
        employeeCount: 15,
        status: 'Active'
      },
      {
        id: 5,
        name: 'Life Insurance',
        type: 'Insurance',
        category: 'Life',
        amount: 100,
        frequency: 'Monthly',
        description: 'Life insurance coverage',
        isTaxable: false,
        isMandatory: true,
        employeeCount: 25,
        status: 'Active'
      },
      {
        id: 6,
        name: 'Performance Bonus',
        type: 'Bonus',
        category: 'Performance',
        amount: 2000,
        frequency: 'Quarterly',
        description: 'Quarterly performance bonus',
        isTaxable: true,
        isMandatory: false,
        employeeCount: 12,
        status: 'Active'
      },
      {
        id: 7,
        name: 'Retirement Plan',
        type: 'Retirement',
        category: 'Retirement',
        amount: 300,
        frequency: 'Monthly',
        description: 'Company retirement plan contribution',
        isTaxable: false,
        isMandatory: true,
        employeeCount: 25,
        status: 'Active'
      },
      {
        id: 8,
        name: 'Phone Allowance',
        type: 'Allowance',
        category: 'Communication',
        amount: 80,
        frequency: 'Monthly',
        description: 'Monthly phone allowance',
        isTaxable: true,
        isMandatory: false,
        employeeCount: 10,
        status: 'Active'
      }
    ];
    setBenefits(sampleBenefits);
  }, []);

  const benefitTypes = ['Insurance', 'Allowance', 'Bonus', 'Retirement', 'Other'];
  const categories = ['Health', 'Transportation', 'Food', 'Life', 'Performance', 'Retirement', 'Communication', 'Other'];
  const frequencies = ['Monthly', 'Quarterly', 'Annually', 'One-time'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBenefit(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBenefit) {
      // Update existing benefit
      setBenefits(prev => prev.map(benefit => 
        benefit.id === editingBenefit.id 
          ? { ...benefit, ...newBenefit, amount: parseFloat(newBenefit.amount) }
          : benefit
      ));
      setEditingBenefit(null);
    } else {
      // Add new benefit
      const benefit = {
        id: benefits.length + 1,
        ...newBenefit,
        amount: parseFloat(newBenefit.amount),
        employeeCount: 0,
        status: 'Active'
      };
      setBenefits(prev => [...prev, benefit]);
    }
    
    setNewBenefit({
      name: '',
      type: '',
      category: '',
      amount: '',
      frequency: '',
      description: '',
      isTaxable: false,
      isMandatory: false
    });
    setIsAddingNew(false);
  };

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit);
    setNewBenefit({
      name: benefit.name,
      type: benefit.type,
      category: benefit.category,
      amount: benefit.amount.toString(),
      frequency: benefit.frequency,
      description: benefit.description,
      isTaxable: benefit.isTaxable,
      isMandatory: benefit.isMandatory
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this benefit?')) {
      setBenefits(prev => prev.filter(benefit => benefit.id !== id));
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingBenefit(null);
    setNewBenefit({
      name: '',
      type: '',
      category: '',
      amount: '',
      frequency: '',
      description: '',
      isTaxable: false,
      isMandatory: false
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Insurance': return 'bg-blue-100 text-blue-800';
      case 'Allowance': return 'bg-green-100 text-green-800';
      case 'Bonus': return 'bg-purple-100 text-purple-800';
      case 'Retirement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Benefits & Allowances</h2>
            <p className="text-gray-600 mt-1">Manage employee benefits and allowances</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Add Benefit
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefit Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newBenefit.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter benefit name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="type"
                  value={newBenefit.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Type</option>
                  {benefitTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={newBenefit.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={newBenefit.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                <select
                  name="frequency"
                  value={newBenefit.frequency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Frequency</option>
                  {frequencies.map(frequency => (
                    <option key={frequency} value={frequency}>{frequency}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newBenefit.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter benefit description"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isTaxable"
                      checked={newBenefit.isTaxable}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Taxable</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isMandatory"
                      checked={newBenefit.isMandatory}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mandatory</span>
                  </label>
                </div>
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
                {editingBenefit ? 'Update Benefit' : 'Add Benefit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Benefits List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {benefits.map((benefit) => (
                <tr key={benefit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{benefit.name}</div>
                      <div className="text-sm text-gray-500">{benefit.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(benefit.type)}`}>
                      {benefit.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{benefit.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${benefit.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{benefit.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{benefit.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {benefit.isTaxable && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Taxable
                        </span>
                      )}
                      {benefit.isMandatory && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Mandatory
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(benefit)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(benefit.id)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{benefits.length}</div>
            <div className="text-sm text-gray-600">Total Benefits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {benefits.filter(benefit => benefit.type === 'Insurance').length}
            </div>
            <div className="text-sm text-gray-600">Insurance Plans</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {benefits.filter(benefit => benefit.type === 'Allowance').length}
            </div>
            <div className="text-sm text-gray-600">Allowances</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {benefits.filter(benefit => benefit.isMandatory).length}
            </div>
            <div className="text-sm text-gray-600">Mandatory Benefits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
