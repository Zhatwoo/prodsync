'use client';

import { useState } from 'react';
import PayrollOverview from '../../components/hrui/payrollcomponents/PayrollOverview';
import SalaryStructure from '../../components/hrui/payrollcomponents/SalaryStructure';
import BenefitsAllowances from '../../components/hrui/payrollcomponents/BenefitsAllowances';
import Deductions from '../../components/hrui/payrollcomponents/Deductions';
import PayrollReports from '../../components/hrui/payrollcomponents/PayrollReports';

export default function AdministratorPayrollPage() {
  const [activeTab, setActiveTab] = useState('payrollOverview');

  const tabs = [
    { id: 'payrollOverview', name: 'Payroll Overview', icon: '💰' },
    { id: 'salaryStructure', name: 'Salary Structure', icon: '📊' },
    { id: 'benefitsAllowances', name: 'Benefits & Allowances', icon: '🎁' },
    { id: 'deductions', name: 'Deductions & Tax', icon: '📉' },
    { id: 'payrollReports', name: 'Payroll Reports', icon: '📈' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'payrollOverview':
        return <PayrollOverview />;
      case 'salaryStructure':
        return <SalaryStructure />;
      case 'benefitsAllowances':
        return <BenefitsAllowances />;
      case 'deductions':
        return <Deductions />;
      case 'payrollReports':
        return <PayrollReports />;
      default:
        return <PayrollOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-4 sm:mb-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Payroll Management</h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Administrator view - Manage payroll processing, benefits, deductions, and tax settings</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-green-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">$1.85M</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Gross Pay</div>
                </div>
                <div className="bg-blue-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">25</div>
                  <div className="text-xs sm:text-sm text-gray-600">Active Employees</div>
                </div>
                <div className="bg-purple-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">8</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tax Settings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4 sm:mb-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto py-2 sm:py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 sm:p-4 lg:p-6">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}
