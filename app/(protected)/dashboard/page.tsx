'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Music, Sparkles, FolderOpen, Folder } from 'lucide-react';
import Link from 'next/link';
import { CreditBalance } from '@/components/subscription/CreditBalance';
import { SubscriptionDashboard } from '@/components/subscription/SubscriptionDashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalProjects: 0,
    creditsUsed: 0,
  });
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Initialize user in database (creates if doesn't exist)
        const initRes = await fetch('/api/user/init', { cache: 'no-store' });
        const initData = initRes.ok ? await initRes.json() : null;

        // Fetch tracks
        const tracksRes = await fetch('/api/tracks', { cache: 'no-store' });
        const tracks = tracksRes.ok ? await tracksRes.json() : [];

        // Fetch projects
        const projectsRes = await fetch('/api/projects', { cache: 'no-store' });
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        // Fetch credit history
        const historyRes = await fetch('/api/credits/history', { cache: 'no-store' });
        const historyData = historyRes.ok ? await historyRes.json() : { analytics: { totalUsage: 0 } };

        // Fetch subscription status (always fresh)
        const subRes = await fetch('/api/subscription/status', { cache: 'no-store' });
        const subData = subRes.ok ? await subRes.json() : null;

        setStats({
          totalTracks: tracks.length,
          totalProjects: projects.length,
          creditsUsed: historyData.analytics.totalUsage,
        });

        // Use subscription data if available, otherwise use init data
        if (subData?.user) {
          setUserData(subData.user);
        } else if (initData?.user) {
          setUserData(initData.user);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    if (session) {
      fetchStats();
      
      // Auto-refresh every 30 seconds to keep data fresh
      const interval = setInterval(fetchStats, 30000);
      
      return () => clearInterval(interval);
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

        {/* Subscription & Credits Section */}
        {userData && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Current Plan</h2>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {userData.subscriptionPlan} Plan
                </span>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900 capitalize mb-2">
                  {userData.subscriptionPlan}
                </p>
                {userData.subscriptionPlan !== 'free' && userData.subscriptionPeriodEnd && (
                  <p className="text-gray-600 text-sm">
                    Renews on {new Date(userData.subscriptionPeriodEnd).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                )}
              </div>

              {userData.subscriptionPlan === 'free' ? (
                <a
                  href="/#pricing"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all text-center"
                >
                  Upgrade Plan
                </a>
              ) : (
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to cancel your subscription? You will keep access until the end of your billing period.')) {
                      return;
                    }
                    
                    try {
                      const res = await fetch('/api/stripe/cancel-subscription', { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cancelAtPeriodEnd: true }),
                      });
                      
                      if (!res.ok) {
                        const errorText = await res.text();
                        alert(`Error: ${errorText}`);
                        return;
                      }
                      
                      const data = await res.json();
                      if (data.success) {
                        alert('Subscription canceled. You will keep access until the end of your billing period.');
                        window.location.reload();
                      }
                    } catch (error) {
                      alert(`Failed to cancel: ${error}`);
                    }
                  }}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Cancel Subscription
                </button>
              )}
            </div>

            {/* Credits Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Credit Balance</h2>
              </div>

              <div className="mb-4">
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {userData.credits}
                </p>
                <p className="text-gray-600 text-sm">
                  {userData.creditsUsed} credits used lifetime
                </p>
              </div>

              {/* Credit Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Credits Remaining</span>
                  <span>{Math.round((userData.credits / getMaxCredits(userData.subscriptionPlan)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((userData.credits / getMaxCredits(userData.subscriptionPlan)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {userData.credits < 10 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-semibold">
                    ⚠️ Low credit balance! Consider upgrading your plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
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

// Helper function
function getMaxCredits(plan: string): number {
  switch (plan) {
    case 'basic': return 500;
    case 'creator': return 1500;
    case 'team': return 5000;
    default: return 50;
  }
}
