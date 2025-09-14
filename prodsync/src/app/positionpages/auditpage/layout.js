'use client';

import { useState } from 'react';
import AuditSidebar from '../../components/auditui/AuditSidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AuditLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AuditSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-14 sm:ml-16' : 'ml-60 sm:ml-64 md:ml-72'
      }`}>
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
