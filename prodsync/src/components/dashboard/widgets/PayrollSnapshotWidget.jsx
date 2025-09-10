'use client';

import { Widget, useWidgetData, WidgetAction, WidgetFooter } from '../Widget';
import { DonutChart, MetricCard } from '../../ui/Charts';
import { cn } from '../../../lib/utils';

const PayrollSnapshotWidget = ({ className, ...props }) => {
  const { data, loading, error, refetch } = useWidgetData(
    async () => {
      const response = await fetch('/api/dashboard/payroll-snapshot');
      const result = await response.json();
      return result.data;
    }
  );
  
  const icon = (
    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Prepare chart data
  const chartData = data?.departmentBreakdown?.map((dept, index) => ({
    label: dept.department,
    value: dept.amount,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]
  })) || [];
  
  return (
    <Widget
      title="Payroll Snapshot"
      icon={icon}
      loading={loading}
      error={error}
      onRefresh={refetch}
      className={className}
      {...props}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(data?.currentPeriod?.totalPayroll || 0)}
            </p>
            <p className="text-sm text-slate-600">Total Payroll</p>
            {data?.trends?.payrollChange && (
              <p className={cn(
                'text-xs mt-1',
                data.trends.payrollChange > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {data.trends.payrollChange > 0 ? '↗' : '↘'} {Math.abs(data.trends.payrollChange)}%
              </p>
            )}
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {data?.currentPeriod?.totalEmployees || 0}
            </p>
            <p className="text-sm text-slate-600">Employees</p>
            {data?.trends?.employeeChange && (
              <p className={cn(
                'text-xs mt-1',
                data.trends.employeeChange > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {data.trends.employeeChange > 0 ? '↗' : '↘'} {Math.abs(data.trends.employeeChange)}%
              </p>
            )}
          </div>
        </div>
        
        {/* Department Breakdown Chart */}
        {chartData.length > 0 && (
          <div className="flex justify-center">
            <DonutChart data={chartData} size={150} innerRadius={50} />
          </div>
        )}
        
        {/* Processing Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Processed</span>
            <span className="font-medium text-slate-900">
              {data?.currentPeriod?.processed || 0} / {data?.currentPeriod?.totalEmployees || 0}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((data?.currentPeriod?.processed || 0) / (data?.currentPeriod?.totalEmployees || 1)) * 100}%`
              }}
            />
          </div>
        </div>
        
        {/* Department List */}
        <div className="space-y-2">
          {data?.departmentBreakdown?.slice(0, 3).map((dept, index) => (
            <div key={dept.department} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartData[index]?.color || '#3b82f6' }}
                />
                <span className="text-slate-600">{dept.department}</span>
              </div>
              <span className="font-medium text-slate-900">{formatCurrency(dept.amount)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <WidgetFooter>
        <div className="text-sm text-slate-600">
          {data?.currentPeriod?.pending || 0} pending
        </div>
        <WidgetAction variant="outline" size="sm">
          View Details
        </WidgetAction>
      </WidgetFooter>
    </Widget>
  );
};

export default PayrollSnapshotWidget;
