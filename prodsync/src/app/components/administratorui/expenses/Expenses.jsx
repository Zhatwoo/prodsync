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
  ReceiptPercentIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PaperClipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Expenses = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [expenseForm, setExpenseForm] = useState({
    employeeId: '',
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    date: '',
    paymentMethod: 'Personal Card',
    receipt: '',
    notes: ''
  });

  // Sample data - in real app, this would come from API/database
  const [expenses, setExpenses] = useState([
    {
      id: 'EXP-001',
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      department: 'Sales',
      category: 'Travel',
      subcategory: 'Business Trip',
      description: 'Client meeting in New York',
      amount: 1250.00,
      currency: 'USD',
      date: '2024-01-20',
      submittedDate: '2024-01-21',
      status: 'pending',
      paymentMethod: 'Corporate Card',
      receipt: 'receipt_001.pdf',
      approvedBy: null,
      approvedDate: null,
      reimbursedAmount: 0,
      reimbursedDate: null,
      notes: 'Flight and hotel for client presentation'
    },
    {
      id: 'EXP-002',
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      category: 'Meals & Entertainment',
      subcategory: 'Client Entertainment',
      description: 'Client dinner at restaurant',
      amount: 180.50,
      currency: 'USD',
      date: '2024-01-18',
      submittedDate: '2024-01-19',
      status: 'approved',
      paymentMethod: 'Personal Card',
      receipt: 'receipt_002.pdf',
      approvedBy: 'Jane Manager',
      approvedDate: '2024-01-20',
      reimbursedAmount: 180.50,
      reimbursedDate: '2024-01-22',
      notes: 'Business development dinner'
    },
    {
      id: 'EXP-003',
      employeeId: 'EMP-003',
      employeeName: 'Mike Davis',
      department: 'IT',
      category: 'Office Supplies',
      subcategory: 'Equipment',
      description: 'Software license renewal',
      amount: 450.00,
      currency: 'USD',
      date: '2024-01-15',
      submittedDate: '2024-01-16',
      status: 'rejected',
      paymentMethod: 'Corporate Card',
      receipt: 'receipt_003.pdf',
      approvedBy: null,
      approvedDate: null,
      reimbursedAmount: 0,
      reimbursedDate: null,
      notes: 'Annual software subscription - budget exceeded'
    },
    {
      id: 'EXP-004',
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      department: 'Sales',
      category: 'Transportation',
      subcategory: 'Local Travel',
      description: 'Taxi to client office',
      amount: 35.00,
      currency: 'USD',
      date: '2024-01-25',
      submittedDate: '2024-01-25',
      status: 'reimbursed',
      paymentMethod: 'Cash',
      receipt: 'receipt_004.pdf',
      approvedBy: 'Jane Manager',
      approvedDate: '2024-01-26',
      reimbursedAmount: 35.00,
      reimbursedDate: '2024-01-28',
      notes: 'Local client visit'
    },
    {
      id: 'EXP-005',
      employeeId: 'EMP-004',
      employeeName: 'Lisa Chen',
      department: 'HR',
      category: 'Training & Development',
      subcategory: 'Conference',
      description: 'HR Conference 2024',
      amount: 850.00,
      currency: 'USD',
      date: '2024-01-10',
      submittedDate: '2024-01-12',
      status: 'approved',
      paymentMethod: 'Corporate Card',
      receipt: 'receipt_005.pdf',
      approvedBy: 'Tom Director',
      approvedDate: '2024-01-13',
      reimbursedAmount: 0,
      reimbursedDate: null,
      notes: 'Professional development conference'
    }
  ]);

  const [categories] = useState([
    { name: 'Travel', subcategories: ['Business Trip', 'Local Travel', 'Accommodation'] },
    { name: 'Meals & Entertainment', subcategories: ['Client Entertainment', 'Team Lunch', 'Business Meals'] },
    { name: 'Office Supplies', subcategories: ['Equipment', 'Stationery', 'Software'] },
    { name: 'Transportation', subcategories: ['Local Travel', 'Parking', 'Public Transport'] },
    { name: 'Training & Development', subcategories: ['Conference', 'Course', 'Certification'] },
    { name: 'Communication', subcategories: ['Phone', 'Internet', 'Software License'] },
    { name: 'Other', subcategories: ['Miscellaneous', 'Emergency', 'Special Project'] }
  ]);

  const [employees] = useState([
    { id: 'EMP-001', name: 'John Smith', department: 'Sales' },
    { id: 'EMP-002', name: 'Sarah Johnson', department: 'Marketing' },
    { id: 'EMP-003', name: 'Mike Davis', department: 'IT' },
    { id: 'EMP-004', name: 'Lisa Chen', department: 'HR' },
    { id: 'EMP-005', name: 'David Wilson', department: 'Finance' }
  ]);

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses
    .filter(exp => exp.status === 'pending')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses
    .filter(exp => exp.status === 'approved')
    .reduce((sum, exp) => sum + exp.amount, 0);
  const reimbursedExpenses = expenses
    .filter(exp => exp.status === 'reimbursed')
    .reduce((sum, exp) => sum + exp.reimbursedAmount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'reimbursed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reimbursed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'rejected': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Corporate Card': return <CreditCardIcon className="h-4 w-4" />;
      case 'Personal Card': return <CreditCardIcon className="h-4 w-4" />;
      case 'Cash': return <BanknotesIcon className="h-4 w-4" />;
      default: return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesEmployee = selectedEmployee === 'all' || expense.employeeId === selectedEmployee;
    return matchesSearch && matchesStatus && matchesCategory && matchesEmployee;
  });

  const handleApproveExpense = (expenseId) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId 
        ? { ...exp, status: 'approved', approvedBy: 'Current User', approvedDate: new Date().toISOString().split('T')[0] }
        : exp
    ));
  };

  const handleRejectExpense = (expenseId) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId 
        ? { ...exp, status: 'rejected', approvedBy: 'Current User', approvedDate: new Date().toISOString().split('T')[0] }
        : exp
    ));
  };

  const handleReimburseExpense = (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (expense) {
      setExpenses(prev => prev.map(exp => 
        exp.id === expenseId 
          ? { ...exp, status: 'reimbursed', reimbursedAmount: exp.amount, reimbursedDate: new Date().toISOString().split('T')[0] }
          : exp
      ));
    }
  };

  const getCategoryExpenses = () => {
    const categoryTotals = {};
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
      percentage: (total / totalExpenses) * 100
    })).sort((a, b) => b.total - a.total);
  };

  const handleExpenseFormChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    
    const selectedEmp = employees.find(emp => emp.id === expenseForm.employeeId);
    if (!selectedEmp) return;

    const newExpense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      employeeId: expenseForm.employeeId,
      employeeName: selectedEmp.name,
      department: selectedEmp.department,
      category: expenseForm.category,
      subcategory: expenseForm.subcategory,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      currency: 'USD',
      date: expenseForm.date,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: expenseForm.paymentMethod,
      receipt: expenseForm.receipt,
      approvedBy: null,
      approvedDate: null,
      reimbursedAmount: 0,
      reimbursedDate: null,
      notes: expenseForm.notes
    };

    setExpenses(prev => [...prev, newExpense]);
    setShowAddExpense(false);
    setExpenseForm({
      employeeId: '',
      category: '',
      subcategory: '',
      description: '',
      amount: '',
      date: '',
      paymentMethod: 'Personal Card',
      receipt: '',
      notes: ''
    });
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      employeeId: '',
      category: '',
      subcategory: '',
      description: '',
      amount: '',
      date: '',
      paymentMethod: 'Personal Card',
      receipt: '',
      notes: ''
    });
    setShowAddExpense(false);
  };

  const handleGenerateReport = (reportType) => {
    // In a real app, this would generate and download a report
    alert(`${reportType} report generated successfully!`);
  };

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

  return (
    <>
      {/* Custom styles for modal animations */}
      <style jsx>{modalStyles}</style>
      
      <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
        <p className="text-gray-600">Track, approve, and manage employee expenses and reimbursements</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">${pendingExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">${approvedExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ReceiptPercentIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reimbursed</p>
              <p className="text-2xl font-bold text-gray-900">${reimbursedExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'expenses', name: 'Expenses', icon: DocumentTextIcon },
              { id: 'categories', name: 'Categories', icon: ReceiptPercentIcon },
              { id: 'reports', name: 'Reports', icon: ChartBarIcon }
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
          {/* Recent Expenses */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{expense.id}</div>
                          <div className="text-sm text-gray-500">{expense.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expense.employeeName}</div>
                        <div className="text-sm text-gray-500">{expense.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{expense.category}</div>
                        <div className="text-sm text-gray-500">{expense.subcategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {getStatusIcon(expense.status)}
                          <span className="ml-1 capitalize">{expense.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedExpense(expense)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {expense.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveExpense(expense.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectExpense(expense.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {expense.status === 'approved' && (
                            <button 
                              onClick={() => handleReimburseExpense(expense.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Reimburse"
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

          {/* Expense Categories Breakdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Expense Categories</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {getCategoryExpenses().map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-gray-500">${item.total.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Expense Management</h3>
              <button
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="reimbursed">Reimbursed</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expense Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{expense.employeeName}</div>
                        <div className="text-sm text-gray-500">{expense.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{expense.category}</div>
                        <div className="text-sm text-gray-500">{expense.subcategory}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{expense.description}</div>
                      {expense.receipt && (
                        <div className="flex items-center mt-1">
                          <PaperClipIcon className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{expense.receipt}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        <span className="ml-1 capitalize">{expense.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedExpense(expense)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {expense.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveExpense(expense.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {expense.status === 'approved' && (
                          <button 
                            onClick={() => handleReimburseExpense(expense.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reimburse"
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

      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Expense Categories</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{category.name}</h4>
                  <div className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{subcategory}</span>
                        <span className="text-gray-400">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Monthly Summary</h4>
                <p className="text-sm text-gray-600">Generate monthly expense reports by department and category</p>
                <button 
                  onClick={() => handleGenerateReport('Monthly Summary')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Employee Summary</h4>
                <p className="text-sm text-gray-600">View individual employee expense summaries and trends</p>
                <button 
                  onClick={() => handleGenerateReport('Employee Summary')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Expense Details</h3>
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expense ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedExpense.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">${selectedExpense.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedExpense.employeeName}</p>
                    <p className="text-xs text-gray-500">{selectedExpense.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedExpense.category}</p>
                    <p className="text-xs text-gray-500">{selectedExpense.subcategory}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedExpense.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="mt-1 flex items-center">
                      {getPaymentMethodIcon(selectedExpense.paymentMethod)}
                      <span className="ml-1 text-sm text-gray-900">{selectedExpense.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedExpense.description}</p>
                </div>
                
                {selectedExpense.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedExpense.notes}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedExpense.status)}`}>
                    {getStatusIcon(selectedExpense.status)}
                    <span className="ml-1 capitalize">{selectedExpense.status}</span>
                  </span>
                </div>
                
                {selectedExpense.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved By</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedExpense.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedExpense.approvedDate}</p>
                    </div>
                  </div>
                )}
                
                {selectedExpense.reimbursedAmount > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reimbursed Amount</label>
                      <p className="mt-1 text-sm text-gray-900">${selectedExpense.reimbursedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reimbursed Date</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedExpense.reimbursedDate}</p>
                    </div>
                  </div>
                )}
                
                {selectedExpense.receipt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Receipt</label>
                    <div className="mt-1 flex items-center">
                      <PaperClipIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{selectedExpense.receipt}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedExpense.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveExpense(selectedExpense.id);
                        setSelectedExpense(null);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectExpense(selectedExpense.id);
                        setSelectedExpense(null);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedExpense.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleReimburseExpense(selectedExpense.id);
                      setSelectedExpense(null);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Reimburse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetExpenseForm();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-popup">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Add New Expense</h3>
                  <p className="text-sm text-gray-600 mt-1">Create a new expense entry</p>
                </div>
                <button
                  onClick={resetExpenseForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form id="expense-form" onSubmit={handleAddExpense} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Expense Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Employee *
                      </label>
                      <select
                        name="employeeId"
                        value={expenseForm.employeeId}
                        onChange={handleExpenseFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} ({employee.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={expenseForm.category}
                        onChange={handleExpenseFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subcategory *
                      </label>
                      <select
                        name="subcategory"
                        value={expenseForm.subcategory}
                        onChange={handleExpenseFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Subcategory</option>
                        {expenseForm.category && categories.find(cat => cat.name === expenseForm.category)?.subcategories.map(sub => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={expenseForm.amount}
                        onChange={handleExpenseFormChange}
                        required
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={expenseForm.date}
                        onChange={handleExpenseFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={expenseForm.paymentMethod}
                        onChange={handleExpenseFormChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="Personal Card">Personal Card</option>
                        <option value="Corporate Card">Corporate Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={expenseForm.description}
                      onChange={handleExpenseFormChange}
                      required
                      rows={3}
                      placeholder="Describe the expense..."
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Receipt File
                    </label>
                    <input
                      type="text"
                      name="receipt"
                      value={expenseForm.receipt}
                      onChange={handleExpenseFormChange}
                      placeholder="e.g., receipt_001.pdf"
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={expenseForm.notes}
                      onChange={handleExpenseFormChange}
                      rows={2}
                      placeholder="Additional notes or comments..."
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
                  onClick={resetExpenseForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="expense-form"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Expense
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

export default Expenses;

