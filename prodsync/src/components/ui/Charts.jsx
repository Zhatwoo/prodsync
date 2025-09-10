'use client';

import { cn } from '../../lib/utils';

// Simple Bar Chart Component
const BarChart = ({ data, width = 300, height = 200, className, ...props }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = width / data.length - 10;
  
  return (
    <div className={cn('flex items-end justify-center space-x-2', className)} {...props}>
      <svg width={width} height={height} className="overflow-visible">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const x = index * (barWidth + 10) + 5;
          const y = height - barHeight - 20;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || '#3b82f6'}
                rx={2}
                className="transition-all duration-300 hover:opacity-80"
              />
              <text
                x={x + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-slate-600"
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-slate-800 font-medium"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Simple Line Chart Component
const LineChart = ({ data, width = 300, height = 200, className, ...props }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (width - 40) + 20;
    const y = height - 20 - ((item.value - minValue) / range) * (height - 40);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
          className="transition-all duration-300"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20;
          const y = height - 20 - ((item.value - minValue) / range) * (height - 40);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="transition-all duration-300 hover:r-6"
              />
              <text
                x={x}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-slate-600"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Simple Pie Chart Component
const PieChart = ({ data, size = 200, className, ...props }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];
  
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <svg width={size} height={size} className="overflow-visible">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;
          
          const centerX = size / 2;
          const centerY = size / 2;
          const radius = size / 2 - 20;
          
          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              className="transition-all duration-300 hover:opacity-80"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Simple Donut Chart Component
const DonutChart = ({ data, size = 200, innerRadius = 60, className, ...props }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];
  
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <svg width={size} height={size} className="overflow-visible">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;
          
          const centerX = size / 2;
          const centerY = size / 2;
          const outerRadius = size / 2 - 20;
          
          const x1 = centerX + outerRadius * Math.cos(startAngleRad);
          const y1 = centerY + outerRadius * Math.sin(startAngleRad);
          const x2 = centerX + outerRadius * Math.cos(endAngleRad);
          const y2 = centerY + outerRadius * Math.sin(endAngleRad);
          
          const x3 = centerX + innerRadius * Math.cos(endAngleRad);
          const y3 = centerY + innerRadius * Math.sin(endAngleRad);
          const x4 = centerX + innerRadius * Math.cos(startAngleRad);
          const y4 = centerY + innerRadius * Math.sin(startAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || colors[index % colors.length]}
              className="transition-all duration-300 hover:opacity-80"
            />
          );
        })}
      </svg>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, max = 100, size = 'default', className, ...props }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    default: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div
      className={cn(
        'w-full bg-slate-200 rounded-full overflow-hidden',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  className, 
  ...props 
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-600'
  };
  
  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };
  
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={cn('text-sm', changeColors[changeType])}>
              <span className="mr-1">{changeIcons[changeType]}</span>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export { 
  BarChart, 
  LineChart, 
  PieChart, 
  DonutChart, 
  ProgressBar, 
  MetricCard 
};
