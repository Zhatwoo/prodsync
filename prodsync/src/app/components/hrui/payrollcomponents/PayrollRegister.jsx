'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import PermissionGuard from '../../PermissionGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';

export default function PayrollRegister() {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Permission checking
  const { can, canPerform, isHR, isAdmin } = usePermissions();

  // Fetch payroll records
  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const payrollRef = collection(db, 'payrollRecords');
      const payrollQuery = query(payrollRef, orderBy('processedAt', 'desc'));
      const payrollSnapshot = await getDocs(payrollQuery);
      
      const records = [];
      payrollSnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setPayrollRecords(records);
      
      // Set the latest period as default
      if (records.length > 0) {
        setSelectedPeriod(records[0].period);
        setCurrentPayroll(records[0]);
      }
    } catch (err) {
      console.error('Error fetching payroll records:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied: You do not have access to payroll records. Please contact your administrator.');
      } else {
        setError('Failed to load payroll records. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const selectedRecord = payrollRecords.find(record => record.period === period);
    setCurrentPayroll(selectedRecord);
  };

  const generatePayslip = (employee) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  const exportPayrollRegister = () => {
    if (!currentPayroll) return;

    const reportDate = new Date();
    const formattedDate = reportDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate professional payroll register document
    const docContent = `
PAYROLL REGISTER
${currentPayroll.period}

================================================================================

EXECUTIVE SUMMARY
================================================================================

Payroll Period: ${currentPayroll.period}
Start Date: ${currentPayroll.startDate}
End Date: ${currentPayroll.endDate}
Processed At: ${currentPayroll.processedAt?.toDate ? currentPayroll.processedAt.toDate().toLocaleString() : 'N/A'}
Processed By: ${currentPayroll.processedBy}

Total Employees: ${currentPayroll.employees.length}
Total Gross Pay: $${currentPayroll.totalGrossPay.toLocaleString()}
Total Deductions: $${currentPayroll.totalDeductions.toLocaleString()}
Total Net Pay: $${currentPayroll.totalNetPay.toLocaleString()}

================================================================================

PAYROLL REGISTER DETAILS
================================================================================

Employee Name          | Employee ID | Department    | Position      | Base Pay | Overtime | Allowances | Deductions | Gross Pay | Net Pay
${'='.repeat(120)}
${currentPayroll.employees.map(emp => {
  const name = emp.employeeName.padEnd(20);
  const id = emp.employeeCode.padEnd(10);
  const dept = emp.department.padEnd(12);
  const pos = emp.position.padEnd(12);
  const basePay = `$${emp.basePay.toLocaleString()}`.padEnd(8);
  const overtime = `$${emp.overtimePay.toLocaleString()}`.padEnd(8);
  const allowances = `$${emp.allowances.toLocaleString()}`.padEnd(10);
  const deductions = `$${emp.totalDeductions.toLocaleString()}`.padEnd(10);
  const gross = `$${emp.grossPay.toLocaleString()}`.padEnd(9);
  const net = `$${emp.netPay.toLocaleString()}`.padEnd(7);
  
  return `${name} | ${id} | ${dept} | ${pos} | ${basePay} | ${overtime} | ${allowances} | ${deductions} | ${gross} | ${net}`;
}).join('\n')}

================================================================================

DEPARTMENT BREAKDOWN
================================================================================

${[...new Set(currentPayroll.employees.map(emp => emp.department))].map(dept => {
  const deptEmployees = currentPayroll.employees.filter(emp => emp.department === dept);
  const deptGross = deptEmployees.reduce((sum, emp) => sum + emp.grossPay, 0);
  const deptDeductions = deptEmployees.reduce((sum, emp) => sum + emp.totalDeductions, 0);
  const deptNet = deptEmployees.reduce((sum, emp) => sum + emp.netPay, 0);
  
  return `${dept}:
  Employees: ${deptEmployees.length}
  Gross Pay: $${deptGross.toLocaleString()}
  Deductions: $${deptDeductions.toLocaleString()}
  Net Pay: $${deptNet.toLocaleString()}
  
`;
}).join('')}

================================================================================

ATTENDANCE SUMMARY
================================================================================

${currentPayroll.employees.map(emp => {
  return `${emp.employeeName} (${emp.department}):
  Working Days: ${emp.workingDays}
  Present Days: ${emp.presentDays}
  Late Days: ${emp.lateDays}
  Absent Days: ${emp.absentDays}
  Leave Days: ${emp.leaveDays}
  Overtime Hours: ${emp.overtimeHours}h
  
`;
}).join('')}

================================================================================

REPORT INFORMATION
================================================================================

Generated by: ProdSync Human Resources Management System
Report Date: ${formattedDate}
Generated on: ${new Date().toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

This report was automatically generated by the payroll management system.
For questions or clarifications, please contact the HR Department.

================================================================================
END OF REPORT
================================================================================
`;

    // Download Word document
    const docBlob = new Blob([docContent], { type: 'application/msword' });
    const docUrl = URL.createObjectURL(docBlob);
    const docLink = document.createElement('a');
    docLink.href = docUrl;
    docLink.download = `Payroll_Register_${currentPayroll.period}.doc`;
    document.body.appendChild(docLink);
    docLink.click();
    document.body.removeChild(docLink);
    URL.revokeObjectURL(docUrl);
    
    alert('Payroll register exported successfully!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading payroll register...</div>
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
              <h2 className="text-2xl font-bold text-gray-900">Payroll Register</h2>
              <p className="text-gray-600 mt-1">Listahan ng net pay bawat employee</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {payrollRecords.map(record => (
                  <option key={record.period} value={record.period}>{record.period}</option>
                ))}
              </select>
              <button
                onClick={exportPayrollRegister}
                disabled={!currentPayroll}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Export Register
              </button>
            </div>
          </div>
        </div>

        {currentPayroll ? (
          <>
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
                    <p className="text-2xl font-bold text-gray-900">₱{currentPayroll.totalGrossPay.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-gray-900">₱{currentPayroll.totalDeductions.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-gray-900">₱{currentPayroll.totalNetPay.toLocaleString()}</p>
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
                    <p className="text-sm font-medium text-gray-600">Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{currentPayroll.employees.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Register Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payroll Register - {currentPayroll.period}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Period: {currentPayroll.startDate} to {currentPayroll.endDate}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPayroll.employees.map((employee) => (
                      <tr key={employee.employeeId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                            <div className="text-sm text-gray-500">{employee.employeeCode} • {employee.position}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => generatePayslip(employee)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Generate Payslip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Data</h3>
              <p className="text-gray-500">No payroll records found. Process payroll first to view the register.</p>
            </div>
          </div>
        )}

        {/* Payslip Modal */}
        {showPayslipModal && selectedEmployee && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payslip Preview</h3>
                <button 
                  onClick={() => setShowPayslipModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">PAYSLIP</h2>
                  <p className="text-gray-600">Period: {currentPayroll.period}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Employee Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedEmployee.employeeName}</p>
                      <p><span className="font-medium">ID:</span> {selectedEmployee.employeeCode}</p>
                      <p><span className="font-medium">Department:</span> {selectedEmployee.department}</p>
                      <p><span className="font-medium">Position:</span> {selectedEmployee.position}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pay Period</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Start Date:</span> {currentPayroll.startDate}</p>
                      <p><span className="font-medium">End Date:</span> {currentPayroll.endDate}</p>
                      <p><span className="font-medium">Working Days:</span> {selectedEmployee.workingDays}</p>
                      <p><span className="font-medium">Present Days:</span> {selectedEmployee.presentDays}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Earnings</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base Pay:</span>
                        <span>₱{selectedEmployee.basePay.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime ({selectedEmployee.overtimeHours}h):</span>
                        <span>₱{selectedEmployee.overtimePay.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances:</span>
                        <span>₱{selectedEmployee.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Benefits:</span>
                        <span>₱{selectedEmployee.benefits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-semibold">
                        <span>Gross Pay:</span>
                        <span>₱{selectedEmployee.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deductions</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₱{selectedEmployee.taxDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>₱{selectedEmployee.insuranceDeduction.toLocaleString()}</span>
                      </div>
                      {selectedEmployee.latePenalty > 0 && (
                        <div className="flex justify-between">
                          <span>Late Penalty:</span>
                          <span>₱{selectedEmployee.latePenalty.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedEmployee.absenceDeduction > 0 && (
                        <div className="flex justify-between">
                          <span>Absence Deduction:</span>
                          <span>₱{selectedEmployee.absenceDeduction.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedEmployee.leaveDeduction > 0 && (
                        <div className="flex justify-between">
                          <span>Leave Deduction:</span>
                          <span>₱{selectedEmployee.leaveDeduction.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-1 font-semibold">
                        <span>Total Deductions:</span>
                        <span>₱{selectedEmployee.totalDeductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>NET PAY:</span>
                    <span className="text-green-600">₱{selectedEmployee.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowPayslipModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    // Generate and download payslip
                    const payslipContent = `
PAYSLIP
${currentPayroll.period}

Employee: ${selectedEmployee.employeeName}
ID: ${selectedEmployee.employeeCode}
Department: ${selectedEmployee.department}
Position: ${selectedEmployee.position}

Period: ${currentPayroll.startDate} to ${currentPayroll.endDate}

EARNINGS:
Base Pay: $${selectedEmployee.basePay.toLocaleString()}
Overtime (${selectedEmployee.overtimeHours}h): $${selectedEmployee.overtimePay.toLocaleString()}
Allowances: $${selectedEmployee.allowances.toLocaleString()}
Benefits: $${selectedEmployee.benefits.toLocaleString()}
TOTAL EARNINGS: $${selectedEmployee.grossPay.toLocaleString()}

DEDUCTIONS:
Tax: $${selectedEmployee.taxDeduction.toLocaleString()}
Insurance: $${selectedEmployee.insuranceDeduction.toLocaleString()}
${selectedEmployee.latePenalty > 0 ? `Late Penalty: $${selectedEmployee.latePenalty.toLocaleString()}` : ''}
${selectedEmployee.absenceDeduction > 0 ? `Absence Deduction: $${selectedEmployee.absenceDeduction.toLocaleString()}` : ''}
${selectedEmployee.leaveDeduction > 0 ? `Leave Deduction: $${selectedEmployee.leaveDeduction.toLocaleString()}` : ''}
TOTAL DEDUCTIONS: $${selectedEmployee.totalDeductions.toLocaleString()}

NET PAY: $${selectedEmployee.netPay.toLocaleString()}

Generated on: ${new Date().toLocaleString()}
                    `;
                    
                    const blob = new Blob([payslipContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Payslip_${selectedEmployee.employeeName}_${currentPayroll.period}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    setShowPayslipModal(false);
                    alert('Payslip downloaded successfully!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download Payslip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
