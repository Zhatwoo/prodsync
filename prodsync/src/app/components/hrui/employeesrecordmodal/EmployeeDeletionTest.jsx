'use client';

import { useState } from 'react';
import { deleteEmployeeCompletely, checkEmployeeAuthAccount } from '../../../lib/employeeUtils';

/**
 * Test component for employee deletion functionality
 * This component allows testing the employee deletion system
 */
export default function EmployeeDeletionTest() {
  const [testEmployeeId, setTestEmployeeId] = useState('');
  const [testEmployeeEmail, setTestEmployeeEmail] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckAuthAccount = async () => {
    if (!testEmployeeEmail) {
      alert('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      const hasAccount = await checkEmployeeAuthAccount(testEmployeeEmail);
      setTestResults(prev => ({
        ...prev,
        authCheck: {
          email: testEmployeeEmail,
          hasAccount,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error checking auth account:', error);
      alert('Error checking auth account: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDeletion = async () => {
    if (!testEmployeeId || !testEmployeeEmail) {
      alert('Please enter both Employee ID and Email');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to test delete this employee?\n\nID: ${testEmployeeId}\nEmail: ${testEmployeeEmail}\n\nThis will permanently delete the employee!`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const result = await deleteEmployeeCompletely(testEmployeeId, testEmployeeEmail);
      setTestResults(prev => ({
        ...prev,
        deletion: {
          employeeId: testEmployeeId,
          employeeEmail: testEmployeeEmail,
          result,
          timestamp: new Date().toISOString()
        }
      }));

      if (result.success) {
        alert('Employee deletion test completed successfully!');
      } else {
        alert('Employee deletion test failed: ' + result.error);
      }
    } catch (error) {
      console.error('Error testing deletion:', error);
      alert('Error testing deletion: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Employee Deletion Test</h2>
          <p className="text-gray-600 mt-1">Test the employee deletion system functionality</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Test Input Form */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={testEmployeeId}
                  onChange={(e) => setTestEmployeeId(e.target.value)}
                  placeholder="Enter employee document ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Email
                </label>
                <input
                  type="email"
                  value={testEmployeeEmail}
                  onChange={(e) => setTestEmployeeEmail(e.target.value)}
                  placeholder="Enter employee email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCheckAuthAccount}
                disabled={isLoading || !testEmployeeEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Checking...' : 'Check Auth Account'}
              </button>
              
              <button
                onClick={handleTestDeletion}
                disabled={isLoading || !testEmployeeId || !testEmployeeEmail}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Test Delete Employee'}
              </button>
              
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
              
              {/* Auth Check Results */}
              {testResults.authCheck && (
                <div className="mb-4 p-4 bg-white rounded border">
                  <h4 className="font-semibold text-gray-900 mb-2">Auth Account Check</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Email:</span> {testResults.authCheck.email}</div>
                    <div><span className="font-medium">Has Account:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        testResults.authCheck.hasAccount 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testResults.authCheck.hasAccount ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div><span className="font-medium">Checked At:</span> {new Date(testResults.authCheck.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}

              {/* Deletion Results */}
              {testResults.deletion && (
                <div className="p-4 bg-white rounded border">
                  <h4 className="font-semibold text-gray-900 mb-2">Deletion Test</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Employee ID:</span> {testResults.deletion.employeeId}</div>
                    <div><span className="font-medium">Email:</span> {testResults.deletion.employeeEmail}</div>
                    <div><span className="font-medium">Success:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        testResults.deletion.result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testResults.deletion.result.success ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {testResults.deletion.result.success ? (
                      <div><span className="font-medium">Message:</span> {testResults.deletion.result.message}</div>
                    ) : (
                      <div><span className="font-medium">Error:</span> {testResults.deletion.result.error}</div>
                    )}
                    <div><span className="font-medium">Tested At:</span> {new Date(testResults.deletion.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>1. Check Auth Account:</strong> Verify if an employee has a Firebase authentication account.</p>
              <p><strong>2. Test Delete Employee:</strong> Permanently delete an employee and their authentication account.</p>
              <p><strong>⚠️ Warning:</strong> The deletion test will permanently remove the employee from both the database and Firebase authentication. Use with caution!</p>
              <p><strong>💡 Tip:</strong> Create a test employee first before testing the deletion functionality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
