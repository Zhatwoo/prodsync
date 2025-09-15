'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import SalesSidebar from '../../components/salesui/SalesSidebar';
import Footer from '../../components/Footer';

export default function SalesLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sales Sidebar */}
        <SalesSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={toggleSidebar} 
        />
        
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-14 sm:ml-16' : 'ml-60 sm:ml-64 md:ml-72'
        }`}>
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
