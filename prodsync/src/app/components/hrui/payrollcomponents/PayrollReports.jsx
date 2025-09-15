'use client';

import { useState, useEffect } from 'react';

export default function PayrollReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [reportPeriod, setReportPeriod] = useState('2024-01');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Sample reports data
  useEffect(() => {
    const sampleReports = [
      {
        id: 1,
        name: 'Monthly Payroll Summary',
        description: 'Complete monthly payroll summary with all employees',
        type: 'Summary',
        frequency: 'Monthly',
        lastGenerated: '2024-01-15',
        status: 'Available'
      },
      {
        id: 2,
        name: 'Tax Report',
        description: 'Detailed tax deductions and withholdings report',
        type: 'Tax',
        frequency: 'Monthly',
        lastGenerated: '2024-01-10',
        status: 'Available'
      },
      {
        id: 3,
        name: 'Benefits Report',
        description: 'Employee benefits and allowances summary',
        type: 'Benefits',
        frequency: 'Monthly',
        lastGenerated: '2024-01-12',
        status: 'Available'
      },
      {
        id: 4,
        name: 'Department Payroll',
        description: 'Payroll breakdown by department',
        type: 'Department',
        frequency: 'Monthly',
        lastGenerated: '2024-01-08',
        status: 'Available'
      },
      {
        id: 5,
        name: 'Overtime Report',
        description: 'Overtime hours and payments report',
        type: 'Overtime',
        frequency: 'Monthly',
        lastGenerated: '2024-01-14',
        status: 'Available'
      },
      {
        id: 6,
        name: 'Year-end Summary',
        description: 'Annual payroll and tax summary',
        type: 'Annual',
        frequency: 'Annually',
        lastGenerated: '2023-12-31',
        status: 'Available'
      }
    ];
    setReports(sampleReports);
  }, []);

  const reportTypes = [
    'Monthly Payroll Summary',
    'Tax Report',
    'Benefits Report',
    'Department Payroll',
    'Overtime Report',
    'Year-end Summary',
    'Custom Report'
  ];

  const periods = [
    '2024-01', '2023-12', '2023-11', '2023-10', '2023-09', '2023-08'
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const sampleReportData = {
        reportName: selectedReport,
        period: reportPeriod,
        generatedAt: new Date().toISOString(),
        summary: {
          totalEmployees: 25,
          totalGrossPay: 1850000,
          totalDeductions: 320000,
          totalNetPay: 1530000,
          averageSalary: 74000
        },
        details: [
          { department: 'IT', employees: 8, grossPay: 600000, netPay: 480000 },
          { department: 'HR', employees: 3, grossPay: 200000, netPay: 160000 },
          { department: 'Marketing', employees: 5, grossPay: 300000, netPay: 240000 },
          { department: 'Finance', employees: 4, grossPay: 250000, netPay: 200000 },
          { department: 'Sales', employees: 3, grossPay: 350000, netPay: 280000 },
          { department: 'Operations', employees: 2, grossPay: 150000, netPay: 120000 }
        ]
      };
      
      setReportData(sampleReportData);
      setIsGenerating(false);
    }, 2000);
  };

  const handleExportReport = (format) => {
    if (!reportData) {
      alert('No report data available to export');
      return;
    }
    
    alert(`Exporting report as ${format}...`);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Summary': return 'bg-blue-100 text-blue-800';
      case 'Tax': return 'bg-red-100 text-red-800';
      case 'Benefits': return 'bg-green-100 text-green-800';
      case 'Department': return 'bg-purple-100 text-purple-800';
      case 'Overtime': return 'bg-yellow-100 text-yellow-800';
      case 'Annual': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payroll Reports</h2>
            <p className="text-gray-600 mt-1">Generate and manage payroll reports</p>
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Report Type</option>
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report */}
      {reportData && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {reportData.reportName} - {reportData.period}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportReport('PDF')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => handleExportReport('Excel')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => handleExportReport('CSV')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalEmployees}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">${reportData.summary.totalGrossPay.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Gross Pay</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">${reportData.summary.totalDeductions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Deductions</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">${reportData.summary.totalNetPay.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Net Pay</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">${reportData.summary.averageSalary.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Salary</div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg per Employee</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.details.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.employees}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${dept.grossPay.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${dept.netPay.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${Math.round(dept.netPay / dept.employees).toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Available Reports */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Generated</th>
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
                      <div className="text-sm text-gray-500">{report.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(report.lastGenerated).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Download</button>
                      <button className="text-purple-600 hover:text-purple-900">Schedule</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
            <div className="text-sm text-gray-600">Available Reports</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(report => report.status === 'Available').length}
            </div>
            <div className="text-sm text-gray-600">Ready to Generate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {reports.filter(report => report.frequency === 'Monthly').length}
            </div>
            <div className="text-sm text-gray-600">Monthly Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
