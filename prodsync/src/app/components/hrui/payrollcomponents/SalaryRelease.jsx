'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import PermissionGuard from '../../PermissionGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';

export default function SalaryRelease() {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [releaseMethod, setReleaseMethod] = useState('bank_transfer');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [releaseStatus, setReleaseStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseDetails, setReleaseDetails] = useState({
    releaseDate: new Date().toISOString().split('T')[0],
    releaseMethod: 'bank_transfer',
    referenceNumber: '',
    notes: ''
  });

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
      setError('Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const selectedRecord = payrollRecords.find(record => record.period === period);
    setCurrentPayroll(selectedRecord);
    setSelectedEmployees([]);
    setReleaseStatus({});
  };

  const handleEmployeeSelect = (employeeId, isSelected) => {
    if (isSelected) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === currentPayroll.employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(currentPayroll.employees.map(emp => emp.employeeId));
    }
  };

  const handleReleaseSalary = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees to release salary');
      return;
    }
    setShowReleaseModal(true);
  };

  const processSalaryRelease = async () => {
    try {
      setIsProcessing(true);
      
      const selectedEmployeesData = currentPayroll.employees.filter(emp => 
        selectedEmployees.includes(emp.employeeId)
      );

      // Create salary release record
      const releaseRecord = {
        period: currentPayroll.period,
        releaseDate: releaseDetails.releaseDate,
        releaseMethod: releaseDetails.releaseMethod,
        referenceNumber: releaseDetails.referenceNumber,
        notes: releaseDetails.notes,
        employees: selectedEmployeesData.map(emp => ({
          employeeId: emp.employeeId,
          employeeName: emp.employeeName,
          employeeCode: emp.employeeCode,
          department: emp.department,
          netPay: emp.netPay,
          status: 'Released'
        })),
        totalAmount: selectedEmployeesData.reduce((sum, emp) => sum + emp.netPay, 0),
        releasedBy: 'HR System',
        releasedAt: serverTimestamp(),
        status: 'Completed'
      };

      await addDoc(collection(db, 'salaryReleases'), releaseRecord);

      // Update release status for selected employees
      const updatedStatus = {};
      selectedEmployeesData.forEach(emp => {
        updatedStatus[emp.employeeId] = 'Released';
      });
      setReleaseStatus(prev => ({ ...prev, ...updatedStatus }));

      setShowReleaseModal(false);
      setSelectedEmployees([]);
      setReleaseDetails({
        releaseDate: new Date().toISOString().split('T')[0],
        releaseMethod: 'bank_transfer',
        referenceNumber: '',
        notes: ''
      });

      alert(`Salary released successfully for ${selectedEmployeesData.length} employees!\nTotal Amount: $${releaseRecord.totalAmount.toLocaleString()}`);
    } catch (err) {
      console.error('Error releasing salary:', err);
      alert('Failed to release salary');
    } finally {
      setIsProcessing(false);
    }
  };

  const getReleaseStatusColor = (employeeId) => {
    const status = releaseStatus[employeeId];
    switch (status) {
      case 'Released': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReleaseStatusText = (employeeId) => {
    const status = releaseStatus[employeeId];
    return status || 'Not Released';
  };

  const totalSelectedAmount = currentPayroll ? 
    currentPayroll.employees
      .filter(emp => selectedEmployees.includes(emp.employeeId))
      .reduce((sum, emp) => sum + emp.netPay, 0) : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading salary release data...</div>
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
              <h2 className="text-2xl font-bold text-gray-900">Salary Release</h2>
              <p className="text-gray-600 mt-1">Bank transfer / Cash / Check salary distribution</p>
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
                onClick={handleReleaseSalary}
                disabled={selectedEmployees.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Release Salary ({selectedEmployees.length})
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{currentPayroll.employees.length}</p>
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
                    <p className="text-sm font-medium text-gray-600">Selected</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedEmployees.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₱{currentPayroll.totalNetPay.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Selected Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₱{totalSelectedAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Release Method Selection */}
            <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Release Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                  releaseMethod === 'bank_transfer' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="releaseMethod"
                    value="bank_transfer"
                    checked={releaseMethod === 'bank_transfer'}
                    onChange={(e) => setReleaseMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Bank Transfer</div>
                      <div className="text-sm text-gray-500">Direct deposit to employee accounts</div>
                    </div>
                  </div>
                </label>

                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                  releaseMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="releaseMethod"
                    value="cash"
                    checked={releaseMethod === 'cash'}
                    onChange={(e) => setReleaseMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Cash</div>
                      <div className="text-sm text-gray-500">Physical cash distribution</div>
                    </div>
                  </div>
                </label>

                <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${
                  releaseMethod === 'check' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="releaseMethod"
                    value="check"
                    checked={releaseMethod === 'check'}
                    onChange={(e) => setReleaseMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Check</div>
                      <div className="text-sm text-gray-500">Physical check distribution</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Employee Selection Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Employee Salary Release - {currentPayroll.period}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      {selectedEmployees.length === currentPayroll.employees.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.length === currentPayroll.employees.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPayroll.employees.map((employee) => (
                      <tr key={employee.employeeId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.employeeId)}
                            onChange={(e) => handleEmployeeSelect(employee.employeeId, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                            <div className="text-sm text-gray-500">{employee.employeeCode} • {employee.position}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          ₱{employee.netPay.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReleaseStatusColor(employee.employeeId)}`}>
                            {getReleaseStatusText(employee.employeeId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              if (selectedEmployees.includes(employee.employeeId)) {
                                handleEmployeeSelect(employee.employeeId, false);
                              } else {
                                handleEmployeeSelect(employee.employeeId, true);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {selectedEmployees.includes(employee.employeeId) ? 'Deselect' : 'Select'}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Data</h3>
              <p className="text-gray-500">No payroll records found. Process payroll first to release salaries.</p>
            </div>
          </div>
        )}

        {/* Release Modal */}
        {showReleaseModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Confirm Salary Release</h3>
                <button 
                  onClick={() => setShowReleaseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                  <input
                    type="date"
                    value={releaseDetails.releaseDate}
                    onChange={(e) => setReleaseDetails({...releaseDetails, releaseDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Method</label>
                  <select
                    value={releaseDetails.releaseMethod}
                    onChange={(e) => setReleaseDetails({...releaseDetails, releaseMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={releaseDetails.referenceNumber}
                    onChange={(e) => setReleaseDetails({...releaseDetails, referenceNumber: e.target.value})}
                    placeholder="Enter reference number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={releaseDetails.notes}
                    onChange={(e) => setReleaseDetails({...releaseDetails, notes: e.target.value})}
                    placeholder="Enter any additional notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>Selected Employees:</span>
                      <span className="font-medium">{selectedEmployees.length}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Total Amount:</span>
                      <span className="font-medium">₱{totalSelectedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Release Method:</span>
                      <span className="font-medium capitalize">{releaseDetails.releaseMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={processSalaryRelease}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Release'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
