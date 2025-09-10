'use client';

import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-slate-200',
      className
    )}
    {...props}
  />
);

// Widget skeleton loader
const WidgetSkeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Table skeleton loader
const TableSkeleton = ({ rows = 5, columns = 4, className, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      
      {/* Table header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Chart skeleton loader
const ChartSkeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      
      {/* Chart area */}
      <div className="h-48 w-full">
        <Skeleton className="h-full w-full rounded" />
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// List skeleton loader
const ListSkeleton = ({ items = 4, className, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      
      {/* List items */}
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Card skeleton loader
const CardSkeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-lg border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    <div className="space-y-4">
      {/* Header */}
      <Skeleton className="h-5 w-32" />
      
      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

export { 
  Skeleton, 
  WidgetSkeleton, 
  TableSkeleton, 
  ChartSkeleton, 
  ListSkeleton, 
  CardSkeleton 
};
