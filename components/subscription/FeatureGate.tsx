'use client';

import { ReactNode } from 'react';
import { PlanFeatures, SubscriptionPlan } from '@/lib/types/database';
import { UpgradePrompt } from './UpgradePrompt';

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  userPlan: SubscriptionPlan;
  hasAccess: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

/**
 * Feature Gate Component
 * Conditionally renders content based on user's plan and feature access
 */
export function FeatureGate({
  feature,
  userPlan,
  hasAccess,
  children,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return <UpgradePrompt feature={feature} currentPlan={userPlan} />;
  }

  return null;
}
