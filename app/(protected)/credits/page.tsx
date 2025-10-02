'use client';

import { CreditsDisplay, UsageHistory, UsageAnalytics } from '@/components/credits';
import { DashboardLayout } from '@/components/dashboard';
import { Coins } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/credits');
    }
  }, [status, router]);

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
        <div className="flex items-center gap-3">
          <Coins size={32} className="text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Credits Management</h1>
            <p className="text-gray-600 mt-1">Track your credit usage and manage your account balance</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Credits Display */}
          <div className="lg:col-span-1">
            <CreditsDisplay />
          </div>

          {/* Right Column - Analytics and History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Usage Analytics
              </h2>
              <UsageAnalytics />
            </div>

            {/* History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Transaction History
              </h2>
              <UsageHistory />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
