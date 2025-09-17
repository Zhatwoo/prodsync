'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Reset password with token:', token);
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400/30 rounded-full animate-ping animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-ping animation-delay-4000"></div>
        </div>

        <div className="relative w-full max-w-md z-10">
          {/* Success Message */}
          <div className="text-center">
            <Link href="/" className="group inline-flex items-center">
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-500 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="absolute inset-0 rounded-3xl border-2 border-green-400/30 animate-ping"></div>
              </div>
            </Link>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Success Icon */}
              <div className="relative z-10 mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 backdrop-blur-sm mb-6 animate-pulse-glow">
                <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Password Updated!
              </h2>
              
              <p className="text-blue-100/80 mb-8 text-lg leading-relaxed">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              
              <Link 
                href="/auth/login" 
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-2xl text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-green-500/25 overflow-hidden"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <div className="relative z-10 flex items-center">
                  <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign in to your account</span>
                </div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-ping animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-ping animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="group inline-flex items-center">
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/30 animate-ping"></div>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-blue-100/80 text-lg">Enter your new password below</p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
          {/* Card Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                New password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                    errors.password ? 'border-red-400/60' : 'border-white/20'
                  }`}
                  placeholder="Enter your new password"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                  errors.password ? 'from-red-500/20 to-red-500/20' : ''
                }`}></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Confirm new password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                    errors.confirmPassword ? 'border-red-400/60' : 'border-white/20'
                  }`}
                  placeholder="Confirm your new password"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                  errors.confirmPassword ? 'from-red-500/20 to-red-500/20' : ''
                }`}></div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-white/90 mb-4">Password requirements:</h4>
              <ul className="text-sm text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="relative">
                    <svg className={`h-5 w-5 mr-3 ${formData.password.length >= 8 ? 'text-green-400' : 'text-white/40'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {formData.password.length >= 8 && (
                      <div className="absolute inset-0 w-5 h-5 bg-green-400/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <div className="relative">
                    <svg className={`h-5 w-5 mr-3 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : 'text-white/40'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {/(?=.*[a-z])/.test(formData.password) && (
                      <div className="absolute inset-0 w-5 h-5 bg-green-400/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <div className="relative">
                    <svg className={`h-5 w-5 mr-3 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-white/40'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {/(?=.*[A-Z])/.test(formData.password) && (
                      <div className="absolute inset-0 w-5 h-5 bg-green-400/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <div className="relative">
                    <svg className={`h-5 w-5 mr-3 ${/(?=.*\d)/.test(formData.password) ? 'text-green-400' : 'text-white/40'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {/(?=.*\d)/.test(formData.password) && (
                      <div className="absolute inset-0 w-5 h-5 bg-green-400/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-2xl text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-blue-500/25 overflow-hidden"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <div className="relative">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                    </div>
                    <span className="animate-pulse">Updating password...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Update password</span>
                  </>
                )}
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

