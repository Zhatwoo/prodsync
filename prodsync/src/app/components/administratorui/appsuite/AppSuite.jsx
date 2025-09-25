'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  CloudArrowDownIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

const AppSuite = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedReports, setSelectedReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showReportModal) {
          setShowReportModal(false);
          setSelectedReport(null);
        }
      }
    };

    if (showReportModal) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [showReportModal]);

  // Real data from API - will be fetched from database
  const [dailyReports, setDailyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [departments] = useState([
    'Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'
  ]);

  // Fetch daily reports from API
  const fetchDailyReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to fetch daily reports from API...');
      const response = await fetch('/api/daily-reports');
      
      if (!response.ok) {
        // If API is not available, provide sample data for testing
        if (response.status === 404) {
          console.warn('API endpoint not found, using sample data');
          setError('API endpoint not available - using sample data. Please restart the development server.');
          
          // Provide sample data for testing
          const sampleData = [
            {
              id: 'DR-SAMPLE-001',
              employeeId: 'EMP-001',
              employeeName: 'Sample User',
              department: 'IT',
              position: 'Developer',
              reportDate: new Date().toISOString().split('T')[0],
              submissionTime: new Date().toISOString(),
              status: 'submitted',
              consultations: [],
              tasks: [],
              achievements: [],
              challenges: [],
              tomorrowPlans: [],
              notes: 'Sample daily report - API not available',
              attachments: [],
              approvedBy: null,
              approvedDate: null,
              feedback: null
            }
          ];
          setDailyReports(sampleData);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setDailyReports(result.data);
        console.log(`Successfully fetched ${result.data.length} reports`);
      } else {
        throw new Error(result.error || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching daily reports:', error);
      setError(`API Error: ${error.message}. Please restart the development server.`);
      // Fallback to empty array if API fails
      setDailyReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDailyReports();
    
    // Make refresh function available globally for DailyReport component
    window.refreshAppSuiteData = fetchDailyReports;
    
    // Set up polling for real-time updates (every 30 seconds)
    const pollingInterval = setInterval(() => {
      fetchDailyReports();
    }, 30000);
    
    // Cleanup on unmount
    return () => {
      window.refreshAppSuiteData = null;
      clearInterval(pollingInterval);
    };
  }, []); // Remove isLoading dependency to prevent infinite loop

  // Calculate metrics
  const totalReports = dailyReports.length;
  const submittedReports = dailyReports.filter(report => report.status === 'submitted').length;
  const approvedReports = dailyReports.filter(report => report.status === 'approved').length;
  const pendingReports = dailyReports.filter(report => report.status === 'pending').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'submitted': return <DocumentTextIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredReports = dailyReports.filter(report => {
    const matchesSearch = report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || report.department === filterDepartment;
    const matchesDate = !filterDate || report.reportDate === filterDate;
    return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
  });

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const handleApproveReport = async (reportId) => {
    try {
      const response = await fetch(`/api/daily-reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          approvedBy: 'Current Administrator'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Update local state with the updated report
        setDailyReports(prev => prev.map(report => 
          report.id === reportId ? result.data : report
        ));
      } else {
        throw new Error(result.error || 'Failed to approve report');
      }
    } catch (error) {
      console.error('Error approving report:', error);
      alert(`Error approving report: ${error.message}`);
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      const response = await fetch(`/api/daily-reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          approvedBy: 'Current Administrator'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Update local state with the updated report
        setDailyReports(prev => prev.map(report => 
          report.id === reportId ? result.data : report
        ));
      } else {
        throw new Error(result.error || 'Failed to reject report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert(`Error rejecting report: ${error.message}`);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const promises = selectedReports.map(reportId => 
        fetch(`/api/daily-reports/${reportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'approve',
            approvedBy: 'Current Administrator'
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all operations were successful
      const failedOperations = results.filter(result => !result.success);
      if (failedOperations.length > 0) {
        throw new Error(`${failedOperations.length} reports failed to approve`);
      }

      // Refresh the data to get updated reports
      await fetchDailyReports();
      setSelectedReports([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error bulk approving reports:', error);
      alert(`Error bulk approving reports: ${error.message}`);
    }
  };

  const handleBulkReject = async () => {
    try {
      const promises = selectedReports.map(reportId => 
        fetch(`/api/daily-reports/${reportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'reject',
            approvedBy: 'Current Administrator'
          }),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all operations were successful
      const failedOperations = results.filter(result => !result.success);
      if (failedOperations.length > 0) {
        throw new Error(`${failedOperations.length} reports failed to reject`);
      }

      // Refresh the data to get updated reports
      await fetchDailyReports();
      setSelectedReports([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error bulk rejecting reports:', error);
      alert(`Error bulk rejecting reports: ${error.message}`);
    }
  };

  const generateDailyReportPDF = (report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header - Company Name (Light Blue Background)
    doc.setFillColor(173, 216, 230); // Light blue
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INSPIRE NEXT GLOBAL INC.', pageWidth / 2, 10, { align: 'center' });
    
    // Daily Report Title (Yellow Background)
    doc.setFillColor(255, 255, 0); // Yellow
    doc.rect(0, 15, pageWidth, 12, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY REPORT', pageWidth / 2, 22, { align: 'center' });
    
    // Employee Information Section
    let yPos = 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`EMPLOYEE NAME: ${report.employeeName}`, 20, yPos);
    yPos += 8;
    doc.text(`POSITION: ${report.position}`, 20, yPos);
    
    // Checked By Section (right side)
    doc.text('CHECKED BY:', pageWidth - 60, 35);
    doc.line(pageWidth - 60, 37, pageWidth - 20, 37);
    
    // Consultation Details Table Header
    yPos = 50;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    // Table headers
    doc.text('CONSULTATION PLACE', 20, yPos);
    doc.text('TIME IN', pageWidth / 2 - 20, yPos);
    doc.text('CLIENT NAME', pageWidth - 60, yPos);
    
    // Draw table lines
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    
    // Consultation data rows
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const timeSlots = ['9:30', '10:30', '11:30', '12:30', '1:30', '2:30', '3:30', '4:30', '5:30', '6:30'];
    
    timeSlots.forEach((time, index) => {
      const consultation = report.consultations ? report.consultations[index] : { place: '', client: '' };
      
      // Draw row lines
      doc.line(20, yPos - 2, pageWidth - 20, yPos - 2);
      doc.line(20, yPos + 4, pageWidth - 20, yPos + 4);
      doc.line(20, yPos - 2, 20, yPos + 4);
      doc.line(pageWidth / 2 - 20, yPos - 2, pageWidth / 2 - 20, yPos + 4);
      doc.line(pageWidth - 60, yPos - 2, pageWidth - 60, yPos + 4);
      doc.line(pageWidth - 20, yPos - 2, pageWidth - 20, yPos + 4);
      
      // Add text
      doc.text(consultation.place || '', 22, yPos);
      doc.text(time, pageWidth / 2 - 18, yPos);
      doc.text(consultation.client || '', pageWidth - 58, yPos);
      
      yPos += 6;
    });
    
    // Add report date
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Report Date: ${report.reportDate}`, 20, yPos);
    doc.text(`Report ID: ${report.id}`, pageWidth - 60, yPos);
    
    // Add status
    yPos += 8;
    doc.text(`Status: ${report.status.toUpperCase()}`, 20, yPos);
    
    // Add approval information if available
    if (report.approvedBy) {
      yPos += 8;
      doc.text(`Approved By: ${report.approvedBy}`, 20, yPos);
      if (report.approvedDate) {
        const approvedDate = new Date(report.approvedDate).toLocaleDateString();
        doc.text(`Approved Date: ${approvedDate}`, pageWidth - 80, yPos);
      }
    }
    
    // Save the PDF
    const fileName = `Daily_Report_${report.id}_${report.employeeName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const handleDownloadReport = (reportId) => {
    const report = dailyReports.find(r => r.id === reportId);
    if (report) {
      generateDailyReportPDF(report);
    }
  };

  const handleBulkDownload = () => {
    if (selectedReports.length > 0) {
      selectedReports.forEach((reportId, index) => {
        // Add a small delay between downloads to avoid browser blocking
        setTimeout(() => {
          const report = dailyReports.find(r => r.id === reportId);
          if (report) {
            generateDailyReportPDF(report);
          }
        }, index * 500); // 500ms delay between each download
      });
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes backdropFadeIn {
          from {
            backdrop-filter: blur(0px);
          }
          to {
            backdrop-filter: blur(12px);
          }
        }
        
        .modal-animate {
          animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .backdrop-animate {
          animation: backdropFadeIn 0.3s ease-out;
        }
        
        /* Force text visibility for dropdowns and inputs */
        input[type="text"], input[type="email"], input[type="tel"], input[type="date"], select, textarea {
          color: #111827 !important;
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        
        input::placeholder {
          color: #6b7280 !important;
        }
        
        select option {
          color: #111827 !important;
          background-color: #ffffff !important;
        }
        
        /* Specific targeting for search and filters */
        .search-input, .filter-select {
          color: #111827 !important;
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        
        .search-input::placeholder {
          color: #6b7280 !important;
        }
        
        /* More specific selectors to override any existing styles */
        div input[type="text"], div select, div input[type="date"] {
          color: #111827 !important;
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        
        /* Target the specific filter section */
        .px-6.py-4 input, .px-6.py-4 select {
          color: #111827 !important;
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
        }
        
        /* Fix white text on white background issues */
        .text-white {
          color: #111827 !important;
        }
        
        /* Ensure all text in cards is dark */
        .bg-white .text-white {
          color: #111827 !important;
        }
        
        /* Fix button text visibility */
        button.text-white {
          color: #ffffff !important;
        }
        
        /* Fix any other white text issues */
        .text-gray-900, .text-gray-800, .text-gray-700 {
          color: #111827 !important;
        }
      `}</style>
      
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">App Suite - Daily Reports</h1>
        <p className="text-gray-600">Manage and review employee daily reports with submission tracking and approval workflow</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{submittedReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
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
              <p className="text-2xl font-bold text-gray-900">{approvedReports}</p>
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
              { id: 'reports', name: 'Daily Reports', icon: DocumentTextIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
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
          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">API Connection Issue</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{error}</p>
                    {error.includes('404') && (
                      <div className="mt-2 p-3 bg-yellow-100 rounded-md">
                        <p className="font-medium">Quick Fix:</p>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>Stop the development server (Ctrl+C)</li>
                          <li>Run: <code className="bg-yellow-200 px-1 rounded">npm run dev</code></li>
                          <li>Wait for server to fully start</li>
                          <li>Refresh this page</li>
                        </ol>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={fetchDailyReports}
                      className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setError(null)}
                      className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Daily Reports</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchDailyReports}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg 
                      className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refresh
                  </button>
                  {isLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading daily reports...
                  </div>
                </div>
              ) : dailyReports.length === 0 ? (
                <div className="p-8 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                  <p className="mt-1 text-sm text-gray-500">No daily reports have been submitted yet.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyReports.slice(0, 5).map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{report.employeeName}</div>
                          <div className="text-sm text-gray-500">{report.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.reportDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedReport(report);
                              setShowReportModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadReport(report.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Department Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Department Summary</h3>
                {(filterDepartment !== 'all' || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setFilterDepartment('all');
                      setFilterStatus('all');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => {
                  const deptReports = dailyReports.filter(report => report.department === dept);
                  const submitted = deptReports.filter(report => report.status === 'submitted').length;
                  const approved = deptReports.filter(report => report.status === 'approved').length;
                  const pending = deptReports.filter(report => report.status === 'pending').length;
                  
                  return (
                    <div 
                      key={dept} 
                      className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        filterDepartment === dept 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setFilterDepartment(dept);
                        setActiveTab('reports'); // Switch to reports tab to see filtered results
                      }}
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{dept}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-black">Total:</span>
                            <span className="font-medium text-black">{deptReports.length}</span>
                          </div>
                          <div 
                            className="flex justify-between hover:bg-blue-50 p-1 rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterDepartment(dept);
                              setFilterStatus('submitted');
                              setActiveTab('reports');
                            }}
                          >
                            <span className="text-black">Submitted:</span>
                            <span className="font-medium text-black hover:text-blue-600">{submitted}</span>
                          </div>
                          <div 
                            className="flex justify-between hover:bg-green-50 p-1 rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterDepartment(dept);
                              setFilterStatus('approved');
                              setActiveTab('reports');
                            }}
                          >
                            <span className="text-black">Approved:</span>
                            <span className="font-medium text-black hover:text-green-600">{approved}</span>
                          </div>
                          <div 
                            className="flex justify-between hover:bg-yellow-50 p-1 rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterDepartment(dept);
                              setFilterStatus('pending');
                              setActiveTab('reports');
                            }}
                          >
                            <span className="text-black">Pending:</span>
                            <span className="font-medium text-black hover:text-yellow-600">{pending}</span>
                          </div>
                        </div>
                      <div className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                        Click to view reports →
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Daily Reports Management</h3>
              <div className="flex space-x-2">
                {selectedReports.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{selectedReports.length} selected</span>
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                    >
                      Bulk Actions
                    </button>
                  </div>
                )}
                <button
                  onClick={handleBulkDownload}
                  disabled={selectedReports.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <CloudArrowDownIcon className="h-4 w-4 mr-2" />
                  Bulk Download
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && (
            <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Bulk Actions:</span>
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Approve All
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowBulkActions(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    style={{ 
                      color: '#111827', 
                      backgroundColor: '#ffffff',
                      WebkitTextFillColor: '#111827'
                    }}
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                style={{ 
                  color: '#111827', 
                  backgroundColor: '#ffffff',
                  WebkitTextFillColor: '#111827'
                }}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="filter-select px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                style={{ 
                  color: '#111827', 
                  backgroundColor: '#ffffff',
                  WebkitTextFillColor: '#111827'
                }}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                style={{ 
                  color: '#111827', 
                  backgroundColor: '#ffffff',
                  WebkitTextFillColor: '#111827'
                }}
              />
            </div>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading daily reports...
                </div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {dailyReports.length === 0 
                    ? "No daily reports have been submitted yet."
                    : "No reports match your current filters."
                  }
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{report.employeeName}</div>
                        <div className="text-sm text-gray-500">{report.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.reportDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(report.submissionTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReport(report.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        {report.status === 'submitted' && (
                          <>
                            <button 
                              onClick={() => handleApproveReport(report.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectReport(report.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </>
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
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Submission Trends</h4>
                <p className="text-sm text-gray-600">Track daily report submission patterns and trends over time</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  View Trends
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Department Performance</h4>
                <p className="text-sm text-gray-600">Compare report submission and approval rates across departments</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  View Performance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div 
          className="fixed inset-0 backdrop-blur-lg overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-animate"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReportModal(false);
              setSelectedReport(null);
            }
          }}
        >
          <div className="relative mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-2xl rounded-lg bg-white max-h-[90vh] overflow-y-auto modal-animate">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Daily Report Details</h3>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReport(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Report ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {getStatusIcon(selectedReport.status)}
                      <span className="ml-1 capitalize">{selectedReport.status}</span>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedReport.employeeName}</p>
                    <p className="text-xs text-gray-500">{selectedReport.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedReport.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Report Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedReport.reportDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submission Time</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedReport.submissionTime)}</p>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tasks Completed</label>
                  <div className="space-y-2">
                    {selectedReport.tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{task.task}</p>
                          <p className="text-xs text-gray-500">Time spent: {task.timeSpent}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedReport.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-gray-900">{achievement}</li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenges</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedReport.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-900">{challenge}</li>
                    ))}
                  </ul>
                </div>

                {/* Tomorrow's Plans */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tomorrow's Plans</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedReport.tomorrowPlans.map((plan, index) => (
                      <li key={index} className="text-sm text-gray-900">{plan}</li>
                    ))}
                  </ul>
                </div>

                {/* Notes */}
                {selectedReport.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedReport.notes}</p>
                  </div>
                )}

                {/* Attachments */}
                {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <div className="space-y-2">
                      {selectedReport.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <DocumentArrowDownIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approval Information */}
                {selectedReport.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved By</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedReport.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedReport.approvedDate)}</p>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedReport.feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                    <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedReport.feedback}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadReport(selectedReport.id)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Download Report
                </button>
                {selectedReport.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveReport(selectedReport.id);
                        setShowReportModal(false);
                        setSelectedReport(null);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectReport(selectedReport.id);
                        setShowReportModal(false);
                        setSelectedReport(null);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AppSuite;

