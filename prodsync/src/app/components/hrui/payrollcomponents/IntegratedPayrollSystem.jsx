'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import PermissionGuard from '../../PermissionGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';

export default function IntegratedPayrollSystem() {
  const [systemStatus, setSystemStatus] = useState({
    attendanceData: 0,
    timekeepingRecords: 0,
    overtimeRequests: 0,
    leaveRequests: 0,
    payrollRecords: 0,
    salaryReleases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Permission checking
  const { can, canPerform, isHR, isAdmin } = usePermissions();

  // Fetch system status
  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch attendance data count
      const attendanceRef = collection(db, 'attendance');
      const attendanceSnapshot = await getDocs(attendanceRef);
      const attendanceCount = attendanceSnapshot.size;

      // Fetch timekeeping records count
      const timeEntriesRef = collection(db, 'timeEntries');
      const timeEntriesSnapshot = await getDocs(timeEntriesRef);
      const timekeepingCount = timeEntriesSnapshot.size;

      // Fetch overtime requests count
      const overtimeRef = collection(db, 'overtimeRequests');
      const overtimeSnapshot = await getDocs(overtimeRef);
      const overtimeCount = overtimeSnapshot.size;

      // Fetch leave requests count
      const leaveRef = collection(db, 'leaveRequests');
      const leaveSnapshot = await getDocs(leaveRef);
      const leaveCount = leaveSnapshot.size;

      // Fetch payroll records count
      const payrollRef = collection(db, 'payrollRecords');
      const payrollSnapshot = await getDocs(payrollRef);
      const payrollCount = payrollSnapshot.size;

      // Fetch salary releases count
      const salaryReleaseRef = collection(db, 'salaryReleases');
      const salaryReleaseSnapshot = await getDocs(salaryReleaseRef);
      const salaryReleaseCount = salaryReleaseSnapshot.size;

      setSystemStatus({
        attendanceData: attendanceCount,
        timekeepingRecords: timekeepingCount,
        overtimeRequests: overtimeCount,
        leaveRequests: leaveCount,
        payrollRecords: payrollCount,
        salaryReleases: salaryReleaseCount
      });

    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to load system status');
    } finally {
      setLoading(false);
    }
  };

  const getSystemHealth = () => {
    const totalData = Object.values(systemStatus).reduce((sum, count) => sum + count, 0);
    if (totalData === 0) return { status: 'No Data', color: 'bg-gray-100 text-gray-800' };
    if (systemStatus.payrollRecords > 0 && systemStatus.salaryReleases > 0) {
      return { status: 'Fully Operational', color: 'bg-green-100 text-green-800' };
    }
    if (systemStatus.attendanceData > 0 && systemStatus.timekeepingRecords > 0) {
      return { status: 'Data Available', color: 'bg-blue-100 text-blue-800' };
    }
    return { status: 'Initializing', color: 'bg-yellow-100 text-yellow-800' };
  };

  const systemHealth = getSystemHealth();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading system status...</div>
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
              <h2 className="text-2xl font-bold text-gray-900">Integrated Payroll System</h2>
              <p className="text-gray-600 mt-1">Complete workflow from attendance to salary release</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${systemHealth.color}`}>
                {systemHealth.status}
              </span>
              <button
                onClick={fetchSystemStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>

        {/* System Flow Diagram */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Complete Payroll System Flow</h3>
          
          {/* Flow Steps */}
          <div className="space-y-6">
            {/* Step 1: Employee Attendance */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">1. Employee Attendance</h4>
                <p className="text-gray-600">Timecard system records employee check-in/check-out times</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Records: {systemStatus.attendanceData}</span>
                  <span className="text-sm text-blue-600">✓ Timecard Integration</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Step 2: Timekeeping System */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">2. Timekeeping Data Processing</h4>
                <p className="text-gray-600">System processes attendance records, calculates tardiness, overtime, and absences</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Time Entries: {systemStatus.timekeepingRecords}</span>
                  <span className="text-sm text-gray-500">Overtime: {systemStatus.overtimeRequests}</span>
                  <span className="text-sm text-gray-500">Leaves: {systemStatus.leaveRequests}</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Step 3: Payroll Processing */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">3. Payroll Processing</h4>
                <p className="text-gray-600">Calculate base salary, add overtime, deduct lates/absences, add allowances/benefits</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Processed: {systemStatus.payrollRecords}</span>
                  <span className="text-sm text-purple-600">✓ Automated Calculations</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Step 4: Payroll Register */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">4. Payroll Register</h4>
                <p className="text-gray-600">Generate listahan ng net pay bawat employee with detailed breakdown</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-yellow-600">✓ Net Pay Listing</span>
                  <span className="text-sm text-yellow-600">✓ Detailed Reports</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Step 5: Payslip Generation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">5. Payslip Generation</h4>
                <p className="text-gray-600">Generate individual payslips showing gross pay, deductions, and net pay</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-red-600">✓ Individual Payslips</span>
                  <span className="text-sm text-red-600">✓ Download/Print Ready</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Step 6: Salary Release */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-6 flex-1">
                <h4 className="text-lg font-semibold text-gray-900">6. Salary Release</h4>
                <p className="text-gray-600">Distribute salaries via bank transfer, cash, or check</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Released: {systemStatus.salaryReleases}</span>
                  <span className="text-sm text-indigo-600">✓ Multiple Payment Methods</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attendance Records:</span>
                <span className="text-sm font-medium">{systemStatus.attendanceData}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time Entries:</span>
                <span className="text-sm font-medium">{systemStatus.timekeepingRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overtime Requests:</span>
                <span className="text-sm font-medium">{systemStatus.overtimeRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Leave Requests:</span>
                <span className="text-sm font-medium">{systemStatus.leaveRequests}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Processing Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payroll Records:</span>
                <span className="text-sm font-medium">{systemStatus.payrollRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salary Releases:</span>
                <span className="text-sm font-medium">{systemStatus.salaryReleases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">System Health:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${systemHealth.color}`}>
                  {systemHealth.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Timecard Integration</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Overtime Management</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Leave Management</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Automated Calculations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="text-sm font-medium text-gray-900">Process Payroll</div>
                <div className="text-xs text-gray-500">Calculate salaries</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div className="text-sm font-medium text-gray-900">View Register</div>
                <div className="text-xs text-gray-500">Net pay listing</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-red-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-sm font-medium text-gray-900">Generate Payslips</div>
                <div className="text-xs text-gray-500">Individual payslips</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div className="text-sm font-medium text-gray-900">Release Salary</div>
                <div className="text-xs text-gray-500">Bank/Cash/Check</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
