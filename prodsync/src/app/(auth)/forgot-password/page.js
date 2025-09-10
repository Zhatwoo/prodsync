'use client';

import { useAuth } from '../../../contexts/AuthContext';
import AuthForm from '../../../components/AuthForm';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    clearError();
    setSuccess(false);
    const result = await resetPassword(data.email);
    
    if (result.success) {
      setSuccess(true);
    }
    
    return result;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We've sent password reset instructions to your email address.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200">
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      Password reset instructions have been sent to your email address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Send Another Email
                  </button>
                  
                  <a
                    href="/sign-in"
                    className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Back to Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
            <p className="text-xs text-blue-700">
              If you're still having trouble accessing your account, please contact our support team at{' '}
              <a href="mailto:support@prodsync.com" className="font-medium underline">
                support@prodsync.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      mode="forgot-password"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
