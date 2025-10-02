'use client';

import { useCredits } from '@/hooks/use-credits';
import { Coins, TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CreditsDisplayProps {
  className?: string;
  showProgress?: boolean;
  showStats?: boolean;
}

export function CreditsDisplay({ 
  className,
  showProgress = true,
  showStats = true 
}: CreditsDisplayProps) {
  const {
    credits,
    totalCredits,
    percentageUsed,
    isLoading,
    isError,
    isLowCredits,
    refreshCredits,
  } = useCredits();

  const [actualCreditsUsed, setActualCreditsUsed] = useState(0);

  useEffect(() => {
    const fetchActualUsage = async () => {
      try {
        const response = await fetch('/api/credits/history');
        if (response.ok) {
          const data = await response.json();
          setActualCreditsUsed(data.analytics.totalUsage);
        }
      } catch (error) {
        console.error('Failed to fetch credit usage:', error);
      }
    };

    fetchActualUsage();
  }, [credits]); // Refetch when credits change

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn(
        'p-6 bg-red-50 border border-red-200 rounded-lg',
        className
      )}>
        <div className="flex items-center gap-3 text-red-700">
          <AlertTriangle size={24} />
          <div>
            <h3 className="font-semibold">Failed to load credits</h3>
            <p className="text-sm text-red-600">Please try refreshing</p>
          </div>
          <button
            onClick={refreshCredits}
            className="ml-auto p-2 hover:bg-red-100 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'p-6 bg-gradient-to-br rounded-lg shadow-sm border',
      isLowCredits
        ? 'from-amber-50 to-orange-50 border-amber-200'
        : 'from-blue-50 to-purple-50 border-blue-200',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-3 rounded-full',
            isLowCredits ? 'bg-amber-100' : 'bg-blue-100'
          )}>
            <Coins 
              size={24} 
              className={isLowCredits ? 'text-amber-600' : 'text-blue-600'} 
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Available Credits
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {credits.toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={refreshCredits}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          aria-label="Refresh credits"
        >
          <RefreshCw size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Low Credits Warning */}
      {isLowCredits && (
        <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Low Credits</p>
              <p className="text-amber-700">
                You have less than 10 credits remaining. Consider purchasing more to continue generating music.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Usage</span>
            <span className="font-medium">{percentageUsed}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                isLowCredits
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              )}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Credits</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalCredits.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Credits Used</p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-semibold text-gray-900">
                {actualCreditsUsed.toLocaleString()}
              </p>
              <TrendingUp size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
