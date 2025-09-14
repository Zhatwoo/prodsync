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

export default function FrontDeskSidebar({ isCollapsed, onToggleCollapse }) {
  const [expandedSections, setExpandedSections] = useState({
    telephones: true,
    visitorsMonitor: true
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
    telephones: {
      title: 'Telephones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      href: '/positionpages/frontdesk/telephones',
      items: []
    },
    visitorsMonitor: {
      title: 'Visitors Monitor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      href: '/positionpages/frontdesk/visitorsmonitor',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">Front Desk</h1>
              <p className="text-xs text-gray-500">Reception & Monitoring</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="font-semibold mb-2">Front Desk Dashboard</div>
                  <div className="text-xs opacity-90">
                    <ul className="space-y-1">
                      <li>• Telephone Management</li>
                      <li>• Visitor Monitoring</li>
                      <li>• Reception Overview</li>
                      <li>• Access Control</li>
                    </ul>
                  </div>
                </div>
              }
              position="cursor"
            >
              <Link
                href="/positionpages/frontdesk"
                className={`w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg bg-gradient-to-r from-gray-600 to-gray-700 ${
                  isActive('/positionpages/frontdesk') ? 'ring-2 ring-white ring-opacity-50' : ''
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
                      <span className="hidden sm:block">Front Desk Dashboard</span>
                      <span className="block sm:hidden">Front Desk</span>
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
                        {key === 'telephones' && (
                          <ul className="space-y-1">
                            <li>• Phone System Management</li>
                            <li>• Call Monitoring</li>
                            <li>• Extension Management</li>
                            <li>• Call Logs & Reports</li>
                            <li>• System Configuration</li>
                            <li>• Emergency Contacts</li>
                          </ul>
                        )}
                        {key === 'visitorsMonitor' && (
                          <ul className="space-y-1">
                            <li>• Visitor Registration</li>
                            <li>• Access Control</li>
                            <li>• Visitor Tracking</li>
                            <li>• Security Monitoring</li>
                            <li>• Badge Management</li>
                            <li>• Visitor Reports</li>
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
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
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
        <div className="px-1 sm:px-2 py-2 sm:py-3 md:py-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-orange-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2 md:mb-3">Quick Actions</h3>
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Register Visitor</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• New Visitor Registration</li>
                        <li>• ID Verification</li>
                        <li>• Badge Assignment</li>
                        <li>• Access Level Setup</li>
                        <li>• Visit Purpose Logging</li>
                      </ul>
                    </div>
                  </div>
                }
                position="cursor"
              >
                <button className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors">
                  <span className="mr-1 sm:mr-1.5 md:mr-2 text-sm sm:text-base flex-shrink-0">👤</span>
                  <span className="truncate">
                    <span className="hidden sm:block">Register Visitor</span>
                    <span className="block sm:hidden">Register</span>
                  </span>
                </button>
              </Tooltip>
              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-2">Call Management</div>
                    <div className="text-xs opacity-90">
                      <ul className="space-y-1">
                        <li>• Incoming Call Handling</li>
                        <li>• Call Transfer</li>
                        <li>• Call Logging</li>
                        <li>• Emergency Calls</li>
                        <li>• Directory Access</li>
                      </ul>
                    </div>
                  </div>
                }
                position="cursor"
              >
                <button className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors">
                  <span className="mr-1 sm:mr-1.5 md:mr-2 text-sm sm:text-base flex-shrink-0">📞</span>
                  <span className="truncate">
                    <span className="hidden sm:block">Call Management</span>
                    <span className="block sm:hidden">Calls</span>
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
            <span className="text-white text-xs font-bold">FD</span>
          </div>
          {!isCollapsed && (
            <div className="ml-1.5 sm:ml-2 md:ml-3 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Front Desk Staff</p>
              <p className="text-xs text-gray-700 truncate">frontdesk@company.com</p>
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
