'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { cn, debounce } from '../../lib/utils';
import PayRunModal from '../../components/payroll/PayRunModal';
import PayslipPreviewModal from '../../components/payroll/PayslipPreviewModal';
import SalaryComponentsModal from '../../components/payroll/SalaryComponentsModal';
import EmployeePayrollCard from '../../components/payroll/EmployeePayrollCard';

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
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    manager: 'Jane Doe',
    location: 'San Francisco, CA',
    salary: {
      basic: 80000,
      allowances: {
        housing: 12000,
        transport: 3000,
        meal: 2000
      },
      deductions: {
        tax: 12000,
        insurance: 2000,
        retirement: 4000
      }
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    employee_id: 'EMP002',
    role: 'Product Manager',
    department: 'Product',
    hire_date: '2022-08-20',
    status: 'active',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    manager: 'Mike Wilson',
    location: 'New York, NY',
    salary: {
      basic: 95000,
      allowances: {
        housing: 15000,
        transport: 3000,
        meal: 2000
      },
      deductions: {
        tax: 15000,
        insurance: 2500,
        retirement: 4750
      }
    }
  },
  {
    id: '3',
    name: 'Michael Brown',
    employee_id: 'EMP003',
    role: 'UX Designer',
    department: 'Design',
    hire_date: '2023-03-10',
    status: 'active',
    email: 'michael.brown@company.com',
    phone: '+1 (555) 345-6789',
    manager: 'Lisa Chen',
    location: 'Austin, TX',
    salary: {
      basic: 75000,
      allowances: {
        housing: 10000,
        transport: 2500,
        meal: 1500
      },
      deductions: {
        tax: 11000,
        insurance: 1800,
        retirement: 3750
      }
    }
  },
  {
    id: '4',
    name: 'Emily Davis',
    employee_id: 'EMP004',
    role: 'Marketing Specialist',
    department: 'Marketing',
    hire_date: '2022-11-05',
    status: 'active',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 456-7890',
    manager: 'David Lee',
    location: 'Seattle, WA',
    salary: {
      basic: 65000,
      allowances: {
        housing: 8000,
        transport: 2000,
        meal: 1000
      },
      deductions: {
        tax: 9000,
        insurance: 1500,
        retirement: 3250
      }
    }
  },
  {
    id: '5',
    name: 'Robert Wilson',
    employee_id: 'EMP005',
    role: 'Sales Representative',
    department: 'Sales',
    hire_date: '2023-06-01',
    status: 'active',
    email: 'robert.wilson@company.com',
    phone: '+1 (555) 567-8901',
    manager: 'Jennifer Taylor',
    location: 'Chicago, IL',
    salary: {
      basic: 60000,
      allowances: {
        housing: 6000,
        transport: 2000,
        meal: 1000,
        commission: 5000
      },
      deductions: {
        tax: 8000,
        insurance: 1200,
        retirement: 3000
      }
    }
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

export default function PayrollRun() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isPayRunModalOpen, setIsPayRunModalOpen] = useState(false);
  const [isPayslipPreviewOpen, setIsPayslipPreviewOpen] = useState(false);
  const [isSalaryComponentsOpen, setIsSalaryComponentsOpen] = useState(false);
  const [selectedEmployeeForPreview, setSelectedEmployeeForPreview] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [payRunData, setPayRunData] = useState(null);

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

  // Calculate totals
  const totalGrossPay = useMemo(() => {
    return selectedEmployees.reduce((total, emp) => {
      const basic = emp.salary.basic / 12; // Monthly
      const allowances = Object.values(emp.salary.allowances).reduce((sum, val) => sum + val, 0);
      return total + basic + allowances;
    }, 0);
  }, [selectedEmployees]);

  const totalDeductions = useMemo(() => {
    return selectedEmployees.reduce((total, emp) => {
      return total + Object.values(emp.salary.deductions).reduce((sum, val) => sum + val, 0);
    }, 0);
  }, [selectedEmployees]);

  const totalNetPay = totalGrossPay - totalDeductions;

  // Table columns
  const columns = [
    {
      key: 'select',
      label: '',
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedEmployees.some(emp => emp.id === row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedEmployees([...selectedEmployees, row]);
            } else {
              setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== row.id));
            }
          }}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
      )
    },
    {
      key: 'name',
      label: 'Employee',
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
            <div className="text-sm text-slate-500">{row.employee_id}</div>
          </div>
        </div>
      )
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
      key: 'salary',
      label: 'Monthly Gross',
      sortable: true,
      render: (_, row) => {
        const basic = row.salary.basic / 12;
        const allowances = Object.values(row.salary.allowances).reduce((sum, val) => sum + val, 0);
        const gross = basic + allowances;
        return (
          <span className="font-medium text-slate-900">
            ${gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      key: 'deductions',
      label: 'Monthly Deductions',
      render: (_, row) => {
        const deductions = Object.values(row.salary.deductions).reduce((sum, val) => sum + val, 0);
        return (
          <span className="font-medium text-red-600">
            ${deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      key: 'net_pay',
      label: 'Net Pay',
      render: (_, row) => {
        const basic = row.salary.basic / 12;
        const allowances = Object.values(row.salary.allowances).reduce((sum, val) => sum + val, 0);
        const deductions = Object.values(row.salary.deductions).reduce((sum, val) => sum + val, 0);
        const net = basic + allowances - deductions;
        return (
          <span className="font-medium text-green-600">
            ${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      }
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
              setSelectedEmployeeForPreview(row);
              setIsPayslipPreviewOpen(true);
            }}
          >
            Preview Payslip
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

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(paginatedEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  // Handle create pay run
  const handleCreatePayRun = (payRunData) => {
    setPayRunData(payRunData);
    setIsPayRunModalOpen(false);
  };

  // Handle process payroll
  const handleProcessPayroll = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee for payroll processing.');
      return;
    }
    
    // In a real app, this would make an API call
    console.log('Processing payroll for:', selectedEmployees);
    alert(`Payroll processed successfully for ${selectedEmployees.length} employees!`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Payroll Run</h1>
              <p className="mt-2 text-slate-600">
                Process monthly payroll for your employees
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsSalaryComponentsOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                }
              >
                Salary Components
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsPayRunModalOpen(true)}
                leftIcon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Create Pay Run
              </Button>
            </div>
          </div>
        </div>

        {/* Pay Run Summary */}
        {payRunData && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Current Pay Run</h3>
                <p className="text-sm text-slate-600">
                  {payRunData.payPeriod} • {payRunData.payDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Pay Run ID</p>
                <p className="font-medium text-slate-900">{payRunData.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Employees Summary */}
        {selectedEmployees.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{selectedEmployees.length}</p>
                <p className="text-sm text-slate-600">Employees Selected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${totalGrossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-slate-600">Total Gross Pay</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  ${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-slate-600">Total Deductions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${totalNetPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-slate-600">Total Net Pay</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleProcessPayroll}
                size="lg"
                leftIcon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Process Payroll
              </Button>
            </div>
          </div>
        )}

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

      {/* Pay Run Modal */}
      <PayRunModal
        isOpen={isPayRunModalOpen}
        onClose={() => setIsPayRunModalOpen(false)}
        onCreate={handleCreatePayRun}
      />

      {/* Payslip Preview Modal */}
      <PayslipPreviewModal
        employee={selectedEmployeeForPreview}
        isOpen={isPayslipPreviewOpen}
        onClose={() => setIsPayslipPreviewOpen(false)}
      />

      {/* Salary Components Modal */}
      <SalaryComponentsModal
        isOpen={isSalaryComponentsOpen}
        onClose={() => setIsSalaryComponentsOpen(false)}
      />
    </div>
  );
}
