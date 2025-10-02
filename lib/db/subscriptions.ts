import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { Subscription } from '@/lib/types/database';

// ============================================================================
// Subscription CRUD Operations
// ============================================================================

/**
 * Create a new subscription record
 */
export async function createSubscription(subscriptionData: {
  userId: string | ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: Subscription['status'];
  plan: Subscription['plan'];
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amount: number;
  currency?: string;
  interval?: 'month' | 'year';
}): Promise<Subscription> {
  const db = await getDatabase();
  const userId = typeof subscriptionData.userId === 'string' 
    ? new ObjectId(subscriptionData.userId) 
    : subscriptionData.userId;
  
  const newSubscription: Omit<Subscription, '_id'> = {
    userId,
    stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
    stripeCustomerId: subscriptionData.stripeCustomerId,
    stripePriceId: subscriptionData.stripePriceId,
    status: subscriptionData.status,
    plan: subscriptionData.plan,
    currentPeriodStart: subscriptionData.currentPeriodStart,
    currentPeriodEnd: subscriptionData.currentPeriodEnd,
    cancelAtPeriodEnd: false,
    amount: subscriptionData.amount,
    currency: subscriptionData.currency || 'usd',
    interval: subscriptionData.interval || 'month',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .insertOne(newSubscription as Subscription);
  
  return {
    ...newSubscription,
    _id: result.insertedId,
  } as Subscription;
}

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<Subscription | null> {
  const db = await getDatabase();
  
  return await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .findOne({ stripeSubscriptionId });
}

/**
 * Get active subscription for a user
 */
export async function getActiveSubscription(
  userId: string | ObjectId
): Promise<Subscription | null> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  return await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .findOne({ 
      userId: objectId,
      status: 'active'
    });
}

/**
 * Get all subscriptions for a user (including canceled)
 */
export async function getUserSubscriptions(
  userId: string | ObjectId
): Promise<Subscription[]> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  return await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .find({ userId: objectId })
    .sort({ createdAt: -1 })
    .toArray();
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: Subscription['status'],
  periodEnd?: Date
): Promise<void> {
  const db = await getDatabase();
  
  const updateData: any = {
    status,
    updatedAt: new Date(),
  };
  
  if (periodEnd) {
    updateData.currentPeriodEnd = periodEnd;
  }
  
  await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS).updateOne(
    { stripeSubscriptionId },
    { $set: updateData }
  );
}

/**
 * Update subscription details (for plan changes, renewals)
 */
export async function updateSubscription(
  stripeSubscriptionId: string,
  updates: {
    status?: Subscription['status'];
    plan?: Subscription['plan'];
    stripePriceId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Date;
    amount?: number;
  }
): Promise<void> {
  const db = await getDatabase();
  
  await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS).updateOne(
    { stripeSubscriptionId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Mark subscription as canceled
 */
export async function cancelSubscription(
  stripeSubscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  const db = await getDatabase();
  
  const updateData: any = {
    cancelAtPeriodEnd,
    updatedAt: new Date(),
  };
  
  if (!cancelAtPeriodEnd) {
    updateData.status = 'canceled';
    updateData.canceledAt = new Date();
  }
  
  await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS).updateOne(
    { stripeSubscriptionId },
    { $set: updateData }
  );
}

/**
 * Get subscriptions expiring soon (for notifications)
 */
export async function getExpiringSubscriptions(daysAhead: number = 7): Promise<Subscription[]> {
  const db = await getDatabase();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .find({
      status: 'active',
      currentPeriodEnd: { $lte: futureDate },
      cancelAtPeriodEnd: false,
    })
    .toArray();
}

/**
 * Get all active subscriptions (for admin/analytics)
 */
export async function getAllActiveSubscriptions(): Promise<Subscription[]> {
  const db = await getDatabase();
  
  return await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .find({ status: 'active' })
    .toArray();
}

/**
 * Delete subscription record (use with caution)
 */
export async function deleteSubscription(stripeSubscriptionId: string): Promise<void> {
  const db = await getDatabase();
  
  await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS).deleteOne({
    stripeSubscriptionId,
  });
}

/**
 * Get subscription statistics for a user
 */
export async function getUserSubscriptionStats(
  userId: string | ObjectId
): Promise<{
  totalSubscriptions: number;
  activeSubscription: Subscription | null;
  lifetimeValue: number;
}> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const subscriptions = await db.collection<Subscription>(COLLECTIONS.SUBSCRIPTIONS)
    .find({ userId: objectId })
    .toArray();
  
  const activeSubscription = subscriptions.find(sub => sub.status === 'active') || null;
  
  // Calculate lifetime value (sum of all subscription amounts)
  const lifetimeValue = subscriptions.reduce((total, sub) => {
    // Estimate based on months active
    const monthsActive = sub.canceledAt 
      ? Math.ceil((sub.canceledAt.getTime() - sub.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30))
      : Math.ceil((new Date().getTime() - sub.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return total + (sub.amount * monthsActive);
  }, 0);
  
  return {
    totalSubscriptions: subscriptions.length,
    activeSubscription,
    lifetimeValue: lifetimeValue / 100, // Convert cents to dollars
  };
}
