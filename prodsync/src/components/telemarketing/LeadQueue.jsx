'use client';

import { useState } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { cn } from '../../lib/utils';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'converted', label: 'Converted' }
];

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const agentOptions = [
  { value: '', label: 'Unassigned' },
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Wilson', label: 'Mike Wilson' },
  { value: 'Lisa Chen', label: 'Lisa Chen' },
  { value: 'David Lee', label: 'David Lee' },
  { value: 'Jennifer Taylor', label: 'Jennifer Taylor' }
];

export default function LeadQueue({ leads, onStartCall, onUpdateLeads }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    title: '',
    industry: '',
    source: '',
    status: 'new',
    priority: 'medium',
    notes: '',
    assigned_agent: ''
  });

  const handleEditLead = (lead) => {
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      industry: lead.industry,
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      notes: lead.notes,
      assigned_agent: lead.assigned_agent || ''
    });
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleSaveLead = () => {
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id
        ? { ...lead, ...formData }
        : lead
    );
    onUpdateLeads(updatedLeads);
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssignAgent = (leadId, agent) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId
        ? { ...lead, assigned_agent: agent }
        : lead
    );
    onUpdateLeads(updatedLeads);
  };

  const handleUpdateStatus = (leadId, status) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId
        ? { ...lead, status }
        : lead
    );
    onUpdateLeads(updatedLeads);
  };

  const columns = [
    {
      key: 'name',
      label: 'Lead',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.company}</div>
          <div className="text-sm text-slate-500">{row.title}</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_, row) => (
        <div>
          <div className="text-sm text-slate-900">{row.email}</div>
          <div className="text-sm text-slate-500">{row.phone}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
          contacted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Contacted' },
          qualified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Qualified' },
          not_interested: { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Interested' },
          converted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Converted' }
        };
        const config = statusConfig[value] || statusConfig.new;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => {
        const priorityConfig = {
          high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
          medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
          low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' }
        };
        const config = priorityConfig[value] || priorityConfig.medium;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'assigned_agent',
      label: 'Agent',
      render: (value) => (
        <div>
          {value ? (
            <span className="text-sm text-slate-900">{value}</span>
          ) : (
            <span className="text-sm text-slate-400 italic">Unassigned</span>
          )}
        </div>
      )
    },
    {
      key: 'call_count',
      label: 'Calls',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium text-slate-900">{value}</div>
          {row.last_contact && (
            <div className="text-sm text-slate-500">
              {new Date(row.last_contact).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'next_call',
      label: 'Next Call',
      sortable: true,
      render: (value) => (
        <div>
          {value ? (
            <div>
              <div className="text-sm text-slate-900">
                {new Date(value).toLocaleDateString()}
              </div>
              <div className="text-sm text-slate-500">
                {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <span className="text-sm text-slate-400 italic">Not scheduled</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartCall(row)}
            disabled={row.status === 'converted' || row.status === 'not_interested'}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          >
            Call
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditLead(row)}
          >
            Edit
          </Button>
          <Select
            options={agentOptions}
            value={row.assigned_agent || ''}
            onChange={(value) => handleAssignAgent(row.id, value)}
            className="w-32"
            size="sm"
          />
        </div>
      )
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">Lead Queue</h3>
              <p className="text-sm text-slate-600">
                {leads.length} leads ready for calling
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-slate-600">
                New: {leads.filter(l => l.status === 'new').length} | 
                Contacted: {leads.filter(l => l.status === 'contacted').length} | 
                Qualified: {leads.filter(l => l.status === 'qualified').length}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            data={leads}
            columns={columns}
            className="min-w-full"
          />
        </div>
      </div>

      {/* Edit Lead Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="lg">
        <ModalHeader>
          <h2 className="text-xl font-semibold text-slate-900">Edit Lead</h2>
          <p className="text-sm text-slate-600">Update lead information</p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
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
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Industry
                </label>
                <Input
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="Enter industry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Source
                </label>
                <Input
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  placeholder="Enter lead source"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <Select
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assigned Agent
                </label>
                <Select
                  options={agentOptions}
                  value={formData.assigned_agent}
                  onChange={(value) => handleInputChange('assigned_agent', value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter additional notes"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLead}
              disabled={!formData.name || !formData.company || !formData.email || !formData.phone}
            >
              Update Lead
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
