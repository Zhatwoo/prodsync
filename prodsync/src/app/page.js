
'use client';

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Add this useEffect for the counter animation
  useEffect(() => {
    const animateCounter = (id, end, duration) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          element.textContent = end.toLocaleString();
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(start).toLocaleString();
        }
      }, 16);
    };

    // Only animate when stats section is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter('stat1', 5000, 2000);
          animateCounter('stat2', 125000, 2000);
          animateCounter('stat3', 40, 2000);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section - Curved Vector Background Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Curved Vector Background */}
        <div className="absolute inset-0">
          <svg 
            className="absolute bottom-0 left-0 w-full h-auto" 
            viewBox="0 0 1200 400" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#1e40af', stopOpacity:0.8}} />
                <stop offset="50%" style={{stopColor:'#1e3a8a', stopOpacity:0.6}} />
                <stop offset="100%" style={{stopColor:'#312e81', stopOpacity:0.4}} />
              </linearGradient>
              <linearGradient id="curveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.3}} />
                <stop offset="100%" style={{stopColor:'#6366f1', stopOpacity:0.2}} />
              </linearGradient>
            </defs>
            
            {/* Main curved path */}
            <path 
              d="M0,400 L0,200 Q300,100 600,150 T1200,120 L1200,400 Z" 
              fill="url(#curveGradient)"
            />
            
            {/* Secondary curved path for depth */}
            <path 
              d="M0,400 L0,250 Q400,180 800,200 T1200,180 L1200,400 Z" 
              fill="url(#curveGradient2)"
            />
            
            {/* Additional decorative curves */}
            <path 
              d="M0,400 L0,300 Q200,250 400,280 T800,260 T1200,240 L1200,400 Z" 
              fill="rgba(59, 130, 246, 0.1)"
            />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating circles */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-32 right-32 w-24 h-24 bg-white opacity-10 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 bg-blue-300 opacity-20 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-300 opacity-15 transform rotate-12 animate-bounce"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex items-center justify-center">
            {/* Centered Content with Overlay */}
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 shadow-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                  Trusted by 5000+ companies worldwide
                </div>

                {/* Main Title - Overlay Style */}
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                  Welcome to
                  </h1>
                  <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    ProdSync
                  </span>
                </h1>
                </div>
                
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto font-light">
                  Transform how your team works together. Streamline operations, boost productivity, 
                  and scale your business with our comprehensive enterprise platform built for modern organizations.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                  <a 
                    href="/auth/login" 
                    className="group relative px-10 py-5 bg-white text-blue-900 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:-translate-y-1 min-w-[200px]"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  
                  <a 
                    href="/auth/signup" 
                    className="group relative px-10 py-5 border-2 border-white/30 text-white text-lg font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 min-w-[200px] hover:border-white/50"
                  >
                    <span className="relative z-10">Create Account</span>
                    <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Interactive Curved Division to Next Section */}
        <div className="absolute bottom-0 left-0 w-full group cursor-pointer">
          <svg 
            className="w-full h-64 transition-all duration-500 group-hover:h-80 group-hover:scale-105" 
            viewBox="0 0 1200 240" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="divisionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#1e3a8a', stopOpacity:1}} />
                <stop offset="20%" style={{stopColor:'#1e40af', stopOpacity:0.9}} />
                <stop offset="40%" style={{stopColor:'#3b82f6', stopOpacity:0.8}} />
                <stop offset="60%" style={{stopColor:'#6366f1', stopOpacity:0.6}} />
                <stop offset="80%" style={{stopColor:'#8b5cf6', stopOpacity:0.4}} />
                <stop offset="100%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
              </linearGradient>
              <linearGradient id="divisionGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#1e3a8a', stopOpacity:1}} />
                <stop offset="20%" style={{stopColor:'#1e40af', stopOpacity:1}} />
                <stop offset="40%" style={{stopColor:'#3b82f6', stopOpacity:0.9}} />
                <stop offset="60%" style={{stopColor:'#6366f1', stopOpacity:0.8}} />
                <stop offset="80%" style={{stopColor:'#8b5cf6', stopOpacity:0.6}} />
                <stop offset="100%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Animated path with hover effects */}
            <path 
              d="M0,240 L0,0 Q150,120 300,60 Q450,20 600,80 Q750,140 900,40 Q1050,0 1200,100 L1200,240 Z" 
              fill="url(#divisionGradient)"
              className="transition-all duration-500 group-hover:fill-[url(#divisionGradientHover)] group-hover:filter-[url(#glow)]"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-10; 0,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            
            {/* Interactive floating particles */}
            <circle cx="200" cy="80" r="3" fill="rgba(255,255,255,0.6)" className="group-hover:fill-white transition-colors duration-300">
              <animate attributeName="cy" values="80;60;80" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="120" r="2" fill="rgba(255,255,255,0.4)" className="group-hover:fill-white transition-colors duration-300">
              <animate attributeName="cy" values="120;100;120" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="1000" cy="60" r="4" fill="rgba(255,255,255,0.5)" className="group-hover:fill-white transition-colors duration-300">
              <animate attributeName="cy" values="60;40;60" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </svg>
          
          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </section>

      {/* Features Section - Modern Corporate Design */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Professional Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(15, 23, 42, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15, 23, 42, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full text-slate-600">
              <defs>
                <linearGradient id="corporateGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#0F172A', stopOpacity:0.1}} />
                  <stop offset="100%" style={{stopColor:'#3B82F6', stopOpacity:0.05}} />
                </linearGradient>
              </defs>
              <rect x="50" y="50" width="100" height="100" fill="url(#corporateGrad1)" rx="20">
                <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="30s" repeatCount="indefinite"/>
              </rect>
            </svg>
          </div>
          
          <div className="absolute bottom-20 left-20 w-24 h-24 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5">
                <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="25s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm mb-8">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
              Enterprise-Grade Solutions
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Built for
              <span className="block bg-gradient-to-r from-blue-600 via-slate-800 to-blue-600 bg-clip-text text-transparent">
                Modern Business
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive enterprise solutions designed to streamline operations, enhance security, and drive productivity across your organization.
            </p>
          </div>
          
          {/* Features Grid - Enhanced Responsive Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
            {/* Feature 1 - Security & Compliance */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-700 ease-out"></div>
              <div className="relative p-8 lg:p-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-blue-300/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 ease-out transform group-hover:-translate-y-3">
                {/* Header with Icon and Metric */}
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">99.9%</div>
                    <div className="text-sm text-slate-500 font-medium">Uptime SLA</div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Enterprise Security
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 text-base">
                  Bank-grade encryption, multi-factor authentication, and comprehensive compliance frameworks to protect your most sensitive data.
                </p>
                
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SOC 2 Type II Certified
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    End-to-end encryption
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced threat detection
                  </li>
                </ul>
                
                {/* CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors cursor-pointer">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Performance & Scalability */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-700 ease-out"></div>
              <div className="relative p-8 lg:p-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-emerald-300/60 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-700 ease-out transform group-hover:-translate-y-3">
                {/* Header with Icon and Metric */}
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">10x</div>
                    <div className="text-sm text-slate-500 font-medium">Faster</div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Lightning Performance
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 text-base">
                  Optimized infrastructure with real-time processing, global CDN, and intelligent caching for unmatched speed and reliability.
                </p>
                
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sub-100ms response times
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Auto-scaling infrastructure
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Global edge network
                  </li>
                </ul>
                
                {/* CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-emerald-600 text-sm font-semibold group-hover:text-emerald-700 transition-colors cursor-pointer">
                    <span>View benchmarks</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - User Experience & Innovation */}
            <div className="group relative sm:col-span-2 xl:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-700 ease-out"></div>
              <div className="relative p-8 lg:p-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-violet-300/60 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-700 ease-out transform group-hover:-translate-y-3">
                {/* Header with Icon and Metric */}
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-violet-600 mb-1">4.9★</div>
                    <div className="text-sm text-slate-500 font-medium">Rating</div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-violet-600 transition-colors duration-300">
                  Intuitive Design
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 text-base">
                  User-centric interface with intelligent automation, customizable workflows, and seamless integration across all business functions.
                </p>
                
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Drag-and-drop workflows
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI-powered insights
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mobile-first design
                  </li>
                </ul>
                
                {/* CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-violet-600 text-sm font-semibold group-hover:text-violet-700 transition-colors cursor-pointer">
                  <span>Try demo</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </div>
                  <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {/* Feature 4 - Integration */}
            <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-lg transition-all duration-500">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
        </div>
              <h4 className="font-semibold text-slate-900 mb-2">Seamless Integration</h4>
              <p className="text-sm text-slate-600">Connect with 200+ business tools</p>
            </div>
            
            {/* Feature 5 - Support */}
            <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-lg transition-all duration-500">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-slate-600">Dedicated enterprise support team</p>
            </div>
            
            {/* Feature 6 - Analytics */}
            <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-lg transition-all duration-500">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Advanced Analytics</h4>
              <p className="text-sm text-slate-600">Real-time insights and reporting</p>
            </div>
            
            {/* Feature 7 - Compliance */}
            <div className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-lg transition-all duration-500">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Full Compliance</h4>
              <p className="text-sm text-slate-600">GDPR, HIPAA, SOC 2 certified</p>
            </div>
          </div>
        </div>
      </section>



      {/* Ready for Business Section - Professional & Interactive */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Advanced Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full text-white">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:0.3}} />
                  <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0.1}} />
                </linearGradient>
              </defs>
              <rect x="50" y="50" width="100" height="100" fill="url(#grad1)" rx="20">
                <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="30s" repeatCount="indefinite"/>
              </rect>
            </svg>
          </div>
          
          <div className="absolute bottom-20 right-20 w-24 h-24 opacity-15">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
                <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="25s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          
          {/* Interactive Floating Elements */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-20 hover:opacity-40 transition-all duration-500 cursor-pointer group">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/25">
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 opacity-25 hover:opacity-50 transition-all duration-500 cursor-pointer group">
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-lg shadow-emerald-500/25">
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Floating Particles with Enhanced Animation */}
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full opacity-60 animate-ping shadow-lg shadow-white/50"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-ping animation-delay-2000 shadow-lg shadow-blue-300/50"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-ping animation-delay-4000 shadow-lg shadow-purple-300/50"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-emerald-300 rounded-full opacity-50 animate-ping animation-delay-1000 shadow-lg shadow-emerald-300/50"></div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold border border-white/20 shadow-lg mb-8 hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse shadow-lg shadow-emerald-400/50"></div>
              Trusted by 5,000+ Companies Worldwide
            </div>
            
            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of forward-thinking companies already using our platform to streamline operations, 
              boost productivity, and scale their business with confidence.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              
              <a 
                href="/auth/signup" 
                className="group relative px-10 py-5 border-2 border-white/30 text-white text-lg font-bold rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 min-w-[200px] hover:border-white/50"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Enterprise Security</h3>
                <p className="text-blue-200 text-sm">Bank-grade encryption & compliance</p>
              </div>
              
              <div className="group text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Lightning Fast</h3>
                <p className="text-blue-200 text-sm">Sub-100ms response times</p>
              </div>
              
              <div className="group text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-blue-200 text-sm">Dedicated enterprise support</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom CSS for grid animation */}
        <style jsx>{`
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
        `}</style>
      </section>
      
      <Footer />
    </div>
  );
}
