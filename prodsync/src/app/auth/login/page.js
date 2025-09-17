"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { getDashboardRoute } from "@/lib/roleRoutes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if Firebase is properly configured
    if (isFirebaseConfigured()) {
      setFirebaseReady(true);
    } else {
      setError("Firebase configuration is missing. Please check your environment variables.");
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate inputs
      if (!email || !password) {
        setError("Please enter both your email address and password to continue.");
        return;
      }

      // Check if Firebase is ready
      if (!auth) {
        setError("Authentication service is currently unavailable. Please try again later or contact support.");
        return;
      }

      // Additional check for auth initialization
      if (!auth.app || !auth.app.options) {
        setError("Firebase authentication is not properly initialized. Please refresh the page and try again.");
        return;
      }

      // 🔹 Login with Firebase Auth
      console.log("Attempting login with:", { email, authDomain: auth.app.options.authDomain });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User authenticated:", user.uid);

      // 🔹 Call backend to get role
      const res = await fetch(`/api/getRole?uid=${user.uid}`);
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Non-JSON response from API:", text);
        setError("Server configuration error. Please contact your system administrator for assistance.");
        return;
      }

      const data = await res.json();
      console.log("Role API response:", data);

      if (res.ok) {
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: data.role,
          userData: data.userData
        }));

        // Redirect to appropriate dashboard based on role
        const redirectPath = getDashboardRoute(data.role);
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      } else {
        // Handle specific error codes
        if (data.code === 'FIREBASE_NOT_CONFIGURED' || data.code === 'FIREBASE_NOT_INITIALIZED') {
          setError("System configuration error. Please contact your system administrator to resolve this issue.");
        } else if (data.code === 'USER_NOT_FOUND') {
          setError("Your account is not properly configured in the system. Please contact your administrator to set up your account.");
        } else {
          setError(data.error || "Unable to retrieve your account information. Please contact your system administrator for assistance.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific Firebase errors with professional messages
      let errorMessage = "Authentication failed. Please verify your credentials and try again.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "The email address you entered is not associated with any account. Please check your email or contact your administrator.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "The password you entered is incorrect. Please try again or use the 'Forgot Password' option.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address format (e.g., user@company.com).";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials. Please check your email and password, then try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please wait a few minutes before trying again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact your administrator for assistance.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password authentication is not enabled. Please contact your administrator.";
      } else if (error.message) {
        errorMessage = "Authentication failed. Please try again or contact support if the problem persists.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
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
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgba(59, 130, 246, 0.1)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(139, 92, 246, 0.1)', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M0,20 Q25,50 50,30 T100,40" stroke="url(#lineGradient)" strokeWidth="0.5" fill="none" opacity="0.6">
              <animate attributeName="d" values="M0,20 Q25,50 50,30 T100,40;M0,30 Q25,40 50,50 T100,20;M0,20 Q25,50 50,30 T100,40" dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M0,80 Q25,50 50,70 T100,60" stroke="url(#lineGradient)" strokeWidth="0.5" fill="none" opacity="0.4">
              <animate attributeName="d" values="M0,80 Q25,50 50,70 T100,60;M0,70 Q25,60 50,80 T100,70;M0,80 Q25,50 50,70 T100,60" dur="10s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
      </div>
      
      <div className="relative w-full max-w-md z-10">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
          {/* Card Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Logo and Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {/* Pulsing Ring */}
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/30 animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-blue-100/80 text-lg">Sign in to your ProdSync account</p>
          </div>

          {/* Configuration Notice */}
          {!firebaseReady && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl shadow-lg backdrop-blur-sm relative z-10 animate-pulse">
              <div className="flex items-start">
                <div className="relative">
                  <svg className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="absolute inset-0 w-5 h-5 bg-amber-400/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-sm text-amber-200 font-medium">Firebase Configuration Required</p>
                  <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">Please set up your Firebase environment variables to enable authentication.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl shadow-lg backdrop-blur-sm relative z-10 animate-shake">
              <div className="flex items-start">
                <div className="relative">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute inset-0 w-5 h-5 bg-red-400/20 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm text-red-200 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* Input Glow Effect */}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-14 py-4 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 hover:bg-white/15 focus:bg-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-white/10 rounded-r-2xl transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {/* Input Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center group">
                <div className="relative">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-white/30 rounded bg-white/10 backdrop-blur-sm checked:bg-blue-500"
                  />
                  <div className="absolute inset-0 rounded bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <label htmlFor="remember-me" className="ml-3 block text-sm text-white/80 group-hover:text-white transition-colors cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/auth/forgot-password" className="font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !firebaseReady}
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
                    <span className="animate-pulse">Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
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
                <span className="px-4 bg-transparent text-white/60 font-medium">Don&apos;t have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center relative z-10">
            <a
              href="/auth/signup"
              className="group inline-flex items-center px-6 py-3 border border-white/20 rounded-2xl text-sm font-medium text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create new account
            </a>
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

