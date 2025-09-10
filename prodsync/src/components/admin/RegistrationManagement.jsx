'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const mockRegistrations = [
  {
    id: 1,
    name: 'Business License',
    type: 'Business Registration',
    registrationNumber: 'BL-2024-001',
    issuingAuthority: 'City Business Bureau',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'Active',
    description: 'General business operating license',
    documents: ['business-license.pdf', 'tax-certificate.pdf']
  },
  {
    id: 2,
    name: 'Tax Registration',
    type: 'Tax Registration',
    registrationNumber: 'TR-2024-002',
    issuingAuthority: 'State Tax Department',
    issueDate: '2024-01-20',
    expiryDate: '2025-01-20',
    status: 'Active',
    description: 'State tax registration certificate',
    documents: ['tax-registration.pdf']
  },
  {
    id: 3,
    name: 'Professional License',
    type: 'Professional License',
    registrationNumber: 'PL-2024-003',
    issuingAuthority: 'Professional Licensing Board',
    issueDate: '2023-12-01',
    expiryDate: '2024-12-01',
    status: 'Expiring Soon',
    description: 'Professional services license',
    documents: ['professional-license.pdf', 'continuing-education.pdf']
  }
];

const registrationTypes = [
  'Business Registration',
  'Tax Registration',
  'Professional License',
  'Trade License',
  'Import/Export License',
  'Health Permit',
  'Fire Safety Certificate',
  'Environmental Permit'
];

const statusOptions = [
  'Active',
  'Expired',
  'Expiring Soon',
  'Pending Renewal',
  'Suspended',
  'Cancelled'
];

export default function RegistrationManagement() {
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    registrationNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    description: '',
    documents: []
  });

  const handleAddRegistration = () => {
    const newRegistration = {
      id: registrations.length + 1,
      ...formData
    };
    setRegistrations([...registrations, newRegistration]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditRegistration = () => {
    setRegistrations(registrations.map(reg => 
      reg.id === selectedRegistration.id ? { ...selectedRegistration, ...formData } : reg
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteRegistration = (id) => {
    if (confirm('Are you sure you want to delete this registration?')) {
      setRegistrations(registrations.filter(reg => reg.id !== id));
    }
  };

  const openEditModal = (registration) => {
    setSelectedRegistration(registration);
    setFormData(registration);
    setIsEditModalOpen(true);
  };

  const openViewModal = (registration) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      registrationNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      status: 'Active',
      description: '',
      documents: []
    });
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || registration.status === filterStatus;
    const matchesType = filterType === 'All' || registration.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Renewal': return 'bg-blue-100 text-blue-800';
      case 'Suspended': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registration Management</h2>
          <p className="text-slate-600">Manage business registrations and licenses</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Registration
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <Input
              type="text"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={['All', ...statusOptions]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={['All', ...registrationTypes]}
            />
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Authority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{registration.name}</div>
                      <div className="text-sm text-slate-500">{registration.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {registration.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {registration.registrationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {registration.issuingAuthority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(registration.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(registration)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(registration)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRegistration(registration.id)}
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

      {/* Add Registration Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Registration"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Registration name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={registrationTypes}
                placeholder="Select type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Registration Number</label>
              <Input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                placeholder="Registration number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issuing Authority</label>
              <Input
                type="text"
                value={formData.issuingAuthority}
                onChange={(e) => setFormData({...formData, issuingAuthority: e.target.value})}
                placeholder="Issuing authority"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date</label>
              <DatePicker
                value={formData.issueDate}
                onChange={(date) => setFormData({...formData, issueDate: date})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
              <DatePicker
                value={formData.expiryDate}
                onChange={(date) => setFormData({...formData, expiryDate: date})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Registration description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => setIsAddModalOpen(false)}
              className="bg-slate-300 hover:bg-slate-400 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRegistration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Registration
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Registration Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Registration"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Registration name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={registrationTypes}
                placeholder="Select type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Registration Number</label>
              <Input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                placeholder="Registration number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issuing Authority</label>
              <Input
                type="text"
                value={formData.issuingAuthority}
                onChange={(e) => setFormData({...formData, issuingAuthority: e.target.value})}
                placeholder="Issuing authority"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date</label>
              <DatePicker
                value={formData.issueDate}
                onChange={(date) => setFormData({...formData, issueDate: date})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
              <DatePicker
                value={formData.expiryDate}
                onChange={(date) => setFormData({...formData, expiryDate: date})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Registration description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="bg-slate-300 hover:bg-slate-400 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditRegistration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Registration
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Registration Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Registration Details"
      >
        {selectedRegistration && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <p className="text-slate-900">{selectedRegistration.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <p className="text-slate-900">{selectedRegistration.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                <p className="text-slate-900">{selectedRegistration.registrationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Authority</label>
                <p className="text-slate-900">{selectedRegistration.issuingAuthority}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                <p className="text-slate-900">{new Date(selectedRegistration.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <p className="text-slate-900">{new Date(selectedRegistration.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRegistration.status)}`}>
                {selectedRegistration.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <p className="text-slate-900">{selectedRegistration.description}</p>
            </div>

            {selectedRegistration.documents && selectedRegistration.documents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Documents</label>
                <div className="space-y-2">
                  {selectedRegistration.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-900">{doc}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-slate-300 hover:bg-slate-400 text-slate-700"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
