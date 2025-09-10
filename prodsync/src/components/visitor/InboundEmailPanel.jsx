'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Table } from '../ui/Table';

// Mock inbound emails data
const mockInboundEmails = [
  {
    id: '1',
    from: 'john.smith@techcorp.com',
    subject: 'Meeting Request - Project Collaboration',
    received: '2024-01-15T08:30:00Z',
    content: 'Hi, I would like to schedule a meeting to discuss our new project collaboration. I can visit your office tomorrow at 2 PM.',
    type: 'visitor_request',
    status: 'unprocessed',
    mapped_to: null,
    priority: 'medium',
    attachments: ['project_proposal.pdf']
  },
  {
    id: '2',
    from: 'support@vendor.com',
    subject: 'Maintenance Visit Scheduled',
    received: '2024-01-15T09:15:00Z',
    content: 'Our technician will be visiting your office on January 16th at 10 AM for the scheduled maintenance of the HVAC system.',
    type: 'maintenance',
    status: 'processed',
    mapped_to: 'visitor_4',
    priority: 'high',
    attachments: ['maintenance_schedule.pdf']
  },
  {
    id: '3',
    from: 'sarah@designstudio.com',
    subject: 'Client Presentation - Design Concepts',
    received: '2024-01-15T10:45:00Z',
    content: 'I have new design concepts to present to your team. Can we schedule a meeting for this week?',
    type: 'visitor_request',
    status: 'unprocessed',
    mapped_to: null,
    priority: 'medium',
    attachments: ['design_concepts.pdf', 'portfolio.pdf']
  },
  {
    id: '4',
    from: 'delivery@logistics.com',
    subject: 'Package Delivery Notification',
    received: '2024-01-15T11:20:00Z',
    content: 'Your package will be delivered today between 2-4 PM. Please ensure someone is available to receive it.',
    type: 'delivery',
    status: 'processed',
    mapped_to: 'ticket_123',
    priority: 'low',
    attachments: ['delivery_confirmation.pdf']
  },
  {
    id: '5',
    from: 'michael@consulting.com',
    subject: 'Interview Confirmation',
    received: '2024-01-15T14:00:00Z',
    content: 'Confirming my interview for the Senior Developer position tomorrow at 10 AM. Looking forward to meeting the team.',
    type: 'interview',
    status: 'processed',
    mapped_to: 'visitor_3',
    priority: 'high',
    attachments: ['resume.pdf']
  },
  {
    id: '6',
    from: 'security@audit.com',
    subject: 'Security Audit Schedule',
    received: '2024-01-15T15:30:00Z',
    content: 'Our security team will conduct the quarterly audit on January 16th from 1:30 PM to 5:00 PM.',
    type: 'security_audit',
    status: 'unprocessed',
    mapped_to: null,
    priority: 'high',
    attachments: ['audit_checklist.pdf', 'compliance_requirements.pdf']
  }
];

const emailTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'visitor_request', label: 'Visitor Request' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'interview', label: 'Interview' },
  { value: 'security_audit', label: 'Security Audit' },
  { value: 'other', label: 'Other' }
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'unprocessed', label: 'Unprocessed' },
  { value: 'processed', label: 'Processed' },
  { value: 'mapped', label: 'Mapped' }
];

const priorities = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

export default function InboundEmailPanel({ isOpen, onClose }) {
  const [emails, setEmails] = useState(mockInboundEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isEmailDetailOpen, setIsEmailDetailOpen] = useState(false);
  const [mappingType, setMappingType] = useState('visitor');
  const [mappingValue, setMappingValue] = useState('');

  // Filter emails
  const filteredEmails = emails.filter(email => {
    const matchesSearch = !searchTerm || 
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || email.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || email.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || email.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Table columns
  const columns = [
    {
      key: 'from',
      label: 'From',
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.subject}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const typeConfig = {
          visitor_request: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Visitor Request' },
          maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Maintenance' },
          delivery: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivery' },
          interview: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview' },
          security_audit: { bg: 'bg-red-100', text: 'text-red-800', label: 'Security Audit' },
          other: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Other' }
        };
        const config = typeConfig[value] || typeConfig.other;
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
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusConfig = {
          unprocessed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unprocessed' },
          processed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Processed' },
          mapped: { bg: 'bg-green-100', text: 'text-green-800', label: 'Mapped' }
        };
        const config = statusConfig[value] || statusConfig.unprocessed;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'received',
      label: 'Received',
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'mapped_to',
      label: 'Mapped To',
      render: (value) => value ? (
        <span className="text-sm text-green-600 font-medium">{value}</span>
      ) : (
        <span className="text-sm text-slate-400">Not mapped</span>
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
            onClick={() => {
              setSelectedEmail(row);
              setIsEmailDetailOpen(true);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmail(row);
              setMappingType('visitor');
              setMappingValue('');
            }}
            disabled={row.status === 'mapped'}
          >
            Map
          </Button>
        </div>
      )
    }
  ];

  const handleMapEmail = (emailId, type, value) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { 
            ...email, 
            status: 'mapped', 
            mapped_to: `${type}_${value}` 
          }
        : email
    ));
    setSelectedEmail(null);
  };

  const handleMarkProcessed = (emailId) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, status: 'processed' }
        : email
    ));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalHeader>
          <h2 className="text-xl font-semibold text-slate-900">Inbound Email Panel</h2>
          <p className="text-sm text-slate-600">Manage and map inbound emails to visitors or tickets</p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
                <Select
                  options={emailTypes}
                  value={selectedType}
                  onChange={setSelectedType}
                  placeholder="Filter by type"
                />
                <Select
                  options={statuses}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Filter by status"
                />
                <Select
                  options={priorities}
                  value={selectedPriority}
                  onChange={setSelectedPriority}
                  placeholder="Filter by priority"
                />
              </div>
            </div>

            {/* Email List */}
            <div className="bg-white rounded-lg border border-slate-200">
              <Table
                data={filteredEmails}
                columns={columns}
                className="min-w-full"
              />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-2xl font-bold text-slate-900">{emails.length}</div>
                <div className="text-sm text-slate-600">Total Emails</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-2xl font-bold text-red-600">
                  {emails.filter(e => e.status === 'unprocessed').length}
                </div>
                <div className="text-sm text-slate-600">Unprocessed</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {emails.filter(e => e.status === 'processed').length}
                </div>
                <div className="text-sm text-slate-600">Processed</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="text-2xl font-bold text-green-600">
                  {emails.filter(e => e.status === 'mapped').length}
                </div>
                <div className="text-sm text-slate-600">Mapped</div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <Modal isOpen={isEmailDetailOpen} onClose={() => setIsEmailDetailOpen(false)} size="lg">
          <ModalHeader>
            <h3 className="text-lg font-semibold text-slate-900">Email Details</h3>
            <p className="text-sm text-slate-600">From: {selectedEmail.from}</p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Subject</h4>
                <p className="text-slate-700">{selectedEmail.subject}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Content</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedEmail.content}</p>
                </div>
              </div>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Type</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedEmail.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Priority</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedEmail.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedEmail.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedEmail.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkProcessed(selectedEmail.id)}
                  disabled={selectedEmail.status === 'processed' || selectedEmail.status === 'mapped'}
                >
                  Mark Processed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMappingType('visitor');
                    setMappingValue('');
                  }}
                  disabled={selectedEmail.status === 'mapped'}
                >
                  Map to Visitor/Ticket
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsEmailDetailOpen(false)}>
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}

      {/* Mapping Modal */}
      {selectedEmail && (
        <Modal isOpen={false} onClose={() => setSelectedEmail(null)} size="md">
          <ModalHeader>
            <h3 className="text-lg font-semibold text-slate-900">Map Email</h3>
            <p className="text-sm text-slate-600">Map this email to a visitor or ticket</p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Map to
                </label>
                <Select
                  options={[
                    { value: 'visitor', label: 'Visitor' },
                    { value: 'ticket', label: 'Support Ticket' }
                  ]}
                  value={mappingType}
                  onChange={setMappingType}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {mappingType === 'visitor' ? 'Visitor ID' : 'Ticket ID'}
                </label>
                <Input
                  value={mappingValue}
                  onChange={(e) => setMappingValue(e.target.value)}
                  placeholder={`Enter ${mappingType} ID`}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedEmail(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleMapEmail(selectedEmail.id, mappingType, mappingValue)}
                disabled={!mappingValue}
              >
                Map Email
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
