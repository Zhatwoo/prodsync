'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { cn } from '../../../lib/utils';

const LowStockAlertsWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/low-stock-alerts');
      const result = await response.json();
      return result;
    }
  );
  
  const getUrgencyColor = (urgency) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[urgency] || colors.medium;
  };
  
  const getUrgencyIcon = (urgency) => {
    const icons = {
      critical: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      high: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      medium: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[urgency] || icons.medium;
  };
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
  
  return (
    <Widget
      title="Low Stock Alerts"
      icon={icon}
      loading={loading}
      error={error}
      onRefresh={refetch}
      className={className}
      {...props}
    >
      <div className="space-y-4">
        {/* Summary */}
        {data?.summary && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-red-50">
              <p className="text-lg font-bold text-red-600">{data.summary.critical}</p>
              <p className="text-xs text-red-600">Critical</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50">
              <p className="text-lg font-bold text-orange-600">{data.summary.high}</p>
              <p className="text-xs text-orange-600">High</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50">
              <p className="text-lg font-bold text-yellow-600">{data.summary.medium}</p>
              <p className="text-xs text-yellow-600">Medium</p>
            </div>
          </div>
        )}
        
        {/* Alert List */}
        <div className="space-y-3">
          {data?.data?.slice(0, 4).map((alert) => (
            <div key={alert.id} className={cn('p-3 rounded-lg border', getUrgencyColor(alert.urgency))}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getUrgencyIcon(alert.urgency)}
                    <p className="text-sm font-medium">{alert.product}</p>
                  </div>
                  <p className="text-xs opacity-75">{alert.sku} • {alert.category}</p>
                  <p className="text-xs opacity-75 mt-1">
                    Stock: {alert.currentStock} / {alert.minStock} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Last restocked</p>
                  <p className="text-xs font-medium">
                    {new Date(alert.lastRestocked).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data?.data && data.data.length > 4 && (
          <div className="text-center text-sm text-slate-500">
            +{data.data.length - 4} more alerts
          </div>
        )}
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.summary?.total || 0} low stock items
        </div>
        <WidgetAction variant="outline" size="sm">
          View Inventory
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default LowStockAlertsWidget;
