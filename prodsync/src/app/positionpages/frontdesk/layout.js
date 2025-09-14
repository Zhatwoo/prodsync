'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FrontDeskSidebar from '../../components/frontdeskui/FrontDeskSidebar';

export default function FrontDeskLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <FrontDeskSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar} 
        />
        
        <div className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-14 sm:ml-16' : 'ml-60 sm:ml-64 md:ml-72'
        }`}>
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
