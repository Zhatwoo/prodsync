'use client';

import { useState } from 'react';

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState(null);
  const [configResults, setConfigResults] = useState(null);
  const [debugResults, setDebugResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isLoadingDebug, setIsLoadingDebug] = useState(false);

  const testFirebaseAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-firebase-admin');
      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkFirebaseConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const response = await fetch('/api/check-firebase-config');
      const result = await response.json();
      setConfigResults(result);
    } catch (error) {
      setConfigResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const debugFirebaseAdmin = async () => {
    setIsLoadingDebug(true);
    try {
      const response = await fetch('/api/debug-firebase-admin');
      const result = await response.json();
      setDebugResults(result);
    } catch (error) {
      setDebugResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoadingDebug(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Firebase Admin Test</h2>
          <p className="text-gray-600 mt-1">Test Firebase Admin SDK connection and configuration</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Firebase Configuration & Testing</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={checkFirebaseConfig}
                disabled={isLoadingConfig}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoadingConfig ? 'Checking...' : 'Check Configuration'}
              </button>
              <button
                onClick={debugFirebaseAdmin}
                disabled={isLoadingDebug}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoadingDebug ? 'Debugging...' : 'Debug Firebase Admin'}
              </button>
              <button
                onClick={testFirebaseAdmin}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Firebase Admin'}
              </button>
            </div>
          </div>

          {configResults && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Check</h3>
              <div className="bg-white rounded border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Overall Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      configResults.config?.configured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {configResults.config?.configured ? 'Configured' : 'Not Configured'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Project ID:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      configResults.config?.hasProjectId 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {configResults.config?.hasProjectId ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Client Email:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      configResults.config?.hasClientEmail 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {configResults.config?.hasClientEmail ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Private Key:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      configResults.config?.hasPrivateKey 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {configResults.config?.hasPrivateKey ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Private Key Valid:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      configResults.config?.privateKeyValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {configResults.config?.privateKeyValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  
                  {configResults.config?.projectId && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Project ID:</span>
                      <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {configResults.config.projectId}
                      </span>
                    </div>
                  )}
                  
                  {configResults.config?.clientEmail && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Client Email:</span>
                      <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {configResults.config.clientEmail}
                      </span>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <span className="font-medium">Private Key Length:</span>
                    <span className="ml-2">{configResults.config?.privateKeyLength || 0} characters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {debugResults && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Results</h3>
              <div className="bg-white rounded border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Initialization:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugResults.initialization?.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debugResults.initialization?.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Method:</span>
                    <span className="ml-2 text-gray-700">{debugResults.initialization?.method || 'N/A'}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Firestore:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugResults.connections?.firestore 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debugResults.connections?.firestore ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Authentication:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugResults.connections?.auth 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debugResults.connections?.auth ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">DB Admin:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugResults.services?.hasDbAdmin 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debugResults.services?.hasDbAdmin ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Auth Admin:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      debugResults.services?.hasAuthAdmin 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {debugResults.services?.hasAuthAdmin ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  {debugResults.initialization?.error && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Error:</span>
                      <span className="ml-2 text-red-600">{debugResults.initialization.error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {testResults && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
              <div className="bg-white rounded border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Success:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      testResults.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {testResults.success ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  {testResults.results && (
                    <>
                      <div>
                        <span className="font-medium">Firebase Admin:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          testResults.results.firebaseAdminInitialized 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testResults.results.firebaseAdminInitialized ? 'Initialized' : 'Failed'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Firestore:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          testResults.results.firestoreConnection 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testResults.results.firestoreConnection ? 'Connected' : 'Failed'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Authentication:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          testResults.results.authConnection 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testResults.results.authConnection ? 'Connected' : 'Failed'}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {testResults.error && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Error:</span>
                      <span className="ml-2 text-red-600">{testResults.error}</span>
                    </div>
                  )}
                  
                  {testResults.results?.timestamp && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Tested At:</span>
                      <span className="ml-2">{new Date(testResults.results.timestamp).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Troubleshooting</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>If Firebase Admin fails to initialize:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check environment variables in your .env.local file</li>
                <li>Verify Firebase service account credentials</li>
                <li>Ensure private key is properly formatted with quotes and escaped newlines</li>
                <li>Restart your development server after changing environment variables</li>
              </ul>
              
              <p><strong>Required Environment Variables:</strong></p>
              <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                <div>FIREBASE_PROJECT_ID=your-project-id</div>
                <div>FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com</div>
                <div>FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"</div>
              </div>
              
              <p><strong>If Firestore connection fails:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check Firestore security rules</li>
                <li>Verify project ID is correct</li>
                <li>Ensure service account has Firestore permissions</li>
              </ul>
              
              <p><strong>If Authentication connection fails:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check Firebase Auth configuration</li>
                <li>Verify service account has Auth permissions</li>
                <li>Ensure project has Authentication enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
