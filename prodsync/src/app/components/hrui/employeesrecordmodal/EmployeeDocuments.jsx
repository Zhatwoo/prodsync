'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function EmployeeDocuments() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    description: '',
    file: null
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      if (!selectedEmployee) return;

      try {
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
        
        // Sort by uploadDate in JavaScript instead of Firestore
        documentsData.sort((a, b) => {
          const dateA = a.uploadDate?.toDate ? a.uploadDate.toDate() : new Date(a.uploadDate);
          const dateB = b.uploadDate?.toDate ? b.uploadDate.toDate() : new Date(b.uploadDate);
          return dateB - dateA; // Descending order
        });
        
        setDocuments(documentsData);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      }
    };

    fetchDocuments();
  }, [selectedEmployee]);

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
      const docRef = await addDoc(collection(db, 'documents'), documentData);
      const newDoc = {
        id: docRef.id,
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
      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'documents', documentToDelete.id));
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      alert('Document deleted successfully!');
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
    setIsClosing(false);
  };

  const handleCloseViewModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowViewModal(false);
      setSelectedDocument(null);
      setIsClosing(false);
    }, 300);
  };

  const handleDownload = (docData) => {
    // Since we're not actually storing files in Firebase Storage,
    // we'll simulate a download by creating a blob with document info
    const content = `Document Information\n\nName: ${docData.name}\nType: ${docData.type}\nSize: ${docData.size}\nUpload Date: ${docData.uploadDate && docData.uploadDate.toDate ? docData.uploadDate.toDate().toLocaleDateString() : new Date(docData.uploadDate).toLocaleDateString()}\nDescription: ${docData.description || 'No description'}\n\nNote: This is a simulated download. In a real application, this would download the actual file.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docData.name}_info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Document information downloaded! (Note: This is a simulated download)');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Contract': return 'bg-blue-100 text-blue-800';
      case 'Identification': return 'bg-green-100 text-green-800';
      case 'Resume': return 'bg-purple-100 text-purple-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Certificate': return 'bg-indigo-100 text-indigo-800';
      case 'Training': return 'bg-pink-100 text-pink-800';
      case 'Medical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Employee Documents</h2>
        <p className="text-gray-600 mt-1">Manage employee documents and files</p>
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
          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Upload Form */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Document</h3>
            </div>
            <form onSubmit={handleUpload} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newDocument.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter document description"
                  />
                </div>
                <div className="md:col-span-2">
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
              <div className="flex justify-end mt-4">
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

          {/* Documents List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Documents for {selectedEmployee.name}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-500">{document.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(document.type)}`}>
                          {document.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {document.uploadDate && document.uploadDate.toDate ? 
                            document.uploadDate.toDate().toLocaleDateString() : 
                            new Date(document.uploadDate).toLocaleDateString()
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          document.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleView(document)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownload(document)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleDelete(document)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {documents.filter(doc => doc.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-600">Active Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {documents.filter(doc => doc.type === 'Contract').length}
                </div>
                <div className="text-sm text-gray-600">Contracts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {documents.filter(doc => doc.type === 'Review').length}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Document Modal */}
      {showViewModal && selectedDocument && (
        <div
          className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleCloseViewModal}
        >
          <div
            className={`bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transition-all duration-300 ${isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
              <button
                onClick={handleCloseViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Document Name</label>
                <p className="text-gray-900 text-lg font-medium">{selectedDocument.name}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(selectedDocument.type)}`}>
                    {selectedDocument.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Size</label>
                  <p className="text-gray-900">{selectedDocument.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedDocument.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedDocument.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Upload Date</label>
                  <p className="text-gray-900">
                    {selectedDocument.uploadDate && selectedDocument.uploadDate.toDate ? 
                      selectedDocument.uploadDate.toDate().toLocaleDateString() : 
                      new Date(selectedDocument.uploadDate).toLocaleDateString()
                    }
                  </p>
                </div>
              </div>
              
              {selectedDocument.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDocument.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">File Name</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedDocument.fileName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">File Type</label>
                  <p className="text-gray-900">{selectedDocument.fileType}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Download Info
              </button>
              <button
                onClick={handleCloseViewModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        onConfirm={confirmDeleteDocument}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        itemName={documentToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}