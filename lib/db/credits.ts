import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { CreditTransaction, TransactionType, PLAN_FEATURES } from '@/lib/types/database';
import { getUserById, addCredits, deductCredits as deductUserCredits } from './users';

// ============================================================================
// Credit Transaction Operations
// ============================================================================

/**
 * Create a credit transaction record
 */
export async function createCreditTransaction(transactionData: {
  userId: string | ObjectId;
  type: TransactionType;
  amount: number;
  description: string;
  generationId?: string;
  subscriptionId?: string;
  subscriptionPeriod?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
}): Promise<CreditTransaction> {
  const db = await getDatabase();
  const userId = typeof transactionData.userId === 'string' 
    ? new ObjectId(transactionData.userId) 
    : transactionData.userId;
  
  const newTransaction: Omit<CreditTransaction, '_id'> = {
    userId,
    type: transactionData.type,
    amount: transactionData.amount,
    description: transactionData.description,
    generationId: transactionData.generationId,
    subscriptionId: transactionData.subscriptionId,
    subscriptionPeriod: transactionData.subscriptionPeriod,
    balanceBefore: transactionData.balanceBefore,
    balanceAfter: transactionData.balanceAfter,
    metadata: transactionData.metadata,
    createdAt: new Date(),
  };
  
  const result = await db.collection<CreditTransaction>(COLLECTIONS.CREDIT_TRANSACTIONS)
    .insertOne(newTransaction as CreditTransaction);
  
  return {
    ...newTransaction,
    _id: result.insertedId,
  } as CreditTransaction;
}

/**
 * Allocate monthly credits to a user
 */
export async function allocateMonthlyCredits(
  userId: string | ObjectId,
  plan: 'basic' | 'creator' | 'team',
  subscriptionId?: string,
  resetCredits: boolean = false
): Promise<{ success: boolean; creditsAllocated: number; newBalance: number }> {
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  const db = await getDatabase();
  
  // Get credit allocation for plan
  const creditsToAllocate = PLAN_FEATURES[plan].maxCreditsPerMonth;
  
  // Get current balance
  const user = await getUserById(objectId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const balanceBefore = user.credits;
  let newBalance: number;
  
  // For first subscription, reset to plan credits (don't add to free tier credits)
  if (resetCredits || user.subscriptionPlan === 'free') {
    // Set credits to plan allocation (replace, don't add)
    await db.collection('users').updateOne(
      { _id: objectId },
      { 
        $set: { 
          credits: creditsToAllocate,
          updatedAt: new Date(),
          lastCreditAllocation: new Date(),
        } 
      }
    );
    newBalance = creditsToAllocate;
  } else {
    // For renewals, add credits
    const result = await addCredits(objectId, creditsToAllocate);
    if (!result.success) {
      return { success: false, creditsAllocated: 0, newBalance: balanceBefore };
    }
    newBalance = result.newBalance;
  }
  
  // Create transaction record
  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  await createCreditTransaction({
    userId: objectId,
    type: 'allocation',
    amount: creditsToAllocate,
    description: `Monthly credit allocation for ${plan} plan`,
    subscriptionId,
    subscriptionPeriod: currentPeriod,
    balanceBefore,
    balanceAfter: newBalance,
  });
  
  return {
    success: true,
    creditsAllocated: creditsToAllocate,
    newBalance,
  };
}

/**
 * Deduct credits for a generation (with transaction logging)
 */
export async function deductCredits(
  userId: string | ObjectId,
  amount: number,
  description: string,
  generationId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  // Get current balance
  const user = await getUserById(objectId);
  if (!user) {
    return { success: false, newBalance: 0, error: 'User not found' };
  }
  
  const balanceBefore = user.credits;
  
  // Deduct credits from user
  const result = await deductUserCredits(objectId, amount);
  
  if (!result.success) {
    return result;
  }
  
  // Create transaction record
  await createCreditTransaction({
    userId: objectId,
    type: 'usage',
    amount: -amount, // Negative for usage
    description,
    generationId,
    balanceBefore,
    balanceAfter: result.newBalance,
  });
  
  return result;
}

/**
 * Refund credits to a user
 */
export async function refundCredits(
  userId: string | ObjectId,
  amount: number,
  description: string,
  generationId?: string
): Promise<{ success: boolean; newBalance: number }> {
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  // Get current balance
  const user = await getUserById(objectId);
  if (!user) {
    return { success: false, newBalance: 0 };
  }
  
  const balanceBefore = user.credits;
  
  // Add credits back to user
  const result = await addCredits(objectId, amount);
  
  if (!result.success) {
    return result;
  }
  
  // Create transaction record
  await createCreditTransaction({
    userId: objectId,
    type: 'refund',
    amount,
    description,
    generationId,
    balanceBefore,
    balanceAfter: result.newBalance,
  });
  
  return result;
}

/**
 * Award bonus credits to a user
 */
export async function awardBonusCredits(
  userId: string | ObjectId,
  amount: number,
  description: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number }> {
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  // Get current balance
  const user = await getUserById(objectId);
  if (!user) {
    return { success: false, newBalance: 0 };
  }
  
  const balanceBefore = user.credits;
  
  // Add bonus credits
  const result = await addCredits(objectId, amount);
  
  if (!result.success) {
    return result;
  }
  
  // Create transaction record
  await createCreditTransaction({
    userId: objectId,
    type: 'bonus',
    amount,
    description,
    balanceBefore,
    balanceAfter: result.newBalance,
    metadata,
  });
  
  return result;
}

/**
 * Get credit transaction history for a user
 */
export async function getCreditHistory(
  userId: string | ObjectId,
  limit: number = 50,
  offset: number = 0
): Promise<CreditTransaction[]> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  return await db.collection<CreditTransaction>(COLLECTIONS.CREDIT_TRANSACTIONS)
    .find({ userId: objectId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();
}

/**
 * Get credit usage analytics for a user
 */
export async function getCreditUsage(
  userId: string | ObjectId,
  period?: string // YYYY-MM format
): Promise<{
  totalAllocated: number;
  totalUsed: number;
  totalRefunded: number;
  totalBonus: number;
  netUsage: number;
  transactions: CreditTransaction[];
}> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const query: any = { userId: objectId };
  
  if (period) {
    query.subscriptionPeriod = period;
  }
  
  const transactions = await db.collection<CreditTransaction>(COLLECTIONS.CREDIT_TRANSACTIONS)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
  
  const stats = transactions.reduce(
    (acc, tx) => {
      switch (tx.type) {
        case 'allocation':
          acc.totalAllocated += tx.amount;
          break;
        case 'usage':
          acc.totalUsed += Math.abs(tx.amount);
          break;
        case 'refund':
          acc.totalRefunded += tx.amount;
          break;
        case 'bonus':
          acc.totalBonus += tx.amount;
          break;
      }
      return acc;
    },
    { totalAllocated: 0, totalUsed: 0, totalRefunded: 0, totalBonus: 0 }
  );
  
  return {
    ...stats,
    netUsage: stats.totalUsed - stats.totalRefunded,
    transactions,
  };
}

/**
 * Get daily credit usage for analytics
 */
export async function getDailyCreditUsage(
  userId: string | ObjectId,
  days: number = 30
): Promise<Array<{ date: string; credits: number }>> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const transactions = await db.collection<CreditTransaction>(COLLECTIONS.CREDIT_TRANSACTIONS)
    .find({
      userId: objectId,
      type: 'usage',
      createdAt: { $gte: startDate },
    })
    .sort({ createdAt: 1 })
    .toArray();
  
  // Group by date
  const dailyUsage = transactions.reduce((acc, tx) => {
    const date = tx.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += Math.abs(tx.amount);
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array format
  return Object.entries(dailyUsage).map(([date, credits]) => ({
    date,
    credits,
  }));
}

/**
 * Check if user has already received allocation for current period
 */
export async function hasReceivedAllocationThisPeriod(
  userId: string | ObjectId,
  period?: string
): Promise<boolean> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const currentPeriod = period || new Date().toISOString().slice(0, 7);
  
  const allocation = await db.collection<CreditTransaction>(COLLECTIONS.CREDIT_TRANSACTIONS)
    .findOne({
      userId: objectId,
      type: 'allocation',
      subscriptionPeriod: currentPeriod,
    });
  
  return allocation !== null;
}
