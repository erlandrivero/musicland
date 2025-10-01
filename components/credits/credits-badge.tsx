'use client';

import { useCredits } from '@/hooks/use-credits';
import { Coins, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditsBadgeProps {
  className?: string;
  showRefresh?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CreditsBadge({ 
  className, 
  showRefresh = true,
  size = 'md' 
}: CreditsBadgeProps) {
  const { 
    credits, 
    isLoading, 
    isError, 
    isLowCredits,
    refreshCredits 
  } = useCredits();

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  if (!isLoading && isError) {
    return (
      <div className={cn(
        'inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700',
        sizeClasses[size],
        className
      )}>
        <AlertCircle size={iconSizes[size]} />
        <span className="font-medium">Error</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full transition-colors',
      isLowCredits 
        ? 'bg-amber-100 text-amber-700' 
        : 'bg-blue-100 text-blue-700',
      sizeClasses[size],
      className
    )}>
      <Coins size={iconSizes[size]} className="flex-shrink-0" />
      <span className="font-semibold">
        {isLoading ? '...' : credits.toLocaleString()}
      </span>
      {showRefresh && !isLoading && (
        <button
          onClick={refreshCredits}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Refresh credits"
        >
          <RefreshCw size={iconSizes[size] - 2} />
        </button>
      )}
    </div>
  );
}
