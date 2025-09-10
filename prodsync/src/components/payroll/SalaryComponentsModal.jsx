'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const SalaryComponentsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [components, setComponents] = useState({
    basic: {
      name: 'Basic Salary',
      description: 'Base salary component',
      isActive: true,
      isTaxable: true,
      calculationType: 'fixed',
      value: 0
    },
    allowances: [
      {
        id: 'housing',
        name: 'Housing Allowance',
        description: 'Monthly housing allowance',
        isActive: true,
        isTaxable: true,
        calculationType: 'fixed',
        value: 0
      },
      {
        id: 'transport',
        name: 'Transport Allowance',
        description: 'Monthly transport allowance',
        isActive: true,
        isTaxable: false,
        calculationType: 'fixed',
        value: 0
      },
      {
        id: 'meal',
        name: 'Meal Allowance',
        description: 'Monthly meal allowance',
        isActive: true,
        isTaxable: false,
        calculationType: 'fixed',
        value: 0
      }
    ],
    deductions: [
      {
        id: 'tax',
        name: 'Income Tax',
        description: 'Federal income tax deduction',
        isActive: true,
        calculationType: 'percentage',
        value: 0,
        percentage: 15
      },
      {
        id: 'insurance',
        name: 'Health Insurance',
        description: 'Employee health insurance contribution',
        isActive: true,
        calculationType: 'fixed',
        value: 0
      },
      {
        id: 'retirement',
        name: 'Retirement Contribution',
        description: '401(k) retirement contribution',
        isActive: true,
        calculationType: 'percentage',
        value: 0,
        percentage: 5
      }
    ]
  });

  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    isActive: true,
    isTaxable: true,
    calculationType: 'fixed',
    value: 0,
    percentage: 0
  });

  const [errors, setErrors] = useState({});

  const tabs = [
    { id: 'basic', label: 'Basic Salary', icon: '💰' },
    { id: 'allowances', label: 'Allowances', icon: '➕' },
    { id: 'deductions', label: 'Deductions', icon: '➖' }
  ];

  const calculationTypes = [
    { value: 'fixed', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage of Basic' },
    { value: 'formula', label: 'Custom Formula' }
  ];

  const handleBasicSalaryChange = (field, value) => {
    setComponents(prev => ({
      ...prev,
      basic: {
        ...prev.basic,
        [field]: value
      }
    }));
  };

  const handleComponentChange = (type, id, field, value) => {
    setComponents(prev => ({
      ...prev,
      [type]: prev[type].map(comp => 
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const handleAddComponent = (type) => {
    if (!newComponent.name.trim()) {
      setErrors({ name: 'Component name is required' });
      return;
    }

    const component = {
      id: newComponent.name.toLowerCase().replace(/\s+/g, '_'),
      ...newComponent,
      value: parseFloat(newComponent.value) || 0,
      percentage: parseFloat(newComponent.percentage) || 0
    };

    setComponents(prev => ({
      ...prev,
      [type]: [...prev[type], component]
    }));

    setNewComponent({
      name: '',
      description: '',
      isActive: true,
      isTaxable: true,
      calculationType: 'fixed',
      value: 0,
      percentage: 0
    });
    setErrors({});
  };

  const handleRemoveComponent = (type, id) => {
    setComponents(prev => ({
      ...prev,
      [type]: prev[type].filter(comp => comp.id !== id)
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving salary components:', components);
    alert('Salary components saved successfully!');
    onClose();
  };

  const renderBasicSalary = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Salary Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Component Name"
            value={components.basic.name}
            onChange={(e) => handleBasicSalaryChange('name', e.target.value)}
            placeholder="e.g., Basic Salary"
          />
          
          <Input
            label="Description"
            value={components.basic.description}
            onChange={(e) => handleBasicSalaryChange('description', e.target.value)}
            placeholder="Brief description of this component"
          />
          
          <Select
            label="Calculation Type"
            options={calculationTypes}
            value={components.basic.calculationType}
            onChange={(value) => handleBasicSalaryChange('calculationType', value)}
          />
          
          <Input
            label="Default Value"
            type="number"
            value={components.basic.value}
            onChange={(e) => handleBasicSalaryChange('value', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={components.basic.isActive}
              onChange={(e) => handleBasicSalaryChange('isActive', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <span className="ml-2 text-sm text-slate-700">Active</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={components.basic.isTaxable}
              onChange={(e) => handleBasicSalaryChange('isTaxable', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <span className="ml-2 text-sm text-slate-700">Taxable</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderComponents = (type, title) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewComponent({
            name: '',
            description: '',
            isActive: true,
            isTaxable: type === 'allowances',
            calculationType: 'fixed',
            value: 0,
            percentage: 0
          })}
        >
          Add {type === 'allowances' ? 'Allowance' : 'Deduction'}
        </Button>
      </div>

      {/* Existing Components */}
      <div className="space-y-4">
        {components[type].map((component) => (
          <div key={component.id} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">{component.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveComponent(type, component.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={component.name}
                onChange={(e) => handleComponentChange(type, component.id, 'name', e.target.value)}
              />
              
              <Input
                label="Description"
                value={component.description}
                onChange={(e) => handleComponentChange(type, component.id, 'description', e.target.value)}
              />
              
              <Select
                label="Calculation Type"
                options={calculationTypes}
                value={component.calculationType}
                onChange={(value) => handleComponentChange(type, component.id, 'calculationType', value)}
              />
              
              {component.calculationType === 'fixed' ? (
                <Input
                  label="Amount"
                  type="number"
                  value={component.value}
                  onChange={(e) => handleComponentChange(type, component.id, 'value', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              ) : (
                <Input
                  label="Percentage"
                  type="number"
                  value={component.percentage}
                  onChange={(e) => handleComponentChange(type, component.id, 'percentage', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              )}
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.isActive}
                  onChange={(e) => handleComponentChange(type, component.id, 'isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="ml-2 text-sm text-slate-700">Active</span>
              </label>
              
              {type === 'allowances' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.isTaxable}
                    onChange={(e) => handleComponentChange(type, component.id, 'isTaxable', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-700">Taxable</span>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Component Form */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-slate-900 mb-4">Add New {type === 'allowances' ? 'Allowance' : 'Deduction'}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={newComponent.name}
            onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            placeholder={`Enter ${type === 'allowances' ? 'allowance' : 'deduction'} name`}
          />
          
          <Input
            label="Description"
            value={newComponent.description}
            onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description"
          />
          
          <Select
            label="Calculation Type"
            options={calculationTypes}
            value={newComponent.calculationType}
            onChange={(value) => setNewComponent(prev => ({ ...prev, calculationType: value }))}
          />
          
          {newComponent.calculationType === 'fixed' ? (
            <Input
              label="Amount"
              type="number"
              value={newComponent.value}
              onChange={(e) => setNewComponent(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          ) : (
            <Input
              label="Percentage"
              type="number"
              value={newComponent.percentage}
              onChange={(e) => setNewComponent(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
            />
          )}
        </div>
        
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newComponent.isActive}
              onChange={(e) => setNewComponent(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <span className="ml-2 text-sm text-slate-700">Active</span>
          </label>
          
          {type === 'allowances' && (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newComponent.isTaxable}
                onChange={(e) => setNewComponent(prev => ({ ...prev, isTaxable: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="ml-2 text-sm text-slate-700">Taxable</span>
            </label>
          )}
        </div>
        
        <div className="mt-4">
          <Button
            onClick={() => handleAddComponent(type)}
            size="sm"
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Add {type === 'allowances' ? 'Allowance' : 'Deduction'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader>
        <h2 className="text-lg font-semibold text-slate-900">Salary Components Configuration</h2>
      </ModalHeader>
      
      <ModalBody>
        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'basic' && renderBasicSalary()}
        {activeTab === 'allowances' && renderComponents('allowances', 'Allowances')}
        {activeTab === 'deductions' && renderComponents('deductions', 'Deductions')}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Configuration
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SalaryComponentsModal;
