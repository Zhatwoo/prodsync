'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AttendanceModal from './navbarmodal/Timecard';
import DailyReportModal from './navbarmodal/DailyReport';
import TaskScheduleModal from './navbarmodal/TaskSchedule';
import ApplicationFormModal from './navbarmodal/ApplicationForm';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTimecardModalOpen, setIsTimecardModalOpen] = useState(false);
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false);
  const [isTaskScheduleModalOpen, setIsTaskScheduleModalOpen] = useState(false);
  const [isApplicationFormModalOpen, setIsApplicationFormModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTimecardClick = (e) => {
    e.preventDefault();
    
    // Close other modals with animation
    if (isDailyReportModalOpen || isTaskScheduleModalOpen || isApplicationFormModalOpen) {
      let modalToClose = 'daily-report';
      if (isTaskScheduleModalOpen) modalToClose = 'task-schedule';
      if (isApplicationFormModalOpen) modalToClose = 'application-form';
      
      const modal = document.querySelector(`[data-modal="${modalToClose}"]`);
      if (modal) {
        modal.classList.add('animate-slideUp');
        setTimeout(() => {
          setIsDailyReportModalOpen(false);
          setIsTaskScheduleModalOpen(false);
          setIsApplicationFormModalOpen(false);
          setIsTimecardModalOpen(true);
        }, 300);
      } else {
        setIsDailyReportModalOpen(false);
        setIsTaskScheduleModalOpen(false);
        setIsApplicationFormModalOpen(false);
        setIsTimecardModalOpen(true);
      }
    } else {
      setIsTimecardModalOpen(true);
    }
    
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleDailyReportClick = (e) => {
    e.preventDefault();
    
    // Close other modals with animation
    if (isTimecardModalOpen || isTaskScheduleModalOpen || isApplicationFormModalOpen) {
      let modalToClose = 'timecard';
      if (isTaskScheduleModalOpen) modalToClose = 'task-schedule';
      if (isApplicationFormModalOpen) modalToClose = 'application-form';
      
      const modal = document.querySelector(`[data-modal="${modalToClose}"]`);
      if (modal) {
        modal.classList.add('animate-slideUp');
        setTimeout(() => {
          setIsTimecardModalOpen(false);
          setIsTaskScheduleModalOpen(false);
          setIsApplicationFormModalOpen(false);
          setIsDailyReportModalOpen(true);
        }, 300);
      } else {
        setIsTimecardModalOpen(false);
        setIsTaskScheduleModalOpen(false);
        setIsApplicationFormModalOpen(false);
        setIsDailyReportModalOpen(true);
      }
    } else {
      setIsDailyReportModalOpen(true);
    }
    
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleTaskScheduleClick = (e) => {
    e.preventDefault();
    
    // Close other modals with animation
    if (isTimecardModalOpen || isDailyReportModalOpen || isApplicationFormModalOpen) {
      let modalToClose = 'timecard';
      if (isDailyReportModalOpen) modalToClose = 'daily-report';
      if (isApplicationFormModalOpen) modalToClose = 'application-form';
      
      const modal = document.querySelector(`[data-modal="${modalToClose}"]`);
      if (modal) {
        modal.classList.add('animate-slideUp');
        setTimeout(() => {
          setIsTimecardModalOpen(false);
          setIsDailyReportModalOpen(false);
          setIsApplicationFormModalOpen(false);
          setIsTaskScheduleModalOpen(true);
        }, 300);
      } else {
        setIsTimecardModalOpen(false);
        setIsDailyReportModalOpen(false);
        setIsApplicationFormModalOpen(false);
        setIsTaskScheduleModalOpen(true);
      }
    } else {
      setIsTaskScheduleModalOpen(true);
    }
    
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleApplicationFormClick = (e) => {
    e.preventDefault();
    
    // Close other modals with animation
    if (isTimecardModalOpen || isDailyReportModalOpen || isTaskScheduleModalOpen) {
      let modalToClose = 'timecard';
      if (isDailyReportModalOpen) modalToClose = 'daily-report';
      if (isTaskScheduleModalOpen) modalToClose = 'task-schedule';
      
      const modal = document.querySelector(`[data-modal="${modalToClose}"]`);
      if (modal) {
        modal.classList.add('animate-slideUp');
        setTimeout(() => {
          setIsTimecardModalOpen(false);
          setIsDailyReportModalOpen(false);
          setIsTaskScheduleModalOpen(false);
          setIsApplicationFormModalOpen(true);
        }, 300);
      } else {
        setIsTimecardModalOpen(false);
        setIsDailyReportModalOpen(false);
        setIsTaskScheduleModalOpen(false);
        setIsApplicationFormModalOpen(true);
      }
    } else {
      setIsApplicationFormModalOpen(true);
    }
    
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const closeTimecardModal = () => {
    setIsTimecardModalOpen(false);
  };

  const closeDailyReportModal = () => {
    setIsDailyReportModalOpen(false);
  };

  const closeTaskScheduleModal = () => {
    setIsTaskScheduleModalOpen(false);
  };

  const closeApplicationFormModal = () => {
    setIsApplicationFormModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear any stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Clear any cookies if you're using them
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Show logout confirmation
      alert('You have been logged out successfully.');
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/auth/login');
    }
  };

  const navigationItems = [
    {
      name: 'Timecard',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: handleTimecardClick
    },
    {
      name: 'Daily Report',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: handleDailyReportClick
    },
    {
      name: 'Task Schedule',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: handleTaskScheduleClick
    },
    {
      name: 'Application Form',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handleApplicationFormClick
    }
  ];

  const isActive = (href) => {
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                ProdSync
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navigationItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="mr-2 text-gray-500">{item.icon}</span>
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="mr-2 text-gray-500">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 shadow-lg"></span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-200"
              title="Logout"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              Logout
              </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              {navigationItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      item.onClick(e);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors w-full text-left ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Mobile Logout Button */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      <AttendanceModal 
        isOpen={isTimecardModalOpen} 
        onClose={closeTimecardModal} 
      />

      {/* Daily Report Modal */}
      <DailyReportModal 
        isOpen={isDailyReportModalOpen} 
        onClose={closeDailyReportModal} 
      />

      {/* Task Schedule Modal */}
      <TaskScheduleModal 
        isOpen={isTaskScheduleModalOpen} 
        onClose={closeTaskScheduleModal} 
      />

      {/* Application Form Modal */}
      <ApplicationFormModal 
        isOpen={isApplicationFormModalOpen} 
        onClose={closeApplicationFormModal} 
      />
    </nav>
  );
}
