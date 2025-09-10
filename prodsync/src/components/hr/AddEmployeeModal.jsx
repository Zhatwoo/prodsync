'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    role: '',
    department: '',
    hire_date: '',
    status: 'active',
    email: '',
    phone: '',
    manager: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Department options
  const departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Product', label: 'Product' },
    { value: 'Design', label: 'Design' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' }
  ];

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'employee_id':
        if (!value.trim()) {
          newErrors.employee_id = 'Employee ID is required';
        } else if (!/^[A-Z0-9]+$/.test(value.trim())) {
          newErrors.employee_id = 'Employee ID must contain only uppercase letters and numbers';
        } else {
          delete newErrors.employee_id;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'role':
        if (!value.trim()) {
          newErrors.role = 'Role is required';
        } else if (value.trim().length < 2) {
          newErrors.role = 'Role must be at least 2 characters';
        } else {
          delete newErrors.role;
        }
        break;

      case 'department':
        if (!value) {
          newErrors.department = 'Department is required';
        } else {
          delete newErrors.department;
        }
        break;

      case 'hire_date':
        if (!value) {
          newErrors.hire_date = 'Hire date is required';
        } else {
          const date = new Date(value);
          const today = new Date();
          if (isNaN(date.getTime())) {
            newErrors.hire_date = 'Please enter a valid date';
          } else if (date > today) {
            newErrors.hire_date = 'Hire date cannot be in the future';
          } else {
            delete newErrors.hire_date;
          }
        }
        break;

      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'manager':
        if (value && value.trim().length < 2) {
          newErrors.manager = 'Manager name must be at least 2 characters';
        } else {
          delete newErrors.manager;
        }
        break;

      case 'location':
        if (value && value.trim().length < 2) {
          newErrors.location = 'Location must be at least 2 characters';
        } else {
          delete newErrors.location;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field on change
    validateField(name, value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const fieldNames = Object.keys(formData);
    fieldNames.forEach(fieldName => {
      validateField(fieldName, formData[fieldName]);
    });

    // Check if there are any errors
    const hasErrors = fieldNames.some(fieldName => {
      validateField(fieldName, formData[fieldName]);
      return errors[fieldName];
    });

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add employee
      onAdd(formData);
      
      // Reset form
      setFormData({
        name: '',
        employee_id: '',
        role: '',
        department: '',
        hire_date: '',
        status: 'active',
        email: '',
        phone: '',
        manager: '',
        location: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      name: '',
      employee_id: '',
      role: '',
      department: '',
      hire_date: '',
      status: 'active',
      email: '',
      phone: '',
      manager: '',
      location: ''
    });
    setErrors({});
    onClose();
  };

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && 
    formData.name && 
    formData.employee_id && 
    formData.email && 
    formData.role && 
    formData.department && 
    formData.hire_date;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title="Add New Employee"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                  placeholder="Enter full name"
                />
                <Input
                  label="Employee ID"
                  value={formData.employee_id}
                  onChange={(e) => handleInputChange('employee_id', e.target.value.toUpperCase())}
                  error={errors.employee_id}
                  required
                  placeholder="EMP001"
                  helperText="Use uppercase letters and numbers only"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                  placeholder="employee@company.com"
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="+1 (555) 123-4567"
                  helperText="Optional"
                />
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Job Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  error={errors.role}
                  required
                  placeholder="Software Engineer"
                />
                <Select
                  label="Department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors.department}
                  required
                  placeholder="Select department"
                />
                <Input
                  label="Hire Date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                  error={errors.hire_date}
                  required
                />
                <Select
                  label="Employment Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  placeholder="Select status"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Manager"
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                  error={errors.manager}
                  placeholder="Manager's name"
                  helperText="Optional"
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  error={errors.location}
                  placeholder="City, State"
                  helperText="Optional"
                />
              </div>
            </div>

            {/* Form Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-900 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
