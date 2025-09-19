'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';

export default function EmployeeProfile() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    description: '',
    file: null
  });
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Fetch employees from Firebase
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeesRef = collection(db, 'employees');
        const q = query(employeesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const employeesData = [];
        querySnapshot.forEach((doc) => {
          employeesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setEmployees(employeesData);
        if (employeesData.length > 0) {
          setSelectedEmployee(employeesData[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch documents for selected employee
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedEmployee) {
        setDocuments([]);
        return;
      }

      try {
        setLoadingDocuments(true);
        const documentsRef = collection(db, 'documents');
        const q = query(
          documentsRef, 
          where('employeeId', '==', selectedEmployee.id)
        );
        const querySnapshot = await getDocs(q);
        
        const documentsData = [];
        querySnapshot.forEach((doc) => {
          documentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by uploadDate in JavaScript
        documentsData.sort((a, b) => {
          const dateA = a.uploadDate?.toDate ? a.uploadDate.toDate() : new Date(a.uploadDate);
          const dateB = b.uploadDate?.toDate ? b.uploadDate.toDate() : new Date(b.uploadDate);
          return dateB - dateA; // Descending order
        });
        
        setDocuments(documentsData);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setDocuments([]);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, [selectedEmployee]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const documentTypes = [
    'Contract', 'Identification', 'Resume', 'Review', 'Certificate', 
    'Training', 'Medical', 'Emergency Contact', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewDocument(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDocument.file || !selectedEmployee) return;

    setIsUploading(true);
    setError(null);
    
    try {
      const documentData = {
        name: newDocument.name,
        type: newDocument.type,
        description: newDocument.description,
        uploadDate: serverTimestamp(),
        size: `${(newDocument.file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'Active',
        employeeId: selectedEmployee.id,
        fileName: newDocument.file.name,
        fileType: newDocument.file.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add document to Firebase
      await addDoc(collection(db, 'documents'), documentData);
      
      // Refresh documents list
      const newDoc = {
        id: 'temp-id',
        ...documentData,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setDocuments(prev => [newDoc, ...prev]);
      
      setNewDocument({
        name: '',
        type: '',
        description: '',
        file: null
      });
      setShowUploadModal(false);
      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setNewDocument({
      name: '',
      type: '',
      description: '',
      file: null
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading employees...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Employee Profile</h2>
        <p className="text-gray-600 mt-1">View detailed employee information</p>
      </div>

      {/* Employee Selector */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
        <select
          value={selectedEmployee?.id || ''}
          onChange={(e) => {
            const employee = employees.find(emp => emp.id === e.target.value);
            setSelectedEmployee(employee);
          }}
          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {selectedEmployee.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEmployee.name}</h3>
                <p className="text-gray-600 mb-2">{selectedEmployee.position}</p>
                <p className="text-gray-500 mb-4">{selectedEmployee.department}</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload Document
                </button>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Joined {new Date(selectedEmployee.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employment Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                    <p className="text-gray-900">{selectedEmployee.id.substring(0, 8)}...</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                    <p className="text-gray-900">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                    <p className="text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
                    <p className="text-gray-900">{selectedEmployee.salary}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                    <p className="text-gray-900">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900">{selectedEmployee.address}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                      <p className="text-gray-900">{selectedEmployee.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Phone</label>
                      <p className="text-gray-900">{selectedEmployee.emergencyPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Skills & Qualifications</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                    selectedEmployee.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {skill}
                    </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              </div>
              <div className="p-4">
                {loadingDocuments ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500 text-sm">Loading documents...</div>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.slice(0, 5).map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-xs text-gray-500">{document.type} • {document.size}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {document.uploadDate && document.uploadDate.toDate ? 
                            document.uploadDate.toDate().toLocaleDateString() : 
                            new Date(document.uploadDate).toLocaleDateString()
                          }
                        </div>
                      </div>
                    ))}
                    {documents.length > 5 && (
                      <div className="text-center pt-2">
                        <span className="text-sm text-gray-500">
                          +{documents.length - 5} more documents
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No documents available</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload documents using the button above.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && selectedEmployee && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Document for {selectedEmployee.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                  </button>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}
            
            <form onSubmit={handleUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newDocument.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                  <select
                    name="type"
                    value={newDocument.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newDocument.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter document description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File *</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}