'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';

export default function PayrollReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  // Set default period to current month
  const getCurrentPeriod = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [reportPeriod, setReportPeriod] = useState(getCurrentPeriod());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Fetch reports from Firebase
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reportsRef = collection(db, 'payrollReports');
        const q = query(reportsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const reportsData = [];
        querySnapshot.forEach((doc) => {
          reportsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setReports(reportsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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

  // Generate periods dynamically (current month and 11 previous months)
  const generatePeriods = () => {
    const periods = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      periods.push(`${year}-${month}`);
    }
    
    return periods;
  };

  const periods = generatePeriods();

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Fetch real data from Firebase
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const employeesData = [];
      querySnapshot.forEach((doc) => {
        const employee = doc.data();
        let basicSalary = 0;
        if (employee.salary !== undefined && employee.salary !== null) {
          if (typeof employee.salary === 'string') {
            basicSalary = parseFloat(employee.salary.replace(/[^0-9.-]+/g, '') || 0);
          } else if (typeof employee.salary === 'number') {
            basicSalary = employee.salary;
          } else {
            console.warn('Unexpected salary data type:', typeof employee.salary, employee.salary);
          }
        }
        const allowances = Math.round(basicSalary * 0.1);
        const overtime = Math.round(basicSalary * 0.05);
        const bonuses = Math.round(basicSalary * 0.08);
        const grossSalary = basicSalary + allowances + overtime + bonuses;
        const deductions = Math.round(grossSalary * 0.2);
        const netSalary = grossSalary - deductions;
        
        employeesData.push({
          ...employee,
          id: doc.id,
          basicSalary,
          allowances,
          overtime,
          bonuses,
          grossSalary,
          deductions,
          netSalary
        });
      });

      // Calculate department-wise data
      const departmentData = {};
      employeesData.forEach(emp => {
        if (!departmentData[emp.department]) {
          departmentData[emp.department] = {
            employees: 0,
            grossPay: 0,
            netPay: 0
          };
        }
        departmentData[emp.department].employees += 1;
        departmentData[emp.department].grossPay += emp.grossSalary;
        departmentData[emp.department].netPay += emp.netSalary;
      });

      const reportData = {
        reportName: selectedReport,
        period: reportPeriod,
        generatedAt: new Date().toISOString(),
        summary: {
          totalEmployees: employeesData.length,
          totalGrossPay: employeesData.reduce((sum, emp) => sum + emp.grossSalary, 0),
          totalDeductions: employeesData.reduce((sum, emp) => sum + emp.deductions, 0),
          totalNetPay: employeesData.reduce((sum, emp) => sum + emp.netSalary, 0),
          averageSalary: employeesData.length > 0 ? Math.round(employeesData.reduce((sum, emp) => sum + emp.grossSalary, 0) / employeesData.length) : 0
        },
        details: Object.entries(departmentData).map(([department, data]) => ({
          department,
          employees: data.employees,
          grossPay: data.grossPay,
          netPay: data.netPay
        }))
      };
      
      setReportData(reportData);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

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
                    <div className="text-sm text-gray-900">
                      {report.updatedAt?.toDate ? 
                        report.updatedAt.toDate().toLocaleDateString() + ' ' + report.updatedAt.toDate().toLocaleTimeString() :
                        report.createdAt?.toDate ? 
                        report.createdAt.toDate().toLocaleDateString() + ' ' + report.createdAt.toDate().toLocaleTimeString() :
                        report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'N/A'
                      }
                    </div>
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
