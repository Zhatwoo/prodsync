'use client';

import { useState } from 'react';
import HrSidebar from '../../components/hrui/HrSidebar';
import PayrollOverview from '../../components/hrui/payrollcomponents/PayrollOverview';
import SalaryStructure from '../../components/hrui/payrollcomponents/SalaryStructure';
import BenefitsAllowances from '../../components/hrui/payrollcomponents/BenefitsAllowances';
import Deductions from '../../components/hrui/payrollcomponents/Deductions';
import PayrollReports from '../../components/hrui/payrollcomponents/PayrollReports';
import TaxManagement from '../../components/hrui/payrollcomponents/TaxManagement';

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState('payrollOverview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'payrollOverview', name: 'Payroll Overview', icon: '💰' },
    { id: 'salaryStructure', name: 'Salary Structure', icon: '📊' },
    { id: 'benefitsAllowances', name: 'Benefits & Allowances', icon: '🎁' },
    { id: 'deductions', name: 'Deductions', icon: '📉' },
    { id: 'payrollReports', name: 'Payroll Reports', icon: '📈' },
    { id: 'taxManagement', name: 'Tax Management', icon: '🧾' }
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
      case 'taxManagement':
        return <TaxManagement />;
      default:
        return <PayrollOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <HrSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16 sm:ml-16' : 'ml-64 sm:ml-72'
      }`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
                  <p className="mt-2 text-gray-600">Manage payroll processing, benefits, deductions, and tax settings</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-green-600">$1.85M</div>
                    <div className="text-sm text-gray-600">Total Gross Pay</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-blue-600">25</div>
                    <div className="text-sm text-gray-600">Active Employees</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-gray-600">Tax Settings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
