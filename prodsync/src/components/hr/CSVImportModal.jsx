'use client';

import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn, formatFileSize } from '../../lib/utils';

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Import
  const fileInputRef = useRef(null);

  // Expected CSV headers
  const expectedHeaders = [
    'name',
    'employee_id',
    'role',
    'department',
    'hire_date',
    'status',
    'email',
    'phone',
    'manager',
    'location'
  ];

  // Valid statuses
  const validStatuses = ['active', 'on_leave', 'terminated'];

  // Valid departments
  const validDepartments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance'
  ];

  // Reset modal state
  const resetModal = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setIsProcessing(false);
    setStep(1);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setErrors(['Please select a valid CSV file.']);
        return;
      }
      setFile(selectedFile);
      setErrors([]);
    }
  };

  // Parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row.');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const data = [];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(expected => 
      !headers.includes(expected.toLowerCase())
    );

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      }

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      data.push(row);
    }

    return data;
  };

  // Validate parsed data
  const validateData = (data) => {
    const validationErrors = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because we start from row 2 (after header)

      // Required field validation
      if (!row.name || row.name.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Name is required`);
      }
      if (!row.employee_id || row.employee_id.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Employee ID is required`);
      }
      if (!row.email || row.email.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Email is required`);
      }
      if (!row.role || row.role.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Role is required`);
      }
      if (!row.department || row.department.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Department is required`);
      }
      if (!row.hire_date || row.hire_date.trim() === '') {
        validationErrors.push(`Row ${rowNum}: Hire date is required`);
      }

      // Email validation
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        validationErrors.push(`Row ${rowNum}: Invalid email format`);
      }

      // Status validation
      if (row.status && !validStatuses.includes(row.status.toLowerCase())) {
        validationErrors.push(`Row ${rowNum}: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      // Department validation
      if (row.department && !validDepartments.includes(row.department)) {
        validationErrors.push(`Row ${rowNum}: Invalid department. Must be one of: ${validDepartments.join(', ')}`);
      }

      // Date validation
      if (row.hire_date) {
        const date = new Date(row.hire_date);
        if (isNaN(date.getTime())) {
          validationErrors.push(`Row ${rowNum}: Invalid hire date format. Use YYYY-MM-DD`);
        }
      }
    });

    return validationErrors;
  };

  // Process CSV file
  const processCSV = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      const validationErrors = validateData(parsed);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsProcessing(false);
        return;
      }

      // Transform data to match our employee structure
      const transformedData = parsed.map(row => ({
        name: row.name.trim(),
        employee_id: row.employee_id.trim(),
        role: row.role.trim(),
        department: row.department.trim(),
        hire_date: row.hire_date.trim(),
        status: (row.status || 'active').toLowerCase(),
        email: row.email.trim(),
        phone: row.phone || '',
        manager: row.manager || '',
        location: row.location || '',
        documents: []
      }));

      setParsedData(transformedData);
      setStep(2);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle import
  const handleImport = () => {
    onImport(parsedData);
    resetModal();
    onClose();
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setErrors(['Please select a valid CSV file.']);
        return;
      }
      setFile(droppedFile);
      setErrors([]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title="Import Employees from CSV"
    >
      <ModalBody>
        {step === 1 && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Required headers: {expectedHeaders.join(', ')}</p>
                <p>• Status must be one of: {validStatuses.join(', ')}</p>
                <p>• Department must be one of: {validDepartments.join(', ')}</p>
                <p>• Date format: YYYY-MM-DD (e.g., 2023-01-15)</p>
                <p>• Email must be valid format</p>
              </div>
            </div>

            {/* File Upload */}
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                file ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-slate-400'
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-900">{file.name}</p>
                  <p className="text-sm text-green-700">{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-600">
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:text-blue-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Click to upload
                    </button>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">CSV files only</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Sample CSV */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Sample CSV Format</h3>
              <pre className="text-xs text-slate-600 overflow-x-auto">
{`name,employee_id,role,department,hire_date,status,email,phone,manager,location
John Smith,EMP001,Software Engineer,Engineering,2023-01-15,active,john.smith@company.com,+1 (555) 123-4567,Jane Doe,San Francisco CA
Sarah Johnson,EMP002,Product Manager,Product,2022-08-20,active,sarah.johnson@company.com,+1 (555) 234-5678,Mike Wilson,New York NY`}
              </pre>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">
                Preview Import ({parsedData.length} employees)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
              >
                Back to Upload
              </Button>
            </div>

            {/* Preview Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {parsedData.slice(0, 10).map((employee, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-slate-900">{employee.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{employee.employee_id}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{employee.role}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{employee.department}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            employee.status === 'active' ? 'bg-green-100 text-green-800' :
                            employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          )}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 10 && (
                <div className="px-4 py-3 bg-slate-50 text-sm text-slate-600">
                  ... and {parsedData.length - 10} more employees
                </div>
              )}
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-900 mb-2">Import Errors</h3>
            <ul className="text-sm text-red-800 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        {step === 1 && (
          <Button
            onClick={processCSV}
            disabled={!file || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process CSV'}
          </Button>
        )}
        {step === 2 && (
          <Button onClick={handleImport}>
            Import {parsedData.length} Employees
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CSVImportModal;
