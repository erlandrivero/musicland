'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Music, Sparkles, FolderOpen, Folder } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalProjects: 0,
    creditsUsed: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch tracks
        const tracksRes = await fetch('/api/tracks');
        const tracks = tracksRes.ok ? await tracksRes.json() : [];

        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        // Fetch credit history
        const historyRes = await fetch('/api/credits/history');
        const historyData = historyRes.ok ? await historyRes.json() : { analytics: { totalUsage: 0 } };

        setStats({
          totalTracks: tracks.length,
          totalProjects: projects.length,
          creditsUsed: historyData.analytics.totalUsage,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {session.user?.name || 'User'}!</p>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/generate"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Sparkles size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Music</h3>
                <p className="text-sm text-gray-600">Create new tracks</p>
              </div>
            </div>
          </Link>

          <Link
            href="/credits"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Music size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Credits</h3>
                <p className="text-sm text-gray-600">Manage credits</p>
              </div>
            </div>
          </Link>

          <Link
            href="/tracks"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FolderOpen size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Tracks</h3>
                <p className="text-sm text-gray-600">View all tracks</p>
              </div>
            </div>
          </Link>

          <Link
            href="/projects"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <Folder size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Projects</h3>
                <p className="text-sm text-gray-600">Organize tracks</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to AI Music Studio! 🎵</h2>
          <p className="text-lg mb-6">
            You&apos;re all set to start creating amazing music with AI. Here&apos;s what you can do:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <Sparkles size={20} />
              <span>Generate professional music in seconds</span>
            </li>
            <li className="flex items-center gap-2">
              <Music size={20} />
              <span>Choose from multiple AI models (Suno, Riffusion, Nuro)</span>
            </li>
            <li className="flex items-center gap-2">
              <FolderOpen size={20} />
              <span>Organize tracks into projects</span>
            </li>
          </ul>
          <Link
            href="/generate"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Creating →
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tracks</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTracks}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.totalTracks === 0 ? 'Start generating to see stats' : 'Generated tracks'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Projects</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.totalProjects === 0 ? 'Create your first project' : 'Active projects'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Credits Used</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.creditsUsed}</p>
            <p className="text-sm text-gray-500 mt-2">Track your usage</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
