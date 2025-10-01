'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout, AnalyticsDashboard } from '@/components/dashboard';

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState({
    totalProjects: 0,
    totalTracks: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    tracksThisMonth: 0,
    tracksLastMonth: 0,
    popularGenres: [] as { genre: string; count: number }[],
    recentActivity: [] as { date: string; tracks: number }[],
    avgGenerationTime: 45,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        // Fetch tracks
        const tracksRes = await fetch('/api/tracks');
        const tracks = tracksRes.ok ? await tracksRes.json() : [];

        // Fetch credits
        const creditsRes = await fetch('/api/credits');
        const credits = creditsRes.ok ? await creditsRes.json() : { credits: 0, totalCredits: 10 };

        // Calculate this month and last month
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const tracksThisMonth = tracks.filter((t: any) => 
          new Date(t.createdAt) >= thisMonthStart
        ).length;

        const tracksLastMonth = tracks.filter((t: any) => {
          const date = new Date(t.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        }).length;

        // Calculate popular genres
        const genreCounts: Record<string, number> = {};
        tracks.forEach((track: any) => {
          if (track.tags) {
            track.tags.split(',').forEach((tag: string) => {
              const genre = tag.trim();
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });

        const popularGenres = Object.entries(genreCounts)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count);

        // Calculate recent activity (last 7 days)
        const recentActivity = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          const tracksOnDate = tracks.filter((t: any) => {
            const trackDate = new Date(t.createdAt);
            return trackDate.toDateString() === date.toDateString();
          }).length;

          recentActivity.push({ date: dateStr, tracks: tracksOnDate });
        }

        setAnalyticsData({
          totalProjects: projects.length,
          totalTracks: tracks.length,
          creditsUsed: credits.totalCredits - credits.credits,
          creditsRemaining: credits.credits,
          tracksThisMonth,
          tracksLastMonth,
          popularGenres,
          recentActivity,
          avgGenerationTime: 45, // This would come from actual generation data
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchAnalytics();
    }
  }, [session]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your music generation statistics and trends</p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard data={analyticsData} />
      </div>
    </DashboardLayout>
  );
}
