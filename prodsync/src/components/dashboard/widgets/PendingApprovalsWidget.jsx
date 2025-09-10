'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { cn } from '../../../lib/utils';

const PendingApprovalsWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/pending-approvals');
      const result = await response.json();
      return result.data;
    }
  );
  
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };
  
  const getTypeIcon = (type) => {
    const icons = {
      leave_request: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      expense_report: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      purchase_order: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      overtime_request: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[type] || icons.leave_request;
  };
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  return (
    <Widget
      title="Pending Approvals"
      icon={icon}
      loading={loading}
      error={error}
      onRefresh={refetch}
      className={className}
      {...props}
    >
      <div className="space-y-4">
        {data?.slice(0, 4).map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                {getTypeIcon(approval.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{approval.title}</p>
                <p className="text-xs text-slate-500">{approval.requester} • {approval.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(approval.priority))}>
                {approval.priority}
              </span>
            </div>
          </div>
        ))}
        
        {data && data.length > 4 && (
          <div className="text-center text-sm text-slate-500">
            +{data.length - 4} more approvals
          </div>
        )}
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.length || 0} pending approvals
        </div>
        <WidgetAction variant="outline" size="sm">
          View All
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default PendingApprovalsWidget;
