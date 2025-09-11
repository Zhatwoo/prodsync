'use client';

import { useState, useEffect } from 'react';

export default function AttendanceReports() {
  const [reports, setReports] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample reports data
  useEffect(() => {
    const sampleReports = [
      {
        id: 1,
        name: 'Daily Attendance Report',
        type: 'daily',
        dateRange: '2024-01-15 to 2024-01-15',
        department: 'All Departments',
        generatedDate: '2024-01-15',
        generatedBy: 'HR Manager',
        totalEmployees: 25,
        presentEmployees: 23,
        absentEmployees: 2,
        lateEmployees: 5,
        attendanceRate: 92,
        totalHours: 184,
        status: 'Completed',
        fileSize: '2.3 MB'
      },
      {
        id: 2,
        name: 'Weekly Attendance Summary',
        type: 'weekly',
        dateRange: '2024-01-08 to 2024-01-14',
        department: 'IT Department',
        generatedDate: '2024-01-14',
        generatedBy: 'HR Manager',
        totalEmployees: 8,
        presentEmployees: 7,
        absentEmployees: 1,
        lateEmployees: 2,
        attendanceRate: 87.5,
        totalHours: 280,
        status: 'Completed',
        fileSize: '1.8 MB'
      },
      {
        id: 3,
        name: 'Monthly Attendance Report',
        type: 'monthly',
        dateRange: '2024-01-01 to 2024-01-31',
        department: 'All Departments',
        generatedDate: '2024-01-31',
        generatedBy: 'HR Manager',
        totalEmployees: 25,
        presentEmployees: 22,
        absentEmployees: 3,
        lateEmployees: 8,
        attendanceRate: 88,
        totalHours: 3520,
        status: 'Completed',
        fileSize: '5.2 MB'
      },
      {
        id: 4,
        name: 'Overtime Report',
        type: 'overtime',
        dateRange: '2024-01-01 to 2024-01-31',
        department: 'All Departments',
        generatedDate: '2024-01-31',
        generatedBy: 'HR Manager',
        totalEmployees: 12,
        presentEmployees: 12,
        absentEmployees: 0,
        lateEmployees: 0,
        attendanceRate: 100,
        totalHours: 48,
        status: 'Completed',
        fileSize: '1.5 MB'
      },
      {
        id: 5,
        name: 'Leave Summary Report',
        type: 'leave',
        dateRange: '2024-01-01 to 2024-01-31',
        department: 'All Departments',
        generatedDate: '2024-01-31',
        generatedBy: 'HR Manager',
        totalEmployees: 25,
        presentEmployees: 20,
        absentEmployees: 5,
        lateEmployees: 0,
        attendanceRate: 80,
        totalHours: 0,
        status: 'Completed',
        fileSize: '2.1 MB'
      }
    ];
    setReports(sampleReports);
  }, []);

  const reportTypes = [
    { value: 'daily', label: 'Daily Attendance Report' },
    { value: 'weekly', label: 'Weekly Attendance Summary' },
    { value: 'monthly', label: 'Monthly Attendance Report' },
    { value: 'overtime', label: 'Overtime Report' },
    { value: 'leave', label: 'Leave Summary Report' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const departments = [
    'All Departments', 'IT', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations'
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport = {
      id: reports.length + 1,
      name: reportTypes.find(type => type.value === selectedReportType)?.label || 'Custom Report',
      type: selectedReportType,
      dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
      department: departments.find(dept => dept === selectedDepartment) || 'All Departments',
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Current User',
      totalEmployees: Math.floor(Math.random() * 20) + 10,
      presentEmployees: Math.floor(Math.random() * 15) + 8,
      absentEmployees: Math.floor(Math.random() * 3) + 1,
      lateEmployees: Math.floor(Math.random() * 5) + 1,
      attendanceRate: Math.floor(Math.random() * 20) + 80,
      totalHours: Math.floor(Math.random() * 200) + 100,
      status: 'Completed',
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`
    };
    
    setReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
  };

  const handleDownload = (reportId) => {
    // Simulate download
    alert(`Downloading report ${reportId}...`);
  };

  const handleDelete = (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(report => report.id !== reportId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Generating': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'overtime': return 'bg-orange-100 text-orange-800';
      case 'leave': return 'bg-pink-100 text-pink-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'Completed').length;
  const totalFileSize = reports.reduce((sum, r) => sum + parseFloat(r.fileSize), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance Reports</h2>
            <p className="text-gray-600 mt-1">Generate and manage attendance reports</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{totalFileSize.toFixed(1)} MB</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.attendanceRate, 0) / reports.length) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Generate New Report</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.fileSize}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReportTypeColor(report.type)}`}>
                      {reportTypes.find(type => type.value === report.type)?.label || report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.dateRange}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{report.attendanceRate}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${report.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{new Date(report.generatedDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">by {report.generatedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownload(report.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => handleDelete(report.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common report generation tasks</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Export All Reports
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Schedule Auto Reports
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Report Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
