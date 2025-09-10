'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const purposes = [
  { value: 'Business Meeting', label: 'Business Meeting' },
  { value: 'Client Presentation', label: 'Client Presentation' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Vendor Meeting', label: 'Vendor Meeting' },
  { value: 'Security Audit', label: 'Security Audit' },
  { value: 'Training', label: 'Training' },
  { value: 'Delivery', label: 'Delivery' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' }
];

const departments = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'IT', label: 'IT' },
  { value: 'Operations', label: 'Operations' }
];

const hosts = [
  { value: 'Jane Doe', label: 'Jane Doe (Engineering)' },
  { value: 'Mike Wilson', label: 'Mike Wilson (Sales)' },
  { value: 'Lisa Chen', label: 'Lisa Chen (HR)' },
  { value: 'David Lee', label: 'David Lee (Marketing)' },
  { value: 'Jennifer Taylor', label: 'Jennifer Taylor (IT)' },
  { value: 'Robert Smith', label: 'Robert Smith (Finance)' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson (Operations)' }
];

export default function VisitorEntryForm({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    purpose: '',
    host: '',
    host_department: '',
    scheduled_time: '',
    notes: '',
    documents: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.host) {
      newErrors.host = 'Host is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAdd(formData);
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        purpose: '',
        host: '',
        host_department: '',
        scheduled_time: '',
        notes: '',
        documents: []
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding visitor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHostChange = (hostValue) => {
    const selectedHost = hosts.find(h => h.value === hostValue);
    const department = selectedHost ? selectedHost.label.split('(')[1].replace(')', '') : '';
    
    setFormData(prev => ({
      ...prev,
      host: hostValue,
      host_department: department
    }));
    
    if (errors.host) {
      setErrors(prev => ({ ...prev, host: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <h2 className="text-xl font-semibold text-slate-900">New Visitor Entry</h2>
        <p className="text-sm text-slate-600">Add a new visitor to the system</p>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter visitor's full name"
                    error={errors.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company *
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter company name"
                    error={errors.company}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    error={errors.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    error={errors.phone}
                  />
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Visit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Purpose of Visit *
                  </label>
                  <Select
                    options={purposes}
                    value={formData.purpose}
                    onChange={(value) => handleInputChange('purpose', value)}
                    placeholder="Select purpose"
                    error={errors.purpose}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Host *
                  </label>
                  <Select
                    options={hosts}
                    value={formData.host}
                    onChange={handleHostChange}
                    placeholder="Select host"
                    error={errors.host}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Scheduled Time
                  </label>
                  <DatePicker
                    value={formData.scheduled_time}
                    onChange={(value) => handleInputChange('scheduled_time', value)}
                    placeholder="Select scheduled time"
                    showTime={true}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes or special instructions"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              }
            >
              {isSubmitting ? 'Adding Visitor...' : 'Add Visitor'}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
