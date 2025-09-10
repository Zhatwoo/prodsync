'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { WidgetSkeleton } from '../ui/Skeleton';

// Base Widget Component
const Widget = ({
  title,
  icon,
  children,
  className,
  loading = false,
  error = null,
  onRefresh,
  refreshable = true,
  collapsible = false,
  defaultCollapsed = false,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleToggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  if (loading) {
    return <WidgetSkeleton className={className} />;
  }
  
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200',
        'hover:shadow-md',
        className
      )}
      {...props}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {refreshable && onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Refresh widget"
            >
              <svg
                className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
          
          {collapsible && (
            <button
              onClick={handleToggleCollapse}
              className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isCollapsed ? 'Expand widget' : 'Collapse widget'}
            >
              <svg
                className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Widget Content */}
      {!isCollapsed && (
        <div className="p-6">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">
                <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              {onRefresh && (
                <button
                  onClick={handleRefresh}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Try again
                </button>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

// Widget Grid Layout Component
const WidgetGrid = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Widget Container for managing widget state
const WidgetContainer = ({ 
  children, 
  loading = false, 
  error = null, 
  onRefresh,
  ...props 
}) => {
  return (
    <div {...props}>
      {loading ? (
        <WidgetSkeleton />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-red-500 mb-2">
            <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Try again
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

// Hook for widget data fetching
const useWidgetData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, dependencies);
  
  return { data, loading, error, refetch: fetchData };
};

// Widget Action Button Component
const WidgetAction = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'sm',
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Widget Footer Component
const WidgetFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-slate-200 px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { 
  Widget, 
  WidgetGrid, 
  WidgetContainer, 
  useWidgetData, 
  WidgetAction, 
  WidgetFooter 
};
