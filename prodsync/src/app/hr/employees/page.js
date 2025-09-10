'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui/Modal';
import { cn, debounce } from '../../../lib/utils';
import EmployeeProfileSlideover from '../../../components/hr/EmployeeProfileSlideover';
import CSVImportModal from '../../../components/hr/CSVImportModal';
import AddEmployeeModal from '../../../components/hr/AddEmployeeModal';

// Mock data for demonstration
const mockEmployees = [
  {
    id: '1',
    name: 'John Smith',
    employee_id: 'EMP001',
    role: 'Software Engineer',
    department: 'Engineering',
    hire_date: '2023-01-15',
    status: 'active',
    documents: ['contract.pdf', 'id_copy.pdf'],
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    manager: 'Jane Doe',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    employee_id: 'EMP002',
    role: 'Product Manager',
    department: 'Product',
    hire_date: '2022-08-20',
    status: 'active',
    documents: ['contract.pdf', 'background_check.pdf'],
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    manager: 'Mike Wilson',
    location: 'New York, NY'
  },
  {
    id: '3',
    name: 'Michael Brown',
    employee_id: 'EMP003',
    role: 'UX Designer',
    department: 'Design',
    hire_date: '2023-03-10',
    status: 'active',
    documents: ['contract.pdf'],
    email: 'michael.brown@company.com',
    phone: '+1 (555) 345-6789',
    manager: 'Lisa Chen',
    location: 'Austin, TX'
  },
  {
    id: '4',
    name: 'Emily Davis',
    employee_id: 'EMP004',
    role: 'Marketing Specialist',
    department: 'Marketing',
    hire_date: '2022-11-05',
    status: 'on_leave',
    documents: ['contract.pdf', 'leave_request.pdf'],
    email: 'emily.davis@company.com',
    phone: '+1 (555) 456-7890',
    manager: 'David Lee',
    location: 'Seattle, WA'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    employee_id: 'EMP005',
    role: 'Sales Representative',
    department: 'Sales',
    hire_date: '2023-06-01',
    status: 'active',
    documents: ['contract.pdf', 'commission_agreement.pdf'],
    email: 'robert.wilson@company.com',
    phone: '+1 (555) 567-8901',
    manager: 'Jennifer Taylor',
    location: 'Chicago, IL'
  }
];

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' }
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'terminated', label: 'Terminated' }
];

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(employee => employee.status === selectedStatus);
    }

    return filtered;
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
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
            <div className="text-sm text-slate-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'employee_id',
      label: 'Employee ID',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'hire_date',
      label: 'Hire Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
          on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'On Leave' },
          terminated: { bg: 'bg-red-100', text: 'text-red-800', label: 'Terminated' }
        };
        const config = statusConfig[value] || statusConfig.active;
        return (
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.bg, config.text)}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'documents',
      label: 'Documents',
      render: (value) => (
        <div className="flex items-center">
          <svg className="h-4 w-4 text-slate-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-slate-600">{value.length} files</span>
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
              setSelectedEmployee(row);
              setIsProfileOpen(true);
            }}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle edit
              console.log('Edit employee:', row.id);
            }}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  // Handle sorting
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    // In a real app, you would sort the data here or make an API call
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

  // Handle add employee
  const handleAddEmployee = (employeeData) => {
    const newEmployee = {
      ...employeeData,
      id: (employees.length + 1).toString(),
      documents: []
    };
    setEmployees([...employees, newEmployee]);
    setIsAddModalOpen(false);
  };

  // Handle CSV import
  const handleCSVImport = (importedEmployees) => {
    const newEmployees = importedEmployees.map((emp, index) => ({
      ...emp,
      id: (employees.length + index + 1).toString()
    }));
    setEmployees([...employees, ...newEmployees]);
    setIsCSVModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Employee Directory</h1>
              <p className="mt-2 text-slate-600">
                Manage your organization's employee information and records
              </p>
            </div>
            <div className="flex items-center space-x-3">
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
                Add Employee
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search employees by name, ID, email, or role..."
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                onChange={handleSearch}
              />
            </div>
            <Select
              options={departments}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Filter by department"
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
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
            data={paginatedEmployees}
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

      {/* Employee Profile Slideover */}
      <EmployeeProfileSlideover
        employee={selectedEmployee}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
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
