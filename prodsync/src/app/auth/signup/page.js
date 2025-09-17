'use client';
// change: signup page writes user + role to firestore
// why: store role centrally so frontend can read & render the right dashboard

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDashboardRoute, availableRoles } from '../../lib/roleRoutes';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'Sales', // default role
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
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
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Create user with Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCred.user.uid;

      // Save user data and role in Firestore
      await setDoc(doc(db, "users", uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        createdAt: new Date()
      });

      // Redirect to appropriate dashboard based on role
      const redirectPath = getDashboardRoute(formData.role);
      router.push(redirectPath);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradientSignup" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgba(59, 130, 246, 0.1)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(139, 92, 246, 0.1)', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M0,20 Q25,50 50,30 T100,40" stroke="url(#lineGradientSignup)" strokeWidth="0.5" fill="none" opacity="0.6">
              <animate attributeName="d" values="M0,20 Q25,50 50,30 T100,40;M0,30 Q25,40 50,50 T100,20;M0,20 Q25,50 50,30 T100,40" dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M0,80 Q25,50 50,70 T100,60" stroke="url(#lineGradientSignup)" strokeWidth="0.5" fill="none" opacity="0.4">
              <animate attributeName="d" values="M0,80 Q25,50 50,70 T100,60;M0,70 Q25,60 50,80 T100,70;M0,80 Q25,50 50,70 T100,60" dur="10s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
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
            Create Account
          </h1>
          <p className="text-blue-100/80 text-lg">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
          {/* Card Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="firstName" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                  First name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                      errors.firstName ? 'border-red-400/60' : 'border-white/20'
                    }`}
                    placeholder="First name"
                  />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                    errors.firstName ? 'from-red-500/20 to-red-500/20' : ''
                  }`}></div>
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-300 animate-shake">{errors.firstName}</p>
                )}
              </div>
              <div className="group">
                <label htmlFor="lastName" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                  Last name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                      errors.lastName ? 'border-red-400/60' : 'border-white/20'
                    }`}
                    placeholder="Last name"
                  />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                    errors.lastName ? 'from-red-500/20 to-red-500/20' : ''
                  }`}></div>
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-300 animate-shake">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                    errors.email ? 'border-red-400/60' : 'border-white/20'
                  }`}
                  placeholder="Enter your email"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                  errors.email ? 'from-red-500/20 to-red-500/20' : ''
                }`}></div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.email}</p>
              )}
            </div>

            {/* Company Field */}
            <div className="group">
              <label htmlFor="company" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Company name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20 ${
                    errors.company ? 'border-red-400/60' : 'border-white/20'
                  }`}
                  placeholder="Enter your company name"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                  errors.company ? 'from-red-500/20 to-red-500/20' : ''
                }`}></div>
              </div>
              {errors.company && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.company}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="group">
              <label htmlFor="role" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white hover:bg-white/15 focus:bg-white/20 appearance-none"
                >
                  {availableRoles.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value} className="bg-slate-800 text-white">
                      {roleOption.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Password
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
                  placeholder="Enter a strong password"
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
                Confirm password
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
                  placeholder="Re-enter your password"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm ${
                  errors.confirmPassword ? 'from-red-500/20 to-red-500/20' : ''
                }`}></div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="group">
              <div className="flex items-start">
                <div className="relative">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-white/30 rounded bg-white/10 backdrop-blur-sm checked:bg-blue-500"
                  />
                  <div className="absolute inset-0 rounded bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-white/80 group-hover:text-white transition-colors cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-300 hover:text-blue-200 transition-colors hover:underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-300 hover:text-blue-200 transition-colors hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-2 text-sm text-red-300 animate-shake">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-xl shadow-lg backdrop-blur-sm relative z-10 animate-shake">
                <div className="flex items-start">
                  <div className="relative">
                    <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute inset-0 w-5 h-5 bg-red-400/20 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm text-red-200 font-medium leading-relaxed">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

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
                    <span className="animate-pulse">Creating account...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Create account</span>
                  </>
                )}
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60 font-medium">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3 relative z-10">
            <button className="group w-full inline-flex justify-center items-center py-3 px-4 border border-white/20 rounded-2xl shadow-lg bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button className="group w-full inline-flex justify-center items-center py-3 px-4 border border-white/20 rounded-2xl shadow-lg bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105">
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-white/60">
            © 2025 ProdSync. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

