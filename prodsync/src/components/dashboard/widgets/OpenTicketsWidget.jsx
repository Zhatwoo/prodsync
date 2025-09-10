'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { LineChart } from '../../ui/Charts';
import { cn } from '../../../lib/utils';

const OpenTicketsWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/open-tickets');
      const result = await response.json();
      return result;
    }
  );
  
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };
  
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      pending: 'bg-slate-100 text-slate-800'
    };
    return colors[status] || colors.open;
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      Hardware: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      Software: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      License: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      Setup: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      Access: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    };
    return icons[category] || icons.Hardware;
  };
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
  
  // Mock trend data for chart
  const trendData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 8 },
    { label: 'Wed', value: 15 },
    { label: 'Thu', value: 10 },
    { label: 'Fri', value: 6 },
    { label: 'Sat', value: 4 },
    { label: 'Sun', value: 2 }
  ];
  
  return (
    <Widget
      title="Open Tickets"
      icon={icon}
      loading={loading}
      error={error}
      onRefresh={refetch}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Summary */}
        {data?.summary && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">{data.summary.total}</p>
              <p className="text-sm text-blue-600">Total Open</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50">
              <p className="text-2xl font-bold text-red-600">{data.summary.critical}</p>
              <p className="text-sm text-red-600">Critical</p>
            </div>
          </div>
        )}
        
        {/* Trend Chart */}
        <div className="flex justify-center">
          <LineChart data={trendData} width={250} height={100} />
        </div>
        
        {/* Ticket List */}
        <div className="space-y-3">
          {data?.data?.slice(0, 3).map((ticket) => (
            <div key={ticket.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                    {getCategoryIcon(ticket.category)}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{ticket.id}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(ticket.priority))}>
                    {ticket.priority}
                  </span>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(ticket.status))}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-700 mb-1">{ticket.title}</p>
              <p className="text-xs text-slate-500">Assigned to: {ticket.assignee}</p>
            </div>
          ))}
        </div>
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.summary?.inProgress || 0} in progress
        </div>
        <WidgetAction variant="outline" size="sm">
          View All Tickets
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default OpenTicketsWidget;
