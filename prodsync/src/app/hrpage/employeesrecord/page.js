'use client';

import { useState } from 'react';
import HrSidebar from '../../components/hrui/HrSidebar';
import EmployeeList from '../../components/hrui/employeesrecordmodal/EmployeeList';
import NewEmployee from '../../components/hrui/employeesrecordmodal/NewEmployee';
import EmployeeProfile from '../../components/hrui/employeesrecordmodal/EmployeeProfile';
import DepartmentManagement from '../../components/hrui/employeesrecordmodal/DepartmentManagement';
import PositionManagement from '../../components/hrui/employeesrecordmodal/PositionManagement';
import EmployeeDocuments from '../../components/hrui/employeesrecordmodal/EmployeeDocuments';

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
                  <h1 className="text-3xl font-bold text-gray-900">Employee Records</h1>
                  <p className="mt-2 text-gray-600">Manage employee information, departments, and documents</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-gray-600">Total Employees</div>
                  </div>
                  <div className="bg-green-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-green-600">6</div>
                    <div className="text-sm text-gray-600">Departments</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Positions</div>
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
