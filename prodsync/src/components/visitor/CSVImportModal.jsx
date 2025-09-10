'use client';

import { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Table } from '../ui/Table';

export default function CSVImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Preview, 4: Import
  const fileInputRef = useRef(null);

  // Expected visitor fields
  const visitorFields = [
    { key: 'name', label: 'Full Name', required: true },
    { key: 'company', label: 'Company', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: true },
    { key: 'purpose', label: 'Purpose', required: true },
    { key: 'host', label: 'Host', required: true },
    { key: 'host_department', label: 'Host Department', required: false },
    { key: 'scheduled_time', label: 'Scheduled Time', required: false },
    { key: 'notes', label: 'Notes', required: false }
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);

    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          alert('CSV file is empty');
          setIsProcessing(false);
          return;
        }

        // Parse headers
        const csvHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        setHeaders(csvHeaders);

        // Parse data rows
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row = { _rowIndex: index + 2 }; // +2 because we skip header and 0-indexed
          
          csvHeaders.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          
          return row;
        });

        setCsvData(data);
        
        // Auto-map common fields
        const autoMapping = {};
        csvHeaders.forEach(header => {
          const lowerHeader = header.toLowerCase();
          visitorFields.forEach(field => {
            if (lowerHeader.includes(field.key) || 
                (field.key === 'name' && (lowerHeader.includes('name') || lowerHeader.includes('full'))) ||
                (field.key === 'company' && lowerHeader.includes('company')) ||
                (field.key === 'email' && lowerHeader.includes('email')) ||
                (field.key === 'phone' && (lowerHeader.includes('phone') || lowerHeader.includes('mobile'))) ||
                (field.key === 'purpose' && lowerHeader.includes('purpose')) ||
                (field.key === 'host' && lowerHeader.includes('host')) ||
                (field.key === 'notes' && lowerHeader.includes('note'))) {
              autoMapping[field.key] = header;
            }
          });
        });
        
        setFieldMapping(autoMapping);
        setStep(2);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(uploadedFile);
  };

  const handleFieldMapping = (visitorField, csvHeader) => {
    setFieldMapping(prev => ({
      ...prev,
      [visitorField]: csvHeader
    }));
  };

  const handlePreview = () => {
    setStep(3);
  };

  const handleImport = () => {
    setIsProcessing(true);
    
    try {
      // Transform data based on field mapping
      const transformedData = csvData.map(row => {
        const visitor = {};
        
        visitorFields.forEach(field => {
          const csvHeader = fieldMapping[field.key];
          if (csvHeader && row[csvHeader]) {
            visitor[field.key] = row[csvHeader];
          } else if (field.required) {
            visitor[field.key] = '';
          }
        });
        
        return visitor;
      });

      // Filter out rows with missing required fields
      const validData = transformedData.filter(visitor => {
        return visitorFields.every(field => {
          if (field.required) {
            return visitor[field.key] && visitor[field.key].trim() !== '';
          }
          return true;
        });
      });

      onImport(validData);
      handleClose();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setFieldMapping({});
    setStep(1);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getPreviewData = () => {
    return csvData.slice(0, 5).map(row => {
      const preview = { _row: row._rowIndex };
      visitorFields.forEach(field => {
        const csvHeader = fieldMapping[field.key];
        preview[field.label] = csvHeader ? row[csvHeader] : '';
      });
      return preview;
    });
  };

  const getValidationErrors = () => {
    const errors = [];
    
    // Check required field mappings
    visitorFields.forEach(field => {
      if (field.required && !fieldMapping[field.key]) {
        errors.push(`${field.label} is required but not mapped`);
      }
    });
    
    // Check for duplicate mappings
    const mappedHeaders = Object.values(fieldMapping).filter(Boolean);
    const duplicates = mappedHeaders.filter((header, index) => 
      mappedHeaders.indexOf(header) !== index
    );
    
    if (duplicates.length > 0) {
      errors.push(`Duplicate column mappings: ${duplicates.join(', ')}`);
    }
    
    return errors;
  };

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalHeader>
        <h2 className="text-xl font-semibold text-slate-900">Import Visitors from CSV</h2>
        <p className="text-sm text-slate-600">
          Step {step} of 4: {step === 1 ? 'Upload File' : step === 2 ? 'Map Fields' : step === 3 ? 'Preview Data' : 'Import'}
        </p>
      </ModalHeader>

      <ModalBody>
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Upload CSV File</h3>
              <p className="text-slate-600 mb-6">
                Select a CSV file containing visitor information. The file should have headers in the first row.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                leftIcon={
                  isProcessing ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  )
                }
              >
                {isProcessing ? 'Processing...' : 'Choose CSV File'}
              </Button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• First row must contain column headers</li>
                <li>• Required columns: Name, Company, Email, Phone, Purpose, Host</li>
                <li>• Optional columns: Host Department, Scheduled Time, Notes</li>
                <li>• Use commas to separate values</li>
                <li>• Enclose values with commas in quotes</li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Map CSV Columns to Visitor Fields</h3>
              <p className="text-slate-600 mb-6">
                Map each CSV column to the corresponding visitor field. Required fields are marked with *.
              </p>
            </div>

            <div className="space-y-4">
              {visitorFields.map(field => (
                <div key={field.key} className="flex items-center space-x-4">
                  <div className="w-48">
                    <label className="block text-sm font-medium text-slate-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                  <div className="flex-1">
                    <Select
                      options={[
                        { value: '', label: '-- Select Column --' },
                        ...headers.map(header => ({ value: header, label: header }))
                      ]}
                      value={fieldMapping[field.key] || ''}
                      onChange={(value) => handleFieldMapping(field.key, value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Validation Errors</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Preview Import Data</h3>
              <p className="text-slate-600 mb-6">
                Review the first 5 rows of data that will be imported. {csvData.length} total rows will be processed.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200">
              <Table
                data={getPreviewData()}
                columns={visitorFields.map(field => ({
                  key: field.label,
                  label: field.label,
                  render: (value) => (
                    <span className={!value ? 'text-slate-400 italic' : ''}>
                      {value || 'Not mapped'}
                    </span>
                  )
                }))}
                className="min-w-full"
              />
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Import Summary</h4>
              <div className="text-sm text-green-800 space-y-1">
                <div>• Total rows: {csvData.length}</div>
                <div>• Valid rows: {csvData.length}</div>
                <div>• Fields mapped: {Object.keys(fieldMapping).filter(k => fieldMapping[k]).length}</div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-slate-600">
            {step === 1 && 'Upload a CSV file to begin'}
            {step === 2 && `${Object.keys(fieldMapping).filter(k => fieldMapping[k]).length} fields mapped`}
            {step === 3 && `Ready to import ${csvData.length} visitors`}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            
            {step === 2 && (
              <Button
                onClick={handlePreview}
                disabled={!isValid}
              >
                Preview Data
              </Button>
            )}
            
            {step === 3 && (
              <Button
                onClick={handleImport}
                disabled={isProcessing}
                leftIcon={
                  isProcessing ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  )
                }
              >
                {isProcessing ? 'Importing...' : 'Import Visitors'}
              </Button>
            )}
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}
