'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { DatePicker } from '../../components/ui/DatePicker';
import { cn, debounce } from '../../lib/utils';
import VisitorEntryForm from '../../components/visitor/VisitorEntryForm';
import VisitorBadgePreview from '../../components/visitor/VisitorBadgePreview';
import QRCheckinStub from '../../components/visitor/QRCheckinStub';
import InboundEmailPanel from '../../components/visitor/InboundEmailPanel';
import CSVImportModal from '../../components/visitor/CSVImportModal';

// Mock data for demonstration
const mockVisitors = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    purpose: 'Business Meeting',
    host: 'Jane Doe',
    host_department: 'Engineering',
    check_in: '2024-01-15T09:30:00Z',
    check_out: '2024-01-15T11:45:00Z',
    status: 'checked_out',
    badge_printed: true,
    qr_code: 'QR001',
    notes: 'Meeting about new project collaboration',
    documents: ['NDA.pdf', 'Business_Card.jpg']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Design Studio',
    email: 'sarah@designstudio.com',
    phone: '+1 (555) 234-5678',
    purpose: 'Client Presentation',
    host: 'Mike Wilson',
    host_department: 'Sales',
    check_in: '2024-01-15T14:00:00Z',
    check_out: null,
    status: 'checked_in',
    badge_printed: true,
    qr_code: 'QR002',
    notes: 'Presenting new design concepts',
    documents: ['Portfolio.pdf']
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Consulting Group',
    email: 'michael@consulting.com',
    phone: '+1 (555) 345-6789',
    purpose: 'Interview',
    host: 'Lisa Chen',
    host_department: 'HR',
    check_in: '2024-01-15T10:00:00Z',
    check_out: '2024-01-15T12:00:00Z',
    status: 'checked_out',
    badge_printed: false,
    qr_code: 'QR003',
    notes: 'Senior developer position interview',
    documents: ['Resume.pdf', 'References.pdf']
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Marketing Agency',
    email: 'emily@marketing.com',
    phone: '+1 (555) 456-7890',
    purpose: 'Vendor Meeting',
    host: 'David Lee',
    host_department: 'Marketing',
    check_in: '2024-01-16T09:00:00Z',
    check_out: null,
    status: 'checked_in',
    badge_printed: true,
    qr_code: 'QR004',
    notes: 'Discussing new marketing campaign',
    documents: ['Proposal.pdf']
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Security Solutions',
    email: 'robert@security.com',
    phone: '+1 (555) 567-8901',
    purpose: 'Security Audit',
    host: 'Jennifer Taylor',
    host_department: 'IT',
    check_in: '2024-01-16T13:30:00Z',
    check_out: '2024-01-16T17:00:00Z',
    status: 'checked_out',
    badge_printed: true,
    qr_code: 'QR005',
    notes: 'Quarterly security assessment',
    documents: ['Audit_Report.pdf', 'Certificate.pdf']
  }
];

const purposes = [
  { value: 'all', label: 'All Purposes' },
  { value: 'Business Meeting', label: 'Business Meeting' },
  { value: 'Client Presentation', label: 'Client Presentation' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Vendor Meeting', label: 'Vendor Meeting' },
  { value: 'Security Audit', label: 'Security Audit' },
  { value: 'Training', label: 'Training' },
  { value: 'Delivery', label: 'Delivery' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Other', label: 'Other' }
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'scheduled', label: 'Scheduled' }
];

export default function VisitorLog() {
  const [visitors, setVisitors] = useState(mockVisitors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Filter and search visitors
  const filteredVisitors = useMemo(() => {
    let filtered = visitors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(visitor =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.host.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Purpose filter
    if (selectedPurpose !== 'all') {
      filtered = filtered.filter(visitor => visitor.purpose === selectedPurpose);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(visitor => visitor.status === selectedStatus);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(visitor => {
        const visitorDate = new Date(visitor.check_in).toDateString();
        return visitorDate === filterDate;
      });
    }

    return filtered;
  }, [visitors, searchTerm, selectedPurpose, selectedStatus, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex);

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Visitor',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600">
              {value.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-slate-900">{value}</div>
            <div className="text-sm text-slate-500">{row.company}</div>
          </div>
        </div>
      )
    },
    {
      key: 'purpose',
      label: 'Purpose',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'host',
      label: 'Host',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.host_department}</div>
        </div>
      )
    },
    {
      key: 'check_in',
      label: 'Check In',
      sortable: true,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'check_out',
      label: 'Check Out',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          checked_in: { bg: 'bg-green-100', text: 'text-green-800', label: 'Checked In' },
          checked_out: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Checked Out' },
          scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Scheduled' }
        };
        const config = statusConfig[value] || statusConfig.checked_in;
        return (
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'badge_printed',
      label: 'Badge',
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Printed
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Not Printed
            </span>
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
            onClick={() => {
              setSelectedVisitor(row);
              setIsBadgeModalOpen(true);
            }}
          >
            Badge
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedVisitor(row);
              setIsQRModalOpen(true);
            }}
          >
            QR Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle check out
              if (row.status === 'checked_in') {
                setVisitors(prev => prev.map(v => 
                  v.id === row.id 
                    ? { ...v, status: 'checked_out', check_out: new Date().toISOString() }
                    : v
                ));
              }
            }}
            disabled={row.status === 'checked_out'}
          >
            {row.status === 'checked_in' ? 'Check Out' : 'Checked Out'}
          </Button>
        </div>
      )
    }
  ];

  // Handle sorting
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  // Handle search
  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Handle add visitor
  const handleAddVisitor = (visitorData) => {
    const newVisitor = {
      ...visitorData,
      id: (visitors.length + 1).toString(),
      check_in: new Date().toISOString(),
      check_out: null,
      status: 'checked_in',
      badge_printed: false,
      qr_code: `QR${String(visitors.length + 1).padStart(3, '0')}`,
      documents: []
    };
    setVisitors([newVisitor, ...visitors]);
    setIsAddModalOpen(false);
  };

  // Handle CSV import
  const handleCSVImport = (importedVisitors) => {
    const newVisitors = importedVisitors.map((visitor, index) => ({
      ...visitor,
      id: (visitors.length + index + 1).toString(),
      check_in: visitor.check_in || new Date().toISOString(),
      check_out: visitor.check_out || null,
      status: visitor.status || 'scheduled',
      badge_printed: false,
      qr_code: `QR${String(visitors.length + index + 1).padStart(3, '0')}`,
      documents: []
    }));
    setVisitors([...newVisitors, ...visitors]);
    setIsCSVModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Visitor Log</h1>
              <p className="mt-2 text-slate-600">
                Manage visitor check-ins, badges, and access control
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEmailModalOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              >
                Inbound Emails
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCSVModalOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                }
              >
                Import CSV
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                New Visitor
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search visitors by name, company, email, or host..."
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                onChange={handleSearch}
              />
            </div>
            <DatePicker
              value={dateFilter}
              onChange={setDateFilter}
              placeholder="Filter by date"
            />
            <Select
              options={purposes}
              value={selectedPurpose}
              onChange={setSelectedPurpose}
              placeholder="Filter by purpose"
            />
            <Select
              options={statuses}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Filter by status"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredVisitors.length)} of {filteredVisitors.length} visitors
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Show:</span>
            <Select
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' }
              ]}
              value={itemsPerPage.toString()}
              onChange={(value) => handleItemsPerPageChange(value)}
              className="w-20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <Table
            data={paginatedVisitors}
            columns={columns}
            sortable={true}
            onSort={handleSort}
            className="min-w-full"
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Visitor Entry Form Modal */}
      <VisitorEntryForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddVisitor}
      />

      {/* Visitor Badge Preview Modal */}
      <VisitorBadgePreview
        visitor={selectedVisitor}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />

      {/* QR Check-in Stub Modal */}
      <QRCheckinStub
        visitor={selectedVisitor}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* Inbound Email Panel Modal */}
      <InboundEmailPanel
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImport={handleCSVImport}
      />
    </div>
  );
}
