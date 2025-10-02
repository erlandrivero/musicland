'use client';

import { Coins, TrendingUp, AlertTriangle } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types/database';

interface CreditBalanceProps {
  credits: number;
  plan: SubscriptionPlan;
  compact?: boolean;
}

export function CreditBalance({ credits, plan, compact = false }: CreditBalanceProps) {
  const maxCredits = getMaxCredits(plan);
  const percentage = (credits / maxCredits) * 100;
  const isLow = credits < maxCredits * 0.2; // Less than 20%

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
        <Coins className={`w-5 h-5 ${isLow ? 'text-red-500' : 'text-purple-600'}`} />
        <span className="font-semibold text-gray-900">{credits}</span>
        <span className="text-gray-500 text-sm">credits</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-gray-900">Credit Balance</h3>
        </div>
        {isLow && (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900 mb-1">{credits}</p>
        <p className="text-gray-600 text-sm">
          of {maxCredits} {plan === 'free' ? 'total' : 'monthly'} credits
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isLow 
                ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning or Info */}
      {isLow ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Low credits! Consider upgrading your plan.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>You&apos;re all set for creating music!</span>
        </div>
      )}

      {plan === 'free' && (
        <a
          href="/pricing"
          className="mt-4 block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-all text-center text-sm"
        >
          Upgrade for More Credits
        </a>
      )}
    </div>
  );
}

function getMaxCredits(plan: SubscriptionPlan): number {
  switch (plan) {
    case 'basic': return 500;
    case 'creator': return 1500;
    case 'team': return 5000;
    default: return 50;
  }
}
