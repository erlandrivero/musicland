'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanFeatures, SubscriptionPlan, PRICING_PLANS } from '@/lib/types/database';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  feature: keyof PlanFeatures;
  currentPlan: SubscriptionPlan;
  variant?: 'inline' | 'modal' | 'banner';
}

const FEATURE_NAMES: Record<keyof PlanFeatures, string> = {
  maxCreditsPerMonth: 'More Monthly Credits',
  maxGenerationsPerDay: 'Higher Daily Generation Limit',
  advancedEditing: 'Advanced Editing Tools',
  stemSeparation: 'Stem Separation',
  collaboration: 'Team Collaboration',
  priorityQueue: 'Priority Queue',
  commercialLicense: 'Commercial License',
  apiAccess: 'API Access',
  customModels: 'Custom AI Models',
};

export function UpgradePrompt({ feature, currentPlan, variant = 'inline' }: UpgradePromptProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const featureName = FEATURE_NAMES[feature] || feature;

  // Find the lowest plan that includes this feature
  const recommendedPlan = PRICING_PLANS.find(plan => {
    // Skip if it's the current plan or lower
    const planOrder = { free: 0, basic: 1, creator: 2, team: 3 };
    if (planOrder[plan.id] <= planOrder[currentPlan]) return false;
    
    // Check if this plan has the feature
    // This is a simplified check - you might need to import PLAN_FEATURES
    return true; // Placeholder
  });

  const handleUpgrade = () => {
    setIsLoading(true);
    router.push('/pricing');
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <div>
              <p className="font-semibold">{featureName} is a premium feature</p>
              <p className="text-sm opacity-90">
                Upgrade to {recommendedPlan?.name || 'a higher plan'} to unlock this feature
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Upgrade Now'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Unlock {featureName}</h3>
            <p className="text-gray-600 mb-6">
              This feature is available on {recommendedPlan?.name || 'higher plans'}
            </p>
            {recommendedPlan && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Starting at</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${recommendedPlan.price}
                  <span className="text-lg text-gray-500">/month</span>
                </p>
              </div>
            )}
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'View Plans'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: inline variant
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h4 className="font-semibold text-gray-900 mb-2">{featureName} - Premium Feature</h4>
      <p className="text-gray-600 text-sm mb-4">
        Upgrade to {recommendedPlan?.name || 'unlock'} this feature
      </p>
      <button
        onClick={handleUpgrade}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Upgrade Now'}
      </button>
    </div>
  );
}
