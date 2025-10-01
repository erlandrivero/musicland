'use client';

import { useCreditHistory } from '@/hooks/use-credits';
import { TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';

export function UsageAnalytics() {
  const { getStats } = useCreditHistory();
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    // Refresh stats when component mounts
    setStats(getStats());
  }, [getStats]);

  const typeLabels: Record<string, string> = {
    generation: 'Music Generation',
    lyrics: 'Lyrics',
    stem_separation: 'Stem Separation',
  };

  const typeColors: Record<string, string> = {
    generation: 'bg-blue-500',
    lyrics: 'bg-purple-500',
    stem_separation: 'bg-green-500',
  };

  // Calculate percentages for usage by type
  const usageByTypeArray = Object.entries(stats.usageByType).map(([type, credits]) => ({
    type,
    credits,
    percentage: stats.totalUsage > 0 ? (credits / stats.totalUsage) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Usage */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-200 rounded-lg">
              <Calendar size={20} className="text-blue-700" />
            </div>
            <h4 className="text-sm font-medium text-blue-900">Last 24 Hours</h4>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {stats.dailyUsage}
          </p>
          <p className="text-sm text-blue-700 mt-1">credits used</p>
        </div>

        {/* Weekly Usage */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-200 rounded-lg">
              <TrendingUp size={20} className="text-purple-700" />
            </div>
            <h4 className="text-sm font-medium text-purple-900">Last 7 Days</h4>
          </div>
          <p className="text-3xl font-bold text-purple-900">
            {stats.weeklyUsage}
          </p>
          <p className="text-sm text-purple-700 mt-1">credits used</p>
        </div>

        {/* Total Usage */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-200 rounded-lg">
              <BarChart3 size={20} className="text-green-700" />
            </div>
            <h4 className="text-sm font-medium text-green-900">All Time</h4>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {stats.totalUsage}
          </p>
          <p className="text-sm text-green-700 mt-1">credits used</p>
        </div>
      </div>

      {/* Usage by Type */}
      {usageByTypeArray.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <PieChart size={24} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Usage by Type
            </h3>
          </div>

          <div className="space-y-4">
            {usageByTypeArray.map(({ type, credits, percentage }) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {typeLabels[type] || type}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {credits} credits ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${typeColors[type] || 'bg-gray-500'} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Transactions</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.recordCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {usageByTypeArray.length === 0 && (
        <div className="p-12 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <PieChart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No analytics data yet
          </h3>
          <p className="text-gray-600">
            Start generating music to see your usage analytics.
          </p>
        </div>
      )}
    </div>
  );
}
