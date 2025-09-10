'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const mockPermits = [
  {
    id: 1,
    name: 'Building Construction Permit',
    type: 'Construction Permit',
    permitNumber: 'CP-2024-001',
    issuingAuthority: 'City Building Department',
    issueDate: '2024-02-01',
    expiryDate: '2024-08-01',
    status: 'Active',
    description: 'Permit for new office building construction',
    location: '123 Main Street, Downtown',
    contractor: 'ABC Construction Co.',
    documents: ['building-plans.pdf', 'safety-certificate.pdf'],
    inspections: [
      { date: '2024-02-15', type: 'Foundation', status: 'Passed', inspector: 'John Smith' },
      { date: '2024-03-01', type: 'Framing', status: 'Scheduled', inspector: 'Jane Doe' }
    ]
  },
  {
    id: 2,
    name: 'Health Department Permit',
    type: 'Health Permit',
    permitNumber: 'HP-2024-002',
    issuingAuthority: 'County Health Department',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'Active',
    description: 'Food service establishment permit',
    location: '456 Oak Avenue, Midtown',
    contractor: 'N/A',
    documents: ['health-inspection.pdf', 'food-safety-plan.pdf'],
    inspections: [
      { date: '2024-01-10', type: 'Initial Inspection', status: 'Passed', inspector: 'Dr. Sarah Johnson' }
    ]
  },
  {
    id: 3,
    name: 'Fire Safety Certificate',
    type: 'Fire Safety',
    permitNumber: 'FS-2024-003',
    issuingAuthority: 'Fire Department',
    issueDate: '2023-11-15',
    expiryDate: '2024-11-15',
    status: 'Expiring Soon',
    description: 'Fire safety compliance certificate',
    location: '789 Pine Street, Uptown',
    contractor: 'N/A',
    documents: ['fire-safety-plan.pdf', 'sprinkler-certificate.pdf'],
    inspections: [
      { date: '2023-11-15', type: 'Annual Inspection', status: 'Passed', inspector: 'Captain Mike Wilson' }
    ]
  }
];

const permitTypes = [
  'Construction Permit',
  'Health Permit',
  'Fire Safety',
  'Environmental Permit',
  'Sign Permit',
  'Parking Permit',
  'Special Event Permit',
  'Zoning Permit',
  'Electrical Permit',
  'Plumbing Permit'
];

const statusOptions = [
  'Active',
  'Expired',
  'Expiring Soon',
  'Pending Approval',
  'Under Review',
  'Suspended',
  'Cancelled'
];

const inspectionStatuses = [
  'Scheduled',
  'In Progress',
  'Passed',
  'Failed',
  'Pending Review'
];

export default function PermitManagement() {
  const [permits, setPermits] = useState(mockPermits);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    permitNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    status: 'Active',
    description: '',
    location: '',
    contractor: '',
    documents: [],
    inspections: []
  });

  const [inspectionData, setInspectionData] = useState({
    date: '',
    type: '',
    status: 'Scheduled',
    inspector: '',
    notes: ''
  });

  const handleAddPermit = () => {
    const newPermit = {
      id: permits.length + 1,
      ...formData
    };
    setPermits([...permits, newPermit]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditPermit = () => {
    setPermits(permits.map(permit => 
      permit.id === selectedPermit.id ? { ...selectedPermit, ...formData } : permit
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeletePermit = (id) => {
    if (confirm('Are you sure you want to delete this permit?')) {
      setPermits(permits.filter(permit => permit.id !== id));
    }
  };

  const handleAddInspection = () => {
    const updatedPermit = {
      ...selectedPermit,
      inspections: [...selectedPermit.inspections, inspectionData]
    };
    setPermits(permits.map(permit => 
      permit.id === selectedPermit.id ? updatedPermit : permit
    ));
    setSelectedPermit(updatedPermit);
    setIsInspectionModalOpen(false);
    setInspectionData({
      date: '',
      type: '',
      status: 'Scheduled',
      inspector: '',
      notes: ''
    });
  };

  const openEditModal = (permit) => {
    setSelectedPermit(permit);
    setFormData(permit);
    setIsEditModalOpen(true);
  };

  const openViewModal = (permit) => {
    setSelectedPermit(permit);
    setIsViewModalOpen(true);
  };

  const openInspectionModal = (permit) => {
    setSelectedPermit(permit);
    setIsInspectionModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      permitNumber: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      status: 'Active',
      description: '',
      location: '',
      contractor: '',
      documents: [],
      inspections: []
    });
  };

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || permit.status === filterStatus;
    const matchesType = filterType === 'All' || permit.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-purple-100 text-purple-800';
      case 'Suspended': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInspectionStatusColor = (status) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Permit Management</h2>
          <p className="text-slate-600">Manage permits, licenses, and inspections</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Permit
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <Input
              type="text"
              placeholder="Search permits..."
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
              options={['All', ...permitTypes]}
            />
          </div>
        </div>
      </div>

      {/* Permits Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Permit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
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
              {filteredPermits.map((permit) => (
                <tr key={permit.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{permit.name}</div>
                      <div className="text-sm text-slate-500">{permit.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {permit.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {permit.permitNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {permit.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(permit.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(permit.status)}`}>
                      {permit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(permit)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(permit)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openInspectionModal(permit)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Inspections
                      </button>
                      <button
                        onClick={() => handleDeletePermit(permit.id)}
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

      {/* Add Permit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Permit"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Permit name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={permitTypes}
                placeholder="Select type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Permit Number</label>
              <Input
                type="text"
                value={formData.permitNumber}
                onChange={(e) => setFormData({...formData, permitNumber: e.target.value})}
                placeholder="Permit number"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Permit location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contractor</label>
              <Input
                type="text"
                value={formData.contractor}
                onChange={(e) => setFormData({...formData, contractor: e.target.value})}
                placeholder="Contractor name (if applicable)"
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
              placeholder="Permit description"
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
              onClick={handleAddPermit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Permit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Permit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Permit"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Permit name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={permitTypes}
                placeholder="Select type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Permit Number</label>
              <Input
                type="text"
                value={formData.permitNumber}
                onChange={(e) => setFormData({...formData, permitNumber: e.target.value})}
                placeholder="Permit number"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Permit location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contractor</label>
              <Input
                type="text"
                value={formData.contractor}
                onChange={(e) => setFormData({...formData, contractor: e.target.value})}
                placeholder="Contractor name (if applicable)"
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
              placeholder="Permit description"
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
              onClick={handleEditPermit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Permit
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Permit Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Permit Details"
      >
        {selectedPermit && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <p className="text-slate-900">{selectedPermit.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <p className="text-slate-900">{selectedPermit.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Permit Number</label>
                <p className="text-slate-900">{selectedPermit.permitNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Authority</label>
                <p className="text-slate-900">{selectedPermit.issuingAuthority}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                <p className="text-slate-900">{new Date(selectedPermit.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <p className="text-slate-900">{new Date(selectedPermit.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <p className="text-slate-900">{selectedPermit.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contractor</label>
                <p className="text-slate-900">{selectedPermit.contractor || 'N/A'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPermit.status)}`}>
                {selectedPermit.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <p className="text-slate-900">{selectedPermit.description}</p>
            </div>

            {selectedPermit.documents && selectedPermit.documents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Documents</label>
                <div className="space-y-2">
                  {selectedPermit.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-slate-900">{doc}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPermit.inspections && selectedPermit.inspections.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recent Inspections</label>
                <div className="space-y-2">
                  {selectedPermit.inspections.slice(0, 3).map((inspection, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{inspection.type}</span>
                        <span className="text-xs text-slate-500 ml-2">by {inspection.inspector}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getInspectionStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(inspection.date).toLocaleDateString()}</span>
                      </div>
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

      {/* Add Inspection Modal */}
      <Modal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        title="Add Inspection"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Permit</label>
            <p className="text-slate-900 font-medium">{selectedPermit?.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Inspection Date</label>
              <DatePicker
                value={inspectionData.date}
                onChange={(date) => setInspectionData({...inspectionData, date})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Input
                type="text"
                value={inspectionData.type}
                onChange={(e) => setInspectionData({...inspectionData, type: e.target.value})}
                placeholder="Inspection type"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <Select
                value={inspectionData.status}
                onChange={(e) => setInspectionData({...inspectionData, status: e.target.value})}
                options={inspectionStatuses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Inspector</label>
              <Input
                type="text"
                value={inspectionData.inspector}
                onChange={(e) => setInspectionData({...inspectionData, inspector: e.target.value})}
                placeholder="Inspector name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={inspectionData.notes}
              onChange={(e) => setInspectionData({...inspectionData, notes: e.target.value})}
              placeholder="Inspection notes"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => setIsInspectionModalOpen(false)}
              className="bg-slate-300 hover:bg-slate-400 text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddInspection}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Inspection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
