'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import PermissionGuard from '../../PermissionGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';

export default function PayrollProcessing() {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [overtimeData, setOvertimeData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [payrollPeriod, setPayrollPeriod] = useState({
    startDate: '',
    endDate: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [processedPayroll, setProcessedPayroll] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Permission checking
  const { can, canPerform, isHR, isAdmin } = usePermissions();

  // Fetch all required data
  useEffect(() => {
    fetchAllData();
  }, [payrollPeriod]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch employees
      try {
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        const employeesData = [];
        employeesSnapshot.forEach((doc) => {
          employeesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setEmployees(employeesData);
      } catch (err) {
        console.error('Error fetching employees:', err);
        if (err.code === 'permission-denied') {
          setError('Permission denied: You do not have access to employee data. Please contact your administrator.');
        } else {
          setError('Failed to fetch employee data. Please try again.');
        }
        return;
      }

      // Fetch attendance data for the period
      if (payrollPeriod.startDate && payrollPeriod.endDate) {
        try {
          const attendanceRef = collection(db, 'attendance');
          const attendanceQuery = query(
            attendanceRef,
            where('date', '>=', payrollPeriod.startDate),
            where('date', '<=', payrollPeriod.endDate)
          );
          const attendanceSnapshot = await getDocs(attendanceQuery);
          
          const attendanceRecords = [];
          attendanceSnapshot.forEach((doc) => {
            attendanceRecords.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setAttendanceData(attendanceRecords);
        } catch (err) {
          console.error('Error fetching attendance data:', err);
          if (err.code === 'permission-denied') {
            setError('Permission denied: You do not have access to attendance data. Please contact your administrator.');
          } else {
            setError('Failed to fetch attendance data. Please try again.');
          }
          return;
        }

        // Fetch overtime data (from overtime requests)
        try {
          const overtimeRef = collection(db, 'overtimeRequests');
          const overtimeQuery = query(
            overtimeRef,
            where('date', '>=', payrollPeriod.startDate),
            where('date', '<=', payrollPeriod.endDate),
            where('status', '==', 'Approved')
          );
          const overtimeSnapshot = await getDocs(overtimeQuery);
          
          const overtimeRecords = [];
          overtimeSnapshot.forEach((doc) => {
            overtimeRecords.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setOvertimeData(overtimeRecords);
        } catch (err) {
          console.error('Error fetching overtime data:', err);
          if (err.code === 'permission-denied') {
            setError('Permission denied: You do not have access to overtime data. Please contact your administrator.');
          } else {
            setError('Failed to fetch overtime data. Please try again.');
          }
          return;
        }

        // Fetch leave data
        try {
          const leaveRef = collection(db, 'leaveRequests');
          const leaveQuery = query(
            leaveRef,
            where('startDate', '<=', payrollPeriod.endDate),
            where('endDate', '>=', payrollPeriod.startDate),
            where('status', '==', 'Approved')
          );
          const leaveSnapshot = await getDocs(leaveQuery);
          
          const leaveRecords = [];
          leaveSnapshot.forEach((doc) => {
            leaveRecords.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setLeaveData(leaveRecords);
        } catch (err) {
          console.error('Error fetching leave data:', err);
          if (err.code === 'permission-denied') {
            setError('Permission denied: You do not have access to leave data. Please contact your administrator.');
          } else {
            setError('Failed to fetch leave data. Please try again.');
          }
          return;
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const generatePayrollPeriod = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    // First day of the month
    const startDate = new Date(year, month - 1, 1);
    // Last day of the month
    const endDate = new Date(year, month, 0);
    
    setPayrollPeriod({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      month: month,
      year: year
    });
  };

  const calculateEmployeePayroll = (employee) => {
    // Get employee's basic salary
    let basicSalary = 0;
    if (employee.salary !== undefined && employee.salary !== null) {
      if (typeof employee.salary === 'string') {
        basicSalary = parseFloat(employee.salary.replace(/[^0-9.-]+/g, '') || 0);
      } else if (typeof employee.salary === 'number') {
        basicSalary = employee.salary;
      }
    }

    // Calculate attendance-based pay
    const employeeAttendance = attendanceData.filter(record => record.employeeId === employee.id);
    const totalWorkingDays = employeeAttendance.length;
    const presentDays = employeeAttendance.filter(record => record.status === 'Present').length;
    const lateDays = employeeAttendance.filter(record => record.lateMinutes > 0).length;
    const absentDays = totalWorkingDays - presentDays;

    // Calculate daily rate
    const workingDaysInMonth = new Date(payrollPeriod.year, payrollPeriod.month, 0).getDate();
    const dailyRate = basicSalary / workingDaysInMonth;

    // Base pay calculation
    let basePay = presentDays * dailyRate;
    
    // Deduct for late arrivals (small penalty)
    const latePenalty = lateDays * (dailyRate * 0.05); // 5% penalty per late day
    basePay -= latePenalty;

    // Deduct for absences
    const absenceDeduction = absentDays * dailyRate;
    basePay -= absenceDeduction;

    // Calculate overtime pay
    const employeeOvertime = overtimeData.filter(record => record.employeeId === employee.id);
    const totalOvertimeHours = employeeOvertime.reduce((sum, record) => sum + (record.hours || 0), 0);
    const overtimeRate = (basicSalary / (workingDaysInMonth * 8)) * 1.5; // 1.5x hourly rate
    const overtimePay = totalOvertimeHours * overtimeRate;

    // Calculate leave deductions
    const employeeLeaves = leaveData.filter(record => record.employeeId === employee.id);
    const totalLeaveDays = employeeLeaves.reduce((sum, record) => {
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);
      const leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      return sum + leaveDays;
    }, 0);
    const leaveDeduction = totalLeaveDays * dailyRate;

    // Calculate allowances (fixed percentage of basic salary)
    const allowances = basicSalary * 0.1; // 10% of basic salary

    // Calculate benefits (fixed percentage of basic salary)
    const benefits = basicSalary * 0.05; // 5% of basic salary

    // Calculate gross pay
    const grossPay = basePay + overtimePay + allowances + benefits - leaveDeduction;

    // Calculate deductions
    const taxDeduction = grossPay * 0.15; // 15% tax
    const insuranceDeduction = grossPay * 0.05; // 5% insurance
    const totalDeductions = taxDeduction + insuranceDeduction;

    // Calculate net pay
    const netPay = grossPay - totalDeductions;

    return {
      employeeId: employee.id,
      employeeName: employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
      employeeCode: employee.id.substring(0, 8).toUpperCase(),
      department: employee.department || 'N/A',
      position: employee.position || 'N/A',
      basicSalary: basicSalary,
      basePay: Math.max(0, basePay),
      overtimeHours: totalOvertimeHours,
      overtimePay: overtimePay,
      allowances: allowances,
      benefits: benefits,
      leaveDeduction: leaveDeduction,
      latePenalty: latePenalty,
      absenceDeduction: absenceDeduction,
      grossPay: Math.max(0, grossPay),
      taxDeduction: taxDeduction,
      insuranceDeduction: insuranceDeduction,
      totalDeductions: totalDeductions,
      netPay: Math.max(0, netPay),
      workingDays: totalWorkingDays,
      presentDays: presentDays,
      lateDays: lateDays,
      absentDays: absentDays,
      leaveDays: totalLeaveDays,
      status: netPay > 0 ? 'Processed' : 'Suspended'
    };
  };

  const processPayroll = async () => {
    try {
      setIsProcessing(true);
      
      const payrollResults = employees.map(employee => calculateEmployeePayroll(employee));
      setProcessedPayroll(payrollResults);

      // Save processed payroll to database
      const payrollRecord = {
        period: `${payrollPeriod.year}-${String(payrollPeriod.month).padStart(2, '0')}`,
        startDate: payrollPeriod.startDate,
        endDate: payrollPeriod.endDate,
        employees: payrollResults,
        totalGrossPay: payrollResults.reduce((sum, emp) => sum + emp.grossPay, 0),
        totalDeductions: payrollResults.reduce((sum, emp) => sum + emp.totalDeductions, 0),
        totalNetPay: payrollResults.reduce((sum, emp) => sum + emp.netPay, 0),
        processedAt: serverTimestamp(),
        processedBy: 'HR System',
        status: 'Processed'
      };

      await addDoc(collection(db, 'payrollRecords'), payrollRecord);
      
      alert('Payroll processed successfully!');
    } catch (err) {
      console.error('Error processing payroll:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied: You do not have access to save payroll data. Please contact your administrator.');
        alert('Permission denied: You do not have access to save payroll data. Please contact your administrator.');
      } else {
        setError('Failed to process payroll. Please try again.');
        alert('Failed to process payroll. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const totalGross = processedPayroll.reduce((sum, emp) => sum + emp.grossPay, 0);
  const totalDeductions = processedPayroll.reduce((sum, emp) => sum + emp.totalDeductions, 0);
  const totalNet = processedPayroll.reduce((sum, emp) => sum + emp.netPay, 0);
  const processedCount = processedPayroll.filter(emp => emp.status === 'Processed').length;

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
    <PermissionGuard permission={PERMISSIONS.PAYROLL_VIEW}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payroll Processing</h2>
              <p className="text-gray-600 mt-1">Process payroll based on timekeeping data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={payrollPeriod.startDate}
                  onChange={(e) => setPayrollPeriod({...payrollPeriod, startDate: e.target.value})}
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="date"
                  value={payrollPeriod.endDate}
                  onChange={(e) => setPayrollPeriod({...payrollPeriod, endDate: e.target.value})}
                  className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <button
                onClick={generatePayrollPeriod}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Current Month
              </button>
              <button
                onClick={processPayroll}
                disabled={isProcessing || !payrollPeriod.startDate || !payrollPeriod.endDate}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Process Payroll'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Flow Visualization */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Processing Flow</h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Employee Attendance</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Timekeeping Data</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Payroll Processing</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-3 mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Payroll Register</p>
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
                <p className="text-2xl font-bold text-gray-900">₱{totalGross.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">₱{totalDeductions.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">₱{totalNet.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{processedCount}/{processedPayroll.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Processed Payroll Table */}
        {processedPayroll.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Processed Payroll - {payrollPeriod.year}-{String(payrollPeriod.month).padStart(2, '0')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedPayroll.map((employee) => (
                    <tr key={employee.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                          <div className="text-sm text-gray-500">{employee.employeeCode} • {employee.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Present: {employee.presentDays}/{employee.workingDays}</div>
                          <div className="text-xs text-gray-500">
                            {employee.lateDays > 0 && `Late: ${employee.lateDays}d`}
                            {employee.absentDays > 0 && ` • Absent: ${employee.absentDays}d`}
                            {employee.leaveDays > 0 && ` • Leave: ${employee.leaveDays}d`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{employee.basePay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>₱{employee.overtimePay.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{employee.overtimeHours}h</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{employee.allowances.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>₱{employee.totalDeductions.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Tax: ₱{employee.taxDeduction.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₱{employee.grossPay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ₱{employee.netPay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data Sources Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Attendance Data</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Records:</span>
                <span className="text-sm font-medium text-gray-900">{attendanceData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Present Days:</span>
                <span className="text-sm font-medium text-gray-900">
                  {attendanceData.filter(record => record.status === 'Present').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Late Days:</span>
                <span className="text-sm font-medium text-gray-900">
                  {attendanceData.filter(record => record.lateMinutes > 0).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Overtime Data</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approved Requests:</span>
                <span className="text-sm font-medium text-gray-900">{overtimeData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Hours:</span>
                <span className="text-sm font-medium text-gray-900">
                  {overtimeData.reduce((sum, record) => sum + (record.hours || 0), 0).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pay:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₱{overtimeData.reduce((sum, record) => sum + (record.payAmount || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Leave Data</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Approved Leaves:</span>
                <span className="text-sm font-medium text-gray-900">{leaveData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Days:</span>
                <span className="text-sm font-medium text-gray-900">
                  {leaveData.reduce((sum, record) => {
                    const startDate = new Date(record.startDate);
                    const endDate = new Date(record.endDate);
                    const leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    return sum + leaveDays;
                  }, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Period:</span>
                <span className="text-sm font-medium text-gray-900">
                  {payrollPeriod.startDate} to {payrollPeriod.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
