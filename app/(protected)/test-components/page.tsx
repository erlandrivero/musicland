'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CreditsBadge,
  CreditsDisplay,
  CreditCostPreview,
  UsageHistory,
  UsageAnalytics,
  InsufficientCreditsModal,
} from '@/components/credits';
import { useCredits, useCreditHistory, CREDIT_COSTS } from '@/hooks/use-credits';

export default function TestComponentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { credits, isLoading, isError, refreshCredits } = useCredits();
  const { addUsage, getStats } = useCreditHistory();
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/test-components');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleAddTestUsage = () => {
    addUsage('generation', 10, 'Test music generation');
    alert('Test usage added! Check the Usage History section.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Component Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Testing all credits management components with real data
          </p>
        </div>

        {/* Status Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">System Status</h3>
              <p className="text-sm text-blue-700">
                {isLoading && 'Loading credits...'}
                {isError && 'Error loading credits'}
                {!isLoading && !isError && `✅ All systems operational - ${credits} credits available`}
              </p>
            </div>
            <button
              onClick={refreshCredits}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Credits
            </button>
          </div>
        </div>

        {/* Test Actions */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={handleAddTestUsage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Test Usage Record
            </button>
            <button
              onClick={() => setShowInsufficientModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Show Insufficient Credits Modal
            </button>
          </div>
        </div>

        {/* Component Tests */}
        <div className="space-y-8">
          {/* 1. Credits Badge */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Credits Badge</h2>
            <p className="text-sm text-gray-600 mb-4">Compact display for navigation bars</p>
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-xs text-gray-500 mb-2">Small</p>
                <CreditsBadge size="sm" showRefresh />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Medium</p>
                <CreditsBadge size="md" showRefresh />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Large</p>
                <CreditsBadge size="lg" showRefresh />
              </div>
            </div>
          </section>

          {/* 2. Credits Display */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Credits Display</h2>
            <p className="text-sm text-gray-600 mb-4">Full dashboard with progress bar and stats</p>
            <CreditsDisplay showProgress showStats />
          </section>

          {/* 3. Credit Cost Preview */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Credit Cost Preview</h2>
            <p className="text-sm text-gray-600 mb-4">Shows cost breakdown before generation</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Standard Generation</h3>
                <CreditCostPreview generationType="STANDARD_GENERATION" quantity={1} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Lyrics Only</h3>
                <CreditCostPreview generationType="LYRICS_ONLY" quantity={1} />
              </div>
            </div>
          </section>

          {/* 4. Usage Analytics */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Usage Analytics</h2>
            <p className="text-sm text-gray-600 mb-4">Daily/weekly/all-time statistics</p>
            <UsageAnalytics />
          </section>

          {/* 5. Usage History */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Usage History</h2>
            <p className="text-sm text-gray-600 mb-4">Transaction history list</p>
            <UsageHistory />
          </section>

          {/* 6. Credit Costs Reference */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Credit Costs Reference</h2>
            <p className="text-sm text-gray-600 mb-4">All available generation types and their costs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{cost} credits</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Hook Data */}
          <section className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. useCredits Hook Data</h2>
            <p className="text-sm text-gray-600 mb-4">Raw data from the credits hook</p>
            <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs">
              {JSON.stringify(
                {
                  credits,
                  isLoading,
                  isError,
                  stats: getStats(),
                },
                null,
                2
              )}
            </pre>
          </section>
        </div>

        {/* Insufficient Credits Modal */}
        <InsufficientCreditsModal
          isOpen={showInsufficientModal}
          onClose={() => setShowInsufficientModal(false)}
          requiredCredits={10}
        />
      </div>
    </div>
  );
}
