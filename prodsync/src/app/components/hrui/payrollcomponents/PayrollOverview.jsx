'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';

export default function PayrollOverview() {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payroll data from Firebase (employees collection)
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        const employeesRef = collection(db, 'employees');
        const q = query(employeesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const payrollDataArray = [];
        querySnapshot.forEach((doc) => {
          const employee = doc.data();
          
          // Extract salary amount (handle different formats like "$50,000", "50000", etc.)
          const basicSalary = parseFloat(employee.salary?.replace(/[^0-9.-]+/g, '') || 0);
          
          // Calculate payroll components based on employee data
          const allowances = Math.round(basicSalary * 0.1); // 10% of basic salary
          const overtime = Math.round(basicSalary * 0.05); // 5% of basic salary
          const bonuses = Math.round(basicSalary * 0.08); // 8% of basic salary
          const grossSalary = basicSalary + allowances + overtime + bonuses;
          
          // Calculate deductions (tax, insurance, etc.)
          const deductions = Math.round(grossSalary * 0.2); // 20% deductions
          const netSalary = grossSalary - deductions;
          
          // Determine payroll status based on employee status
          let payrollStatus = 'Pending';
          if (employee.status === 'Active') {
            payrollStatus = 'Processed';
          } else if (employee.status === 'On Leave') {
            payrollStatus = 'On Hold';
          } else if (employee.status === 'Inactive') {
            payrollStatus = 'Suspended';
          }
          
          payrollDataArray.push({
            id: doc.id,
            employeeName: employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
            employeeId: doc.id.substring(0, 8).toUpperCase(),
            department: employee.department || 'N/A',
            position: employee.position || 'N/A',
            email: employee.email || 'N/A',
            phone: employee.phone || 'N/A',
            basicSalary: basicSalary,
            allowances: allowances,
            overtime: overtime,
            bonuses: bonuses,
            grossSalary: grossSalary,
            deductions: deductions,
            netSalary: netSalary,
            status: payrollStatus,
            employeeStatus: employee.status || 'Unknown',
            joinDate: employee.joinDate || employee.startDate,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
            // Additional employee data for better integration
            address: employee.address || '',
            emergencyContact: employee.emergencyContact || '',
            emergencyPhone: employee.emergencyPhone || '',
            skills: employee.skills || [],
            notes: employee.notes || ''
          });
        });
        
        setPayrollData(payrollDataArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching payroll data:', err);
        setError('Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

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

  const handleProcessPayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payroll processed successfully!');
    }, 2000);
  };

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const payrollDataArray = [];
      querySnapshot.forEach((doc) => {
        const employee = doc.data();
        
        // Extract salary amount (handle different formats like "$50,000", "50000", etc.)
        const basicSalary = parseFloat(employee.salary?.replace(/[^0-9.-]+/g, '') || 0);
        
        // Calculate payroll components based on employee data
        const allowances = Math.round(basicSalary * 0.1); // 10% of basic salary
        const overtime = Math.round(basicSalary * 0.05); // 5% of basic salary
        const bonuses = Math.round(basicSalary * 0.08); // 8% of basic salary
        const grossSalary = basicSalary + allowances + overtime + bonuses;
        
        // Calculate deductions (tax, insurance, etc.)
        const deductions = Math.round(grossSalary * 0.2); // 20% deductions
        const netSalary = grossSalary - deductions;
        
        // Determine payroll status based on employee status
        let payrollStatus = 'Pending';
        if (employee.status === 'Active') {
          payrollStatus = 'Processed';
        } else if (employee.status === 'On Leave') {
          payrollStatus = 'On Hold';
        } else if (employee.status === 'Inactive') {
          payrollStatus = 'Suspended';
        }
        
        payrollDataArray.push({
          id: doc.id,
          employeeName: employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
          employeeId: doc.id.substring(0, 8).toUpperCase(),
          department: employee.department || 'N/A',
          position: employee.position || 'N/A',
          email: employee.email || 'N/A',
          phone: employee.phone || 'N/A',
          basicSalary: basicSalary,
          allowances: allowances,
          overtime: overtime,
          bonuses: bonuses,
          grossSalary: grossSalary,
          deductions: deductions,
          netSalary: netSalary,
          status: payrollStatus,
          employeeStatus: employee.status || 'Unknown',
          joinDate: employee.joinDate || employee.startDate,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          // Additional employee data for better integration
          address: employee.address || '',
          emergencyContact: employee.emergencyContact || '',
          emergencyPhone: employee.emergencyPhone || '',
          skills: employee.skills || [],
          notes: employee.notes || ''
        });
      });
      
      setPayrollData(payrollDataArray);
      setError(null);
      alert('Payroll data refreshed successfully!');
    } catch (err) {
      console.error('Error refreshing payroll data:', err);
      setError('Failed to refresh payroll data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGross = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNet = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading payroll data...</div>
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
            <h2 className="text-2xl font-bold text-gray-900">Payroll Overview</h2>
            <p className="text-gray-600 mt-1">Manage and monitor payroll processing</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <div className="flex space-x-3">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            <button
              onClick={handleProcessPayroll}
              disabled={isProcessing}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Process Payroll'}
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gross</p>
              <p className="text-2xl font-bold text-gray-900">${totalGross.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-gray-900">${totalNet.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{processedCount}/{payrollData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Payroll Details - {selectedPeriod}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonuses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.basicSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.allowances.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.overtime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.bonuses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${employee.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.deductions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ${employee.netSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.updatedAt?.toDate ? 
                        employee.updatedAt.toDate().toLocaleDateString() + ' ' + employee.updatedAt.toDate().toLocaleTimeString() :
                        employee.createdAt?.toDate ? 
                        employee.createdAt.toDate().toLocaleDateString() + ' ' + employee.createdAt.toDate().toLocaleTimeString() :
                        'N/A'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Edit</button>
                      <button className="text-purple-600 hover:text-purple-900">Payslip</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
