'use client';

import { useState, useEffect } from 'react';

export default function EmployeeDocuments() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    description: '',
    file: null
  });

  // Sample employee data
  useEffect(() => {
    const sampleEmployees = [
      {
        id: 1,
        name: 'John Smith',
        position: 'Software Engineer',
        department: 'IT',
        avatar: 'JS'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        position: 'HR Manager',
        department: 'HR',
        avatar: 'SJ'
      },
      {
        id: 3,
        name: 'Mike Davis',
        position: 'Marketing Specialist',
        department: 'Marketing',
        avatar: 'MD'
      }
    ];
    setEmployees(sampleEmployees);
    if (sampleEmployees.length > 0) {
      setSelectedEmployee(sampleEmployees[0]);
    }
  }, []);

  // Sample documents data
  useEffect(() => {
    if (selectedEmployee) {
      const sampleDocuments = [
        {
          id: 1,
          name: 'Employment Contract',
          type: 'Contract',
          description: 'Original employment agreement',
          uploadDate: '2023-01-15',
          size: '2.3 MB',
          status: 'Active',
          employeeId: selectedEmployee.id
        },
        {
          id: 2,
          name: 'ID Copy',
          type: 'Identification',
          description: 'Government issued ID',
          uploadDate: '2023-01-10',
          size: '1.1 MB',
          status: 'Active',
          employeeId: selectedEmployee.id
        },
        {
          id: 3,
          name: 'Resume',
          type: 'Resume',
          description: 'Current resume and CV',
          uploadDate: '2023-01-05',
          size: '856 KB',
          status: 'Active',
          employeeId: selectedEmployee.id
        },
        {
          id: 4,
          name: 'Performance Review 2023',
          type: 'Review',
          description: 'Annual performance evaluation',
          uploadDate: '2023-12-15',
          size: '1.5 MB',
          status: 'Active',
          employeeId: selectedEmployee.id
        }
      ];
      setDocuments(sampleDocuments);
    }
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

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newDocument.file || !selectedEmployee) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const document = {
        id: documents.length + 1,
        name: newDocument.name,
        type: newDocument.type,
        description: newDocument.description,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(newDocument.file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'Active',
        employeeId: selectedEmployee.id
      };
      
      setDocuments(prev => [...prev, document]);
      setNewDocument({
        name: '',
        type: '',
        description: '',
        file: null
      });
      setIsUploading(false);
      alert('Document uploaded successfully!');
    }, 2000);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
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
            const employee = employees.find(emp => emp.id === parseInt(e.target.value));
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
                        <div className="text-sm text-gray-900">{new Date(document.uploadDate).toLocaleDateString()}</div>
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
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          <button className="text-green-600 hover:text-green-900">Download</button>
                          <button 
                            onClick={() => handleDelete(document.id)}
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
    </div>
  );
}