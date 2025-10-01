'use client';

import { Music, Folder, Zap, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  totalProjects: number;
  totalTracks: number;
  creditsUsed: number;
  tracksThisWeek: number;
}

export function QuickStats({
  totalProjects,
  totalTracks,
  creditsUsed,
  tracksThisWeek,
}: QuickStatsProps) {
  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: Folder,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      name: 'Total Tracks',
      value: totalTracks,
      icon: Music,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      name: 'Credits Used',
      value: creditsUsed,
      icon: Zap,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      name: 'This Week',
      value: tracksThisWeek,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon size={24} className={stat.textColor} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </div>
        );
      })}
    </div>
  );
}
