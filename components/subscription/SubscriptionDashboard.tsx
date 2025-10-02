'use client';

import { useState } from 'react';
import { SubscriptionPlan } from '@/lib/types/database';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Settings, 
  AlertCircle,
  CheckCircle,
  XCircle 
} from 'lucide-react';

interface SubscriptionDashboardProps {
  user: {
    email: string;
    subscriptionPlan: SubscriptionPlan;
    subscriptionStatus: string | null;
    subscriptionPeriodEnd?: Date;
    credits: number;
    creditsUsed: number;
    cancelAtPeriodEnd?: boolean;
  };
}

export function SubscriptionDashboard({ user }: SubscriptionDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open subscription management. Please try again.');
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (user.subscriptionStatus) {
      case 'active':
        return (
          <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Active
          </span>
        );
      case 'past_due':
        return (
          <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            Past Due
          </span>
        );
      case 'canceled':
        return (
          <span className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            Free Plan
          </span>
        );
    }
  };

  const creditPercentage = user.subscriptionPlan === 'free' 
    ? (user.credits / 50) * 100 
    : ((user.credits / getCreditAllocation(user.subscriptionPlan)) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Credits</h1>
        <p className="text-gray-600">Manage your subscription and track your credit usage</p>
      </div>

      {/* Cancellation Warning */}
      {user.cancelAtPeriodEnd && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Subscription Ending</h3>
              <p className="text-yellow-800 text-sm">
                Your subscription will end on{' '}
                {user.subscriptionPeriodEnd 
                  ? new Date(user.subscriptionPeriodEnd).toLocaleDateString()
                  : 'the end of the billing period'}
                . You&apos;ll be downgraded to the free plan.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Plan</h2>
            {getStatusBadge()}
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900 capitalize mb-2">
              {user.subscriptionPlan} Plan
            </p>
            {user.subscriptionPlan !== 'free' && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {user.subscriptionPeriodEnd
                    ? `Renews on ${new Date(user.subscriptionPeriodEnd).toLocaleDateString()}`
                    : 'No renewal date'}
                </span>
              </div>
            )}
          </div>

          {user.subscriptionPlan !== 'free' && (
            <button
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Settings className="w-5 h-5" />
              {isLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          )}

          {user.subscriptionPlan === 'free' && (
            <a
              href="/pricing"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all text-center"
            >
              Upgrade Plan
            </a>
          )}
        </div>

        {/* Credits Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Credit Balance</h2>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>

          <div className="mb-4">
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {user.credits}
            </p>
            <p className="text-gray-600 text-sm">
              {user.creditsUsed} credits used lifetime
            </p>
          </div>

          {/* Credit Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Credits Remaining</span>
              <span>{Math.round(creditPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(creditPercentage, 100)}%` }}
              />
            </div>
          </div>

          {user.credits < 10 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-semibold">
                ⚠️ Low credit balance! Consider upgrading your plan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-6">Plan Features</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {getPlanFeature(user.subscriptionPlan, 'credits')}
            </p>
            <p className="text-gray-600 text-sm">Monthly Credits</p>
          </div>

          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <p className="text-3xl font-bold text-pink-600 mb-1">
              {getPlanFeature(user.subscriptionPlan, 'generations')}
            </p>
            <p className="text-gray-600 text-sm">Daily Generations</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {getPlanFeature(user.subscriptionPlan, 'quality')}
            </p>
            <p className="text-gray-600 text-sm">Quality Level</p>
          </div>
        </div>
      </div>

      {/* Payment History Link */}
      {user.subscriptionPlan !== 'free' && (
        <div className="mt-6 text-center">
          <button
            onClick={handleManageSubscription}
            className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 mx-auto"
          >
            <CreditCard className="w-5 h-5" />
            View Payment History & Invoices
          </button>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getCreditAllocation(plan: SubscriptionPlan): number {
  switch (plan) {
    case 'basic': return 500;
    case 'creator': return 1500;
    case 'team': return 5000;
    default: return 50;
  }
}

function getPlanFeature(plan: SubscriptionPlan, feature: 'credits' | 'generations' | 'quality'): string {
  const features = {
    free: { credits: '50', generations: '5', quality: 'Standard' },
    basic: { credits: '500', generations: '50', quality: 'Standard' },
    creator: { credits: '1,500', generations: '150', quality: 'High' },
    team: { credits: '5,000', generations: '500', quality: 'Premium' },
  };

  return features[plan][feature];
}
