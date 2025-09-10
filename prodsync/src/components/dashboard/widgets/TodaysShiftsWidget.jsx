'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { BarChart } from '../../ui/Charts';
import { cn } from '../../../lib/utils';

const TodaysShiftsWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/todays-shifts');
      const result = await response.json();
      return result;
    }
  );
  
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-slate-100 text-slate-800'
    };
    return colors[status] || colors.scheduled;
  };
  
  const getStatusIcon = (status) => {
    const icons = {
      scheduled: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      in_progress: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
      completed: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[status] || icons.scheduled;
  };
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  // Prepare chart data
  const chartData = data?.summary ? [
    { label: 'Scheduled', value: data.summary.scheduled, color: '#3b82f6' },
    { label: 'In Progress', value: data.summary.inProgress, color: '#10b981' },
    { label: 'Completed', value: data.summary.completed, color: '#6b7280' }
  ] : [];
  
  return (
    <Widget
      title="Today's Shifts"
      icon={icon}
      loading={loading}
      error={error}
      onRefresh={refetch}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Chart */}
        {chartData.length > 0 && (
          <div className="flex justify-center">
            <BarChart data={chartData} width={200} height={120} />
          </div>
        )}
        
        {/* Shift List */}
        <div className="space-y-3">
          {data?.data?.slice(0, 3).map((shift) => (
            <div key={shift.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600">
                    {shift.employee.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{shift.employee}</p>
                  <p className="text-xs text-slate-500">{shift.position} • {shift.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{shift.startTime} - {shift.endTime}</p>
                <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', getStatusColor(shift.status))}>
                  {getStatusIcon(shift.status)}
                  <span className="ml-1 capitalize">{shift.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.summary?.total || 0} total shifts today
        </div>
        <WidgetAction variant="outline" size="sm">
          View Schedule
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default TodaysShiftsWidget;
