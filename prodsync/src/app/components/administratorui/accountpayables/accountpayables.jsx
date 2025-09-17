'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AccountPayables = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    vendorId: '',
    invoiceNumber: '',
    date: '',
    dueDate: '',
    amount: '',
    description: '',
    category: ''
  });
  const [vendorForm, setVendorForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    paymentTerms: 'Net 30'
  });

  // Custom styles for modal animations
  const modalStyles = `
    @keyframes modalSlideIn {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      50% {
        opacity: 0.8;
        transform: translateY(-5px) scale(1.02);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .modal-popup {
      animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .modal-backdrop {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { 
        opacity: 0; 
        backdrop-filter: blur(0px);
      }
      to { 
        opacity: 1; 
        backdrop-filter: blur(4px);
      }
    }
    .modal-popup:hover {
      transform: scale(1.01);
      transition: transform 0.2s ease;
    }
  `;

  // Sample data - in real app, this would come from API/database
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      contact: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Tech City, TC 12345',
      taxId: '12-3456789',
      paymentTerms: 'Net 30',
      totalOwed: 15420.50,
      lastPayment: '2024-01-15'
    },
    {
      id: 2,
      name: 'Office Supplies Co.',
      contact: 'Sarah Johnson',
      email: 'sarah@officesupplies.com',
      phone: '+1 (555) 987-6543',
      address: '456 Supply St, Office City, OC 67890',
      taxId: '98-7654321',
      paymentTerms: 'Net 15',
      totalOwed: 3250.75,
      lastPayment: '2024-01-10'
    },
    {
      id: 3,
      name: 'Marketing Agency Pro',
      contact: 'Mike Davis',
      email: 'mike@marketingpro.com',
      phone: '+1 (555) 456-7890',
      address: '789 Marketing Blvd, Ad City, AC 54321',
      taxId: '45-6789012',
      paymentTerms: 'Net 45',
      totalOwed: 8750.00,
      lastPayment: '2024-01-05'
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      vendorId: 1,
      vendorName: 'Tech Solutions Inc.',
      invoiceNumber: 'TS-2024-001',
      date: '2024-01-20',
      dueDate: '2024-02-19',
      amount: 5250.00,
      status: 'pending',
      description: 'Software licensing and maintenance',
      category: 'Technology',
      approvedBy: null,
      approvedDate: null
    },
    {
      id: 'INV-002',
      vendorId: 2,
      vendorName: 'Office Supplies Co.',
      invoiceNumber: 'OS-2024-015',
      date: '2024-01-18',
      dueDate: '2024-02-02',
      amount: 1250.75,
      status: 'approved',
      description: 'Office supplies and equipment',
      category: 'Office Supplies',
      approvedBy: 'Jane Admin',
      approvedDate: '2024-01-19'
    },
    {
      id: 'INV-003',
      vendorId: 3,
      vendorName: 'Marketing Agency Pro',
      invoiceNumber: 'MAP-2024-008',
      date: '2024-01-15',
      dueDate: '2024-02-29',
      amount: 8750.00,
      status: 'overdue',
      description: 'Digital marketing campaign services',
      category: 'Marketing',
      approvedBy: 'John Manager',
      approvedDate: '2024-01-16'
    },
    {
      id: 'INV-004',
      vendorId: 1,
      vendorName: 'Tech Solutions Inc.',
      invoiceNumber: 'TS-2024-002',
      date: '2024-01-25',
      dueDate: '2024-02-24',
      amount: 3200.00,
      status: 'paid',
      description: 'IT consulting services',
      category: 'Technology',
      approvedBy: 'Jane Admin',
      approvedDate: '2024-01-26'
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: 'PAY-001',
      invoiceId: 'INV-004',
      vendorName: 'Tech Solutions Inc.',
      amount: 3200.00,
      paymentDate: '2024-01-28',
      method: 'ACH Transfer',
      reference: 'ACH-2024-001',
      status: 'completed'
    }
  ]);

  // Calculate metrics
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingApproval = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalVendors = vendors.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon className="h-4 w-4" />;
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApproveInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'approved', approvedBy: 'Current User', approvedDate: new Date().toISOString().split('T')[0] }
        : inv
    ));
  };

  const handlePayInvoice = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      ));
      
      // Add payment record
      const newPayment = {
        id: `PAY-${Date.now()}`,
        invoiceId: invoiceId,
        vendorName: invoice.vendorName,
        amount: invoice.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'ACH Transfer',
        reference: `ACH-2024-${Date.now()}`,
        status: 'completed'
      };
      setPayments(prev => [...prev, newPayment]);
    }
  };

  const handleInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    
    const selectedVendor = vendors.find(v => v.id === parseInt(invoiceForm.vendorId));
    if (!selectedVendor) return;

    const newInvoice = {
      id: `INV-${Date.now()}`,
      vendorId: parseInt(invoiceForm.vendorId),
      vendorName: selectedVendor.name,
      invoiceNumber: invoiceForm.invoiceNumber,
      date: invoiceForm.date,
      dueDate: invoiceForm.dueDate,
      amount: parseFloat(invoiceForm.amount),
      status: 'pending',
      description: invoiceForm.description,
      category: invoiceForm.category,
      approvedBy: null,
      approvedDate: null
    };

    setInvoices(prev => [...prev, newInvoice]);
    setShowAddInvoice(false);
    setInvoiceForm({
      vendorId: '',
      invoiceNumber: '',
      date: '',
      dueDate: '',
      amount: '',
      description: '',
      category: ''
    });
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      vendorId: '',
      invoiceNumber: '',
      date: '',
      dueDate: '',
      amount: '',
      description: '',
      category: ''
    });
    setShowAddInvoice(false);
  };

  const handleVendorFormChange = (e) => {
    const { name, value } = e.target;
    setVendorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    
    const newVendor = {
      id: Math.max(...vendors.map(v => v.id)) + 1,
      name: vendorForm.name,
      contact: vendorForm.contact,
      email: vendorForm.email,
      phone: vendorForm.phone,
      address: vendorForm.address,
      taxId: vendorForm.taxId,
      paymentTerms: vendorForm.paymentTerms,
      totalOwed: 0,
      lastPayment: null
    };

    setVendors(prev => [...prev, newVendor]);
    setShowAddVendor(false);
    setVendorForm({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      paymentTerms: 'Net 30'
    });
  };

  const resetVendorForm = () => {
    setVendorForm({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      paymentTerms: 'Net 30'
    });
    setShowAddVendor(false);
  };

  return (
    <>
      {/* Custom styles for modal animations */}
      <style jsx>{modalStyles}</style>
      
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Payables</h1>
        <p className="text-gray-600">Manage vendor invoices, payments, and financial obligations</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">${totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900">${overdueAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">${pendingApproval.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
              { id: 'invoices', name: 'Invoices', icon: DocumentTextIcon },
              { id: 'vendors', name: 'Vendors', icon: BuildingOfficeIcon },
              { id: 'payments', name: 'Payments', icon: CurrencyDollarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Invoices */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{invoice.date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.vendorName}</div>
                        <div className="text-sm text-gray-500">{invoice.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {invoice.status === 'pending' && (
                            <button 
                              onClick={() => handleApproveInvoice(invoice.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                          {invoice.status === 'approved' && (
                            <button 
                              onClick={() => handlePayInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <CurrencyDollarIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Payments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {invoices
                  .filter(inv => inv.status === 'approved' || inv.status === 'overdue')
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .slice(0, 3)
                  .map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.vendorName}</div>
                        <div className="text-sm text-gray-500">{invoice.invoiceNumber} - Due {invoice.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${invoice.amount.toLocaleString()}</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Invoice Management</h3>
              <button
                onClick={() => setShowAddInvoice(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Invoice
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                </select>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.vendorName}</div>
                      <div className="text-sm text-gray-500">{invoice.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {invoice.status === 'pending' && (
                          <button 
                            onClick={() => handleApproveInvoice(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        {invoice.status === 'approved' && (
                          <button 
                            onClick={() => handlePayInvoice(invoice.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Mark as Paid"
                          >
                            <CurrencyDollarIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900" title="Print">
                          <PrinterIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Vendor Management</h3>
              <button
                onClick={() => setShowAddVendor(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Vendor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Owed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.taxId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{vendor.contact}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                        <div className="text-sm text-gray-500">{vendor.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.paymentTerms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${vendor.totalOwed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.lastPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">${selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.vendorName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInvoice.dueDate}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInvoice.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusIcon(selectedInvoice.status)}
                    <span className="ml-1 capitalize">{selectedInvoice.status}</span>
                  </span>
                </div>
                
                {selectedInvoice.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved By</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInvoice.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedInvoice.approvedDate}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedInvoice.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleApproveInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve Invoice
                  </button>
                )}
                {selectedInvoice.status === 'approved' && (
                  <button
                    onClick={() => {
                      handlePayInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoice && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetInvoiceForm();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add New Invoice</h3>
                  <p className="text-sm text-gray-600 mt-1">Create a new invoice entry</p>
                </div>
                <button
                  onClick={resetInvoiceForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form id="invoice-form" onSubmit={handleAddInvoice} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vendor *
                      </label>
                      <select
                        name="vendorId"
                        value={invoiceForm.vendorId}
                        onChange={handleInvoiceFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map(vendor => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Invoice Number *
                      </label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceForm.invoiceNumber}
                        onChange={handleInvoiceFormChange}
                        required
                        placeholder="e.g., INV-2024-001"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Invoice Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={invoiceForm.date}
                        onChange={handleInvoiceFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={invoiceForm.dueDate}
                        onChange={handleInvoiceFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={invoiceForm.amount}
                        onChange={handleInvoiceFormChange}
                        required
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={invoiceForm.category}
                        onChange={handleInvoiceFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={invoiceForm.description}
                      onChange={handleInvoiceFormChange}
                      required
                      rows={3}
                      placeholder="Describe the goods or services..."
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetInvoiceForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="invoice-form"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetVendorForm();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add New Vendor</h3>
                  <p className="text-sm text-gray-600 mt-1">Create a new vendor entry</p>
                </div>
                <button
                  onClick={resetVendorForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form id="vendor-form" onSubmit={handleAddVendor} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={vendorForm.name}
                        onChange={handleVendorFormChange}
                        required
                        placeholder="e.g., ABC Corporation"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={vendorForm.contact}
                        onChange={handleVendorFormChange}
                        required
                        placeholder="e.g., John Smith"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={vendorForm.email}
                        onChange={handleVendorFormChange}
                        required
                        placeholder="e.g., contact@company.com"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={vendorForm.phone}
                        onChange={handleVendorFormChange}
                        required
                        placeholder="e.g., +1 (555) 123-4567"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tax ID *
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={vendorForm.taxId}
                        onChange={handleVendorFormChange}
                        required
                        placeholder="e.g., 12-3456789"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Terms *
                      </label>
                      <select
                        name="paymentTerms"
                        value={vendorForm.paymentTerms}
                        onChange={handleVendorFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 45">Net 45</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Due on Receipt">Due on Receipt</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={vendorForm.address}
                      onChange={handleVendorFormChange}
                      required
                      rows={3}
                      placeholder="Enter complete business address..."
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetVendorForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="vendor-form"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AccountPayables;

