'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tooltip Component
const Tooltip = ({ children, content, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const positionClasses = {
    right: 'left-full ml-1 sm:ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-1 sm:mr-2 top-1/2 -translate-y-1/2',
    top: 'bottom-full mb-1 sm:mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-1 sm:mt-2 left-1/2 -translate-x-1/2',
    cursor: 'fixed pointer-events-none'
  };

  const getCursorPosition = () => {
    if (position === 'cursor') {
      return {
        left: `${mousePosition.x + 15}px`,
        top: `${mousePosition.y - 10}px`,
        transform: 'none'
      };
    }
    return {};
  };

  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute z-[9999] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white bg-gray-900 rounded-lg sm:rounded-xl shadow-2xl whitespace-nowrap max-w-xs transition-all duration-200 ease-out ${
            position === 'cursor' ? positionClasses.cursor : positionClasses[position]
          } ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            ...getCursorPosition(),
            backdropFilter: 'blur(8px)',
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {content}
          {position !== 'cursor' && (
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
              'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2'
            }`}></div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AuditSidebar({ isCollapsed, onToggleCollapse }) {
  const [expandedSections, setExpandedSections] = useState({
    timekeeping: true,
    appsuite: false
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
    timekeeping: {
      title: 'Time Keeping',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      href: '/positionpages/auditpage/timekeeping',
      items: []
    },
    appsuite: {
      title: 'App Suite',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      href: '/positionpages/auditpage/appsuite',
      items: []
    }
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-40 bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-14 sm:w-16' : 'w-60 sm:w-64 md:w-72'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 px-1 sm:px-2 md:px-3 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">Audit Portal</h1>
              <p className="text-xs text-gray-500">Internal Audit</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          position="cursor"
        >
          <button
            onClick={toggleSidebar}
            className="p-1 sm:p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-1 sm:px-2 py-2 sm:py-4 md:py-6 space-y-1 sm:space-y-2">
          {/* Home Button */}
          <div className="mb-2 sm:mb-3 md:mb-4">
            <Tooltip 
              content={
                <div>
                  <div className="font-semibold mb-2">Audit Dashboard</div>
                  <div className="text-xs opacity-90">
                    <ul className="space-y-1">
                      <li>• Audit Overview</li>
                      <li>• System Monitoring</li>
                      <li>• Compliance Tracking</li>
                      <li>• Report Generation</li>
                    </ul>
                  </div>
                </div>
              }
              position="cursor"
            >
              <Link
                href="/positionpages/auditpage"
                className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 ${
                  isActive('/positionpages/auditpage') ? 'ring-2 ring-white ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center min-w-0">
                  <span className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs sm:text-sm truncate">
                      <span className="hidden sm:block">Audit Dashboard</span>
                      <span className="block sm:hidden">Audit</span>
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            </Tooltip>
          </div>
          {Object.entries(sidebarItems).map(([key, section]) => (
            <div key={key} className="mb-2 sm:mb-3 md:mb-4">
              {/* Section Header */}
              {section.href ? (
                <Tooltip 
                  content={
                    <div>
                      <div className="font-semibold mb-2">{section.title}</div>
                      <div className="text-xs opacity-90">
                        {key === 'timekeeping' && (
                          <ul className="space-y-1">
                            <li>• Attendance Overview</li>
                            <li>• Time Tracking</li>
                            <li>• Leave Management</li>
                            <li>• Overtime Management</li>
                            <li>• Schedule Management</li>
                            <li>• Attendance Reports</li>
                          </ul>
                        )}
                        {key === 'appsuite' && (
                          <ul className="space-y-1">
                            <li>• Application Suite</li>
                            <li>• System Tools</li>
                            <li>• Management Interface</li>
                            <li>• Administrative Functions</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  }
                  position="cursor"
                >
                  <Link
                    href={section.href}
                    className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg ${section.color} ${
                      isActive(section.href) ? 'ring-2 ring-white ring-opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center min-w-0">
                      <span className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0">{section.icon}</span>
                      {!isCollapsed && (
                        <span className="text-xs sm:text-sm truncate">
                          <span className="hidden sm:block">{section.title}</span>
                          <span className="block sm:hidden">{section.title.split(' ')[0]}</span>
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
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
                  className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg ${section.color}`}
                >
                  <div className="flex items-center min-w-0">
                    <span className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0">{section.icon}</span>
                    {!isCollapsed && (
                      <span className="text-xs sm:text-sm truncate">
                        <span className="hidden sm:block">{section.title}</span>
                        <span className="block sm:hidden">{section.title.split(' ')[0]}</span>
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <svg 
                      className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-200 ${expandedSections[key] ? 'rotate-180' : ''}`} 
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
                <div className="mt-1 sm:mt-2 ml-2 sm:ml-3 md:ml-4 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center min-w-0">
                        <span className="mr-1.5 sm:mr-2 md:mr-3 text-sm sm:text-base md:text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">{item.icon}</span>
                        <span className="font-medium truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                          isActive(item.href)
                            ? 'bg-orange-200 text-orange-800'
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
        <div className="px-1 sm:px-2 py-2 sm:py-3 md:py-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-orange-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2 md:mb-3">Quick Actions</h3>
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Audit Timekeeping</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• Attendance Reports</li>
                        <li>• Time Tracking Review</li>
                        <li>• Leave Management Audit</li>
                        <li>• Overtime Analysis</li>
                        <li>• Schedule Compliance</li>
                      </ul>
                    </div>
                  </div>
                }
                position="cursor"
              >
                <Link 
                  href="/positionpages/auditpage/timekeeping"
                  className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <span className="mr-1 sm:mr-1.5 md:mr-2 text-sm sm:text-base flex-shrink-0">🔍</span>
                  <span className="truncate">
                    <span className="hidden sm:block">Audit Timekeeping</span>
                    <span className="block sm:hidden">Timekeeping</span>
                  </span>
                </Link>
              </Tooltip>
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Monitor App Suite</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• Daily Reports Review</li>
                        <li>• System Tools Monitoring</li>
                        <li>• Administrative Functions</li>
                        <li>• Management Interface</li>
                        <li>• Security Monitoring</li>
                      </ul>
                    </div>
                  </div>
                }
                position="cursor"
              >
                <Link 
                  href="/positionpages/auditpage/appsuite"
                  className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <span className="mr-1 sm:mr-1.5 md:mr-2 text-sm sm:text-base flex-shrink-0">📱</span>
                  <span className="truncate">
                    <span className="hidden sm:block">Monitor App Suite</span>
                    <span className="block sm:hidden">App Suite</span>
                  </span>
                </Link>
              </Tooltip>
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Generate Audit Report</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• Compliance Reports</li>
                        <li>• Timekeeping Analysis</li>
                        <li>• App Suite Usage</li>
                        <li>• System Audit Trail</li>
                        <li>• Performance Metrics</li>
                      </ul>
                    </div>
                  </div>
                }
                position="cursor"
              >
                <button className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors">
                  <span className="mr-1 sm:mr-1.5 md:mr-2 text-sm sm:text-base flex-shrink-0">📋</span>
                  <span className="truncate">
                    <span className="hidden sm:block">Generate Report</span>
                    <span className="block sm:hidden">Report</span>
                  </span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-1 sm:p-2 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">AU</span>
          </div>
          {!isCollapsed && (
            <div className="ml-1.5 sm:ml-2 md:ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Audit Manager</p>
              <p className="text-xs text-gray-700 truncate">audit@company.com</p>
              <div className="flex items-center mt-0.5 sm:mt-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
