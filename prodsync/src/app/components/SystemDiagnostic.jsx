'use client';

import { useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../lib/firebaseClient';

export default function SystemDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {};

    // 1. Check Firebase Client Configuration
    results.firebaseClient = {
      configured: isFirebaseConfigured(),
      authObject: !!auth,
      authApp: auth?.app ? !!auth.app : false,
      authOptions: auth?.app?.options ? !!auth.app.options : false
    };

    // 2. Check Environment Variables
    results.environment = {
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };

    // 3. Test API Endpoint
    try {
      const response = await fetch('/api/getRole?uid=test');
      results.apiEndpoint = {
        reachable: true,
        status: response.status,
        contentType: response.headers.get('content-type'),
        isJson: response.headers.get('content-type')?.includes('application/json')
      };
    } catch (error) {
      results.apiEndpoint = {
        reachable: false,
        error: error.message
      };
    }

    // 4. Check Browser Environment
    results.browser = {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      protocol: window.location.protocol,
      host: window.location.host
    };

    setDiagnostics(results);
    setIsLoading(false);
  };

  const testLoginFlow = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test Firebase Auth initialization
      if (!auth) {
        results.authInit = { success: false, error: 'Auth object not available' };
      } else if (!auth.app) {
        results.authInit = { success: false, error: 'Auth app not initialized' };
      } else if (!auth.app.options) {
        results.authInit = { success: false, error: 'Auth options not available' };
      } else {
        results.authInit = { 
          success: true, 
          authDomain: auth.app.options.authDomain,
          projectId: auth.app.options.projectId
        };
      }

      // Test API endpoint with a dummy UID
      const testResponse = await fetch('/api/getRole?uid=test-uid-12345');
      const responseText = await testResponse.text();
      
      results.apiTest = {
        status: testResponse.status,
        contentType: testResponse.headers.get('content-type'),
        response: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
        isJson: testResponse.headers.get('content-type')?.includes('application/json')
      };

    } catch (error) {
      results.apiTest = {
        error: error.message,
        stack: error.stack
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === true || status === 'success') return 'text-green-600 bg-green-100';
    if (status === false || status === 'error') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusIcon = (status) => {
    if (status === true || status === 'success') return '✅';
    if (status === false || status === 'error') return '❌';
    return '⚠️';
  };

  if (isLoading && Object.keys(diagnostics).length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-2">Running system diagnostics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Diagnostic Tool</h2>
        <div className="flex space-x-2">
          <button
            onClick={runDiagnostics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Diagnostics
          </button>
          <button
            onClick={testLoginFlow}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Login Flow'}
          </button>
        </div>
      </div>

      {/* Firebase Client Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Firebase Client Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(diagnostics.firebaseClient || {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{key}</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(value)}`}>
                {getStatusIcon(value)} {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Environment Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(diagnostics.environment || {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{key}</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(value)}`}>
                {getStatusIcon(value)} {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoint Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">API Endpoint Test</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          {diagnostics.apiEndpoint ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Reachable</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(diagnostics.apiEndpoint.reachable)}`}>
                  {getStatusIcon(diagnostics.apiEndpoint.reachable)} {String(diagnostics.apiEndpoint.reachable)}
                </span>
              </div>
              {diagnostics.apiEndpoint.status && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Status Code</span>
                  <span className="text-sm text-gray-600">{diagnostics.apiEndpoint.status}</span>
                </div>
              )}
              {diagnostics.apiEndpoint.contentType && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Content Type</span>
                  <span className="text-sm text-gray-600">{diagnostics.apiEndpoint.contentType}</span>
                </div>
              )}
              {diagnostics.apiEndpoint.error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-700 text-sm">{diagnostics.apiEndpoint.error}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No API test results available</p>
          )}
        </div>
      </div>

      {/* Login Flow Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Login Flow Test Results</h3>
          <div className="space-y-4">
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{key}</h4>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browser Environment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser Environment</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            {Object.entries(diagnostics.browser || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-sm text-gray-600 max-w-md truncate">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Recommendations</h3>
        <ul className="text-blue-800 space-y-1">
          <li>• Ensure all Firebase environment variables are properly set in .env.local</li>
          <li>• Check that the development server is running (npm run dev)</li>
          <li>• Verify Firebase project configuration matches your .env.local file</li>
          <li>• Check browser console for additional error messages</li>
          <li>• Ensure you have a user account created in the Firebase Authentication console</li>
        </ul>
      </div>
    </div>
  );
}
