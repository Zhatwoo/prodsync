'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { ProgressBar } from '../../ui/Charts';
import { cn } from '../../../lib/utils';

const TasksDueWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/tasks-due');
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
      pending: 'bg-slate-100 text-slate-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.pending;
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      HR: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      Finance: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      Legal: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      Security: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      Procurement: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    };
    return icons[category] || icons.HR;
  };
  
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };
  
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
  
  return (
    <Widget
      title="Tasks Due"
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
            <div className="text-center p-3 rounded-lg bg-orange-50">
              <p className="text-2xl font-bold text-orange-600">{data.summary.overdue}</p>
              <p className="text-sm text-orange-600">Overdue</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-600">{data.summary.dueThisWeek}</p>
              <p className="text-sm text-blue-600">Due This Week</p>
            </div>
          </div>
        )}
        
        {/* Task List */}
        <div className="space-y-3">
          {data?.data?.slice(0, 4).map((task) => {
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            const overdue = isOverdue(task.dueDate);
            
            return (
              <div key={task.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center">
                      {getCategoryIcon(task.category)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{task.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(task.status))}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 mb-2">{task.title}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <ProgressBar value={task.progress} size="sm" />
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">Assigned to: {task.assignee}</p>
                  <p className={cn(
                    'text-xs font-medium',
                    overdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-slate-600'
                  )}>
                    {overdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                     daysUntilDue === 0 ? 'Due today' :
                     daysUntilDue === 1 ? 'Due tomorrow' :
                     `${daysUntilDue} days left`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.summary?.dueToday || 0} due today
        </div>
        <WidgetAction variant="outline" size="sm">
          View All Tasks
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default TasksDueWidget;
