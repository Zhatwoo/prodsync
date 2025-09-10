'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const PayRunModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    payPeriod: '',
    payDate: '',
    payType: 'monthly',
    description: '',
    includeBonuses: false,
    includeOvertime: false,
    includeCommissions: false
  });

  const [errors, setErrors] = useState({});

  const payTypes = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'special', label: 'Special Pay Run' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.payPeriod) {
      newErrors.payPeriod = 'Pay period is required';
    }

    if (!formData.payDate) {
      newErrors.payDate = 'Pay date is required';
    } else {
      const payDate = new Date(formData.payDate);
      const today = new Date();
      if (payDate < today) {
        newErrors.payDate = 'Pay date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payRunData = {
      id: `PR-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    onCreate(payRunData);
    
    // Reset form
    setFormData({
      payPeriod: '',
      payDate: '',
      payType: 'monthly',
      description: '',
      includeBonuses: false,
      includeOvertime: false,
      includeCommissions: false
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      payPeriod: '',
      payDate: '',
      payType: 'monthly',
      description: '',
      includeBonuses: false,
      includeOvertime: false,
      includeCommissions: false
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalHeader>
        <h2 className="text-lg font-semibold text-slate-900">Create New Pay Run</h2>
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Pay Period */}
            <div>
              <Input
                label="Pay Period"
                placeholder="e.g., January 2024, Q1 2024"
                value={formData.payPeriod}
                onChange={(e) => handleInputChange('payPeriod', e.target.value)}
                error={errors.payPeriod}
                required
                helperText="Enter the period this payroll covers"
              />
            </div>

            {/* Pay Date */}
            <div>
              <Input
                label="Pay Date"
                type="date"
                value={formData.payDate}
                onChange={(e) => handleInputChange('payDate', e.target.value)}
                error={errors.payDate}
                required
                helperText="Date when employees will receive their pay"
              />
            </div>

            {/* Pay Type */}
            <div>
              <Select
                label="Pay Type"
                options={payTypes}
                value={formData.payType}
                onChange={(value) => handleInputChange('payType', value)}
                placeholder="Select pay type"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add any notes or special instructions for this pay run..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Additional Components */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Include Additional Components
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeBonuses}
                    onChange={(e) => handleInputChange('includeBonuses', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-700">Bonuses</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeOvertime}
                    onChange={(e) => handleInputChange('includeOvertime', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-700">Overtime</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeCommissions}
                    onChange={(e) => handleInputChange('includeCommissions', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-700">Commissions</span>
                </label>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Create Pay Run
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default PayRunModal;
