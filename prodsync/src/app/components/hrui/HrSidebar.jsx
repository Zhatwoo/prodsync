'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tooltip Component
const Tooltip = ({ children, content, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
            position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
            'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default function HrSidebar({ isCollapsed, onToggleCollapse }) {
  const [expandedSections, setExpandedSections] = useState({
    employeeRecord: true,
    payroll: false,
    timeKeeping: false
  });
  const pathname = usePathname();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    onToggleCollapse();
  };


  const sidebarItems = {
    employeeRecord: {
      title: 'Employee Record',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      href: '/hrpage/employeesrecord',
      items: []
    },
    payroll: {
      title: 'Payroll',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      href: '/hrpage/payroll',
      items: []
    },
    timeKeeping: {
      title: 'Time Keeping',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      href: '/hrpage/timekeeping',
      items: []
    }
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16 sm:w-16' : 'w-64 sm:w-72'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 sm:h-20 px-2 sm:px-3 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">HR Portal</h1>
              <p className="text-xs text-gray-500">Human Resources</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold text-gray-900">HR</h1>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        <Tooltip 
          content={
            <div>
              <div className="font-semibold mb-1">{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</div>
              <div className="text-xs opacity-75">Toggle sidebar visibility</div>
            </div>
          }
          position="right"
        >
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-1 sm:px-2 py-4 sm:py-6 space-y-2">
          {Object.entries(sidebarItems).map(([key, section]) => (
            <div key={key} className="mb-3 sm:mb-4">
              {/* Section Header */}
              {section.href ? (
                <Tooltip 
                  content={
                    <div>
                      <div className="font-semibold mb-2">{section.title}</div>
                      <div className="text-xs opacity-90">
                        {key === 'employeeRecord' && (
                          <ul className="space-y-1">
                            <li>• DepartmentManagement</li>
                            <li>• EmployeeDocuments</li>
                            <li>• EmployeeList</li>
                            <li>• EmployeeProfile</li>
                            <li>• NewEmployee</li>
                            <li>• PositionManagement</li>
                          </ul>
                        )}
                        {key === 'payroll' && (
                          <ul className="space-y-1">
                            <li>• BenefitsAllowances</li>
                            <li>• Deductions</li>
                            <li>• PayrollOverview</li>
                            <li>• PayrollReports</li>
                            <li>• SalaryStructure</li>
                            <li>• TaxManagement</li>
                          </ul>
                        )}
                        {key === 'timeKeeping' && (
                          <ul className="space-y-1">
                            <li>• AttendanceOverview</li>
                            <li>• AttendanceReports</li>
                            <li>• LeaveManagement</li>
                            <li>• OvertimeManagement</li>
                            <li>• ScheduleManagement</li>
                            <li>• TimeTracking</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  }
                  position="right"
                >
                  <Link
                    href={section.href}
                    className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg ${section.color} ${
                      isActive(section.href) ? 'ring-2 ring-white ring-opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 w-4 h-4 sm:w-5 sm:h-5">{section.icon}</span>
                      {!isCollapsed && <span className="hidden sm:block">{section.title}</span>}
                      {!isCollapsed && <span className="block sm:hidden text-xs">{section.title.split(' ')[0]}</span>}
                    </div>
                    {!isCollapsed && (
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                </Tooltip>
              ) : (
                <button
                  onClick={() => toggleSection(key)}
                  className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg ${section.color}`}
                >
                  <div className="flex items-center">
                    <span className="mr-2 w-4 h-4 sm:w-5 sm:h-5">{section.icon}</span>
                    {!isCollapsed && <span className="hidden sm:block">{section.title}</span>}
                    {!isCollapsed && <span className="block sm:hidden text-xs">{section.title.split(' ')[0]}</span>}
                  </div>
                  {!isCollapsed && (
                    <svg 
                      className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${expandedSections[key] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              )}

              {/* Section Items */}
              {(!isCollapsed && expandedSections[key] && section.items && section.items.length > 0) && (
                <div className="mt-2 ml-2 sm:ml-4 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 sm:mr-3 text-base sm:text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                        <span className="font-medium truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                          isActive(item.href)
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-1 sm:px-2 py-3 sm:py-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-indigo-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Quick Actions</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Add Employee</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• NewEmployee</li>
                        <li>• EmployeeProfile</li>
                        <li>• DepartmentManagement</li>
                        <li>• PositionManagement</li>
                      </ul>
                    </div>
                  </div>
                }
                position="right"
              >
                <button className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors">
                  <span className="mr-1.5 sm:mr-2 text-sm sm:text-base">⚡</span>
                  <span className="hidden sm:block">Add Employee</span>
                  <span className="block sm:hidden">Add</span>
                </button>
              </Tooltip>
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Generate Report</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• PayrollReports</li>
                        <li>• AttendanceReports</li>
                        <li>• EmployeeReports</li>
                        <li>• DepartmentReports</li>
                      </ul>
                    </div>
                  </div>
                }
                position="right"
              >
                <button className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors">
                  <span className="mr-1.5 sm:mr-2 text-sm sm:text-base">📊</span>
                  <span className="hidden sm:block">Generate Report</span>
                  <span className="block sm:hidden">Report</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}


      {/* User Profile Section */}
      <div className="flex-shrink-0 p-1 sm:p-2 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">HR</span>
          </div>
          {!isCollapsed && (
            <div className="ml-2 sm:ml-3 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">HR Manager</p>
              <p className="text-xs text-gray-500 truncate">hr@company.com</p>
              <div className="flex items-center mt-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
