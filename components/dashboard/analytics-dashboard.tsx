'use client';

import { TrendingUp, TrendingDown, Music, Folder, Zap, Clock } from 'lucide-react';

interface AnalyticsData {
  totalProjects: number;
  totalTracks: number;
  creditsUsed: number;
  creditsRemaining: number;
  tracksThisMonth: number;
  tracksLastMonth: number;
  popularGenres: { genre: string; count: number }[];
  recentActivity: { date: string; tracks: number }[];
  avgGenerationTime: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const trackGrowth = data.tracksLastMonth > 0
    ? ((data.tracksThisMonth - data.tracksLastMonth) / data.tracksLastMonth) * 100
    : 100;

  const stats = [
    {
      name: 'Total Projects',
      value: data.totalProjects,
      icon: Folder,
      color: 'blue',
      change: null,
    },
    {
      name: 'Total Tracks',
      value: data.totalTracks,
      icon: Music,
      color: 'purple',
      change: null,
    },
    {
      name: 'Credits Used',
      value: data.creditsUsed,
      icon: Zap,
      color: 'amber',
      change: null,
    },
    {
      name: 'Tracks This Month',
      value: data.tracksThisMonth,
      icon: TrendingUp,
      color: 'green',
      change: trackGrowth,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            amber: 'bg-amber-100 text-amber-600',
            green: 'bg-green-100 text-green-600',
          }[stat.color];

          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon size={24} />
                </div>
                {stat.change !== null && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{stat.name}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Genres */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Genres</h3>
          <div className="space-y-3">
            {data.popularGenres.slice(0, 5).map((genre, index) => {
              const maxCount = data.popularGenres[0]?.count || 1;
              const percentage = (genre.count / maxCount) * 100;

              return (
                <div key={genre.genre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{genre.genre}</span>
                    <span className="text-sm text-gray-600">{genre.count} tracks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.slice(0, 7).map((activity, index) => (
              <div key={activity.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{activity.date}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Music size={14} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {activity.tracks}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">tracks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Avg. Generation Time</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data.avgGenerationTime}s
          </div>
          <div className="text-sm text-gray-600 mt-1">Per track</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={20} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Credits Remaining</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data.creditsRemaining}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ~{Math.floor(data.creditsRemaining / 10)} generations
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-amber-600" />
            <span className="text-sm font-medium text-gray-700">This Month</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data.tracksThisMonth}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {trackGrowth >= 0 ? '+' : ''}{trackGrowth.toFixed(1)}% from last month
          </div>
        </div>
      </div>
    </div>
  );
}
