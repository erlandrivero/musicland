import { ObjectId } from 'mongodb';
import { getUserById, getUserCredits } from '@/lib/db/users';
import { PLAN_FEATURES, PlanFeatures, SubscriptionPlan } from '@/lib/types/database';

// ============================================================================
// Feature Access Control
// ============================================================================

/**
 * Check if a user has access to a specific feature based on their plan
 */
export async function checkFeatureAccess(
  userId: string | ObjectId,
  feature: keyof PlanFeatures
): Promise<boolean> {
  const user = await getUserById(userId);
  
  if (!user) {
    return false;
  }
  
  const planFeatures = PLAN_FEATURES[user.subscriptionPlan];
  const featureValue = planFeatures[feature];
  
  // Return true for boolean features or if numeric value > 0
  return typeof featureValue === 'boolean' ? featureValue : featureValue > 0;
}

/**
 * Validate if user has sufficient credits for an operation
 */
export async function validateCreditUsage(
  userId: string | ObjectId,
  creditsRequired: number
): Promise<{ allowed: boolean; reason?: string; currentBalance?: number }> {
  const user = await getUserById(userId);
  
  if (!user) {
    return { allowed: false, reason: 'User not found' };
  }
  
  const { credits } = await getUserCredits(userId);
  
  if (credits < creditsRequired) {
    return {
      allowed: false,
      reason: `Insufficient credits. You need ${creditsRequired} credits but only have ${credits}.`,
      currentBalance: credits,
    };
  }
  
  return {
    allowed: true,
    currentBalance: credits,
  };
}

/**
 * Check if user can perform a generation based on daily limits
 */
export async function validateDailyGenerationLimit(
  userId: string | ObjectId
): Promise<{ allowed: boolean; reason?: string; generationsToday?: number; limit?: number }> {
  const user = await getUserById(userId);
  
  if (!user) {
    return { allowed: false, reason: 'User not found' };
  }
  
  const planFeatures = PLAN_FEATURES[user.subscriptionPlan];
  const dailyLimit = planFeatures.maxGenerationsPerDay;
  
  // TODO: Implement actual daily generation count from database
  // For now, we'll assume it's allowed
  // You can add a generations collection query here to count today's generations
  
  const generationsToday = 0; // Placeholder
  
  if (generationsToday >= dailyLimit) {
    return {
      allowed: false,
      reason: `Daily generation limit reached. You can generate up to ${dailyLimit} tracks per day.`,
      generationsToday,
      limit: dailyLimit,
    };
  }
  
  return {
    allowed: true,
    generationsToday,
    limit: dailyLimit,
  };
}

/**
 * Validate plan access level
 */
export function validatePlanAccess(
  userPlan: SubscriptionPlan,
  requiredPlan: SubscriptionPlan
): boolean {
  const planHierarchy: Record<SubscriptionPlan, number> = {
    free: 0,
    basic: 1,
    creator: 2,
    team: 3,
  };
  
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}

/**
 * Get feature access summary for a user
 */
export async function getFeatureAccessSummary(
  userId: string | ObjectId
): Promise<{
  plan: SubscriptionPlan;
  features: PlanFeatures;
  credits: number;
  creditsUsed: number;
}> {
  const user = await getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const { credits, creditsUsed } = await getUserCredits(userId);
  
  return {
    plan: user.subscriptionPlan,
    features: PLAN_FEATURES[user.subscriptionPlan],
    credits,
    creditsUsed,
  };
}

/**
 * Check if user needs to upgrade for a feature
 */
export async function getUpgradeRecommendation(
  userId: string | ObjectId,
  feature: keyof PlanFeatures
): Promise<{
  needsUpgrade: boolean;
  currentPlan: SubscriptionPlan;
  recommendedPlan?: SubscriptionPlan;
  recommendedPlanName?: string;
}> {
  const user = await getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const hasAccess = await checkFeatureAccess(userId, feature);
  
  if (hasAccess) {
    return {
      needsUpgrade: false,
      currentPlan: user.subscriptionPlan,
    };
  }
  
  // Find the lowest plan that has this feature
  const plans: SubscriptionPlan[] = ['basic', 'creator', 'team'];
  
  for (const plan of plans) {
    if (PLAN_FEATURES[plan][feature]) {
      return {
        needsUpgrade: true,
        currentPlan: user.subscriptionPlan,
        recommendedPlan: plan,
        recommendedPlanName: `${plan.charAt(0).toUpperCase()}${plan.slice(1)} Plan`,
      };
    }
  }
  
  return {
    needsUpgrade: true,
    currentPlan: user.subscriptionPlan,
  };
}

/**
 * Middleware helper to require a specific plan
 */
export async function requirePlan(
  userId: string | ObjectId,
  requiredPlan: SubscriptionPlan
): Promise<{ allowed: boolean; userPlan: SubscriptionPlan; error?: string }> {
  const user = await getUserById(userId);
  
  if (!user) {
    return {
      allowed: false,
      userPlan: 'free',
      error: 'User not found',
    };
  }
  
  const hasAccess = validatePlanAccess(user.subscriptionPlan, requiredPlan);
  
  if (!hasAccess) {
    return {
      allowed: false,
      userPlan: user.subscriptionPlan,
      error: `This feature requires ${requiredPlan} plan or higher. You are currently on ${user.subscriptionPlan} plan.`,
    };
  }
  
  return {
    allowed: true,
    userPlan: user.subscriptionPlan,
  };
}
