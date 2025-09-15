'use client';

import { useState } from 'react';
import HrSidebar from '../../../components/hrui/HrSidebar';
import EmployeeList from '../../../components/hrui/employeesrecordmodal/EmployeeList';
import NewEmployee from '../../../components/hrui/employeesrecordmodal/NewEmployee';
import EmployeeProfile from '../../../components/hrui/employeesrecordmodal/EmployeeProfile';
import DepartmentManagement from '../../../components/hrui/employeesrecordmodal/DepartmentManagement';
import PositionManagement from '../../../components/hrui/employeesrecordmodal/PositionManagement';
import EmployeeDocuments from '../../../components/hrui/employeesrecordmodal/EmployeeDocuments';
import RequireRole from '../../../components/RequireRole';

export default function EmployeesRecordPage() {
  const [activeTab, setActiveTab] = useState('employeeList');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'employeeList', name: 'Employee List', icon: '👥', badge: '247' },
    { id: 'newEmployee', name: 'New Employee', icon: '➕' },
    { id: 'employeeProfile', name: 'Employee Profile', icon: '👤' },
    { id: 'departmentManagement', name: 'Department Management', icon: '🏢', badge: '6' },
    { id: 'positionManagement', name: 'Position Management', icon: '💼', badge: '12' },
    { id: 'employeeDocuments', name: 'Employee Documents', icon: '📄' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'employeeList':
        return <EmployeeList />;
      case 'newEmployee':
        return <NewEmployee />;
      case 'employeeProfile':
        return <EmployeeProfile />;
      case 'departmentManagement':
        return <DepartmentManagement />;
      case 'positionManagement':
        return <PositionManagement />;
      case 'employeeDocuments':
        return <EmployeeDocuments />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <RequireRole allowed={['hr', 'HR', 'HR Manager', 'admin', 'administrator']}>
      <div className="w-full p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-4 sm:mb-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-4 sm:py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Employee Records</h1>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage employee information, departments, and documents</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">247</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Employees</div>
                  </div>
                  <div className="bg-green-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">6</div>
                    <div className="text-xs sm:text-sm text-gray-600">Departments</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">12</div>
                    <div className="text-xs sm:text-sm text-gray-600">Positions</div>
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
                  {tab.badge && (
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
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
    </RequireRole>
  );
}
