import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { User, SubscriptionPlan } from '@/lib/types/database';

// ============================================================================
// User CRUD Operations
// ============================================================================

/**
 * Create a new user with default free plan
 */
export async function createUser(userData: {
  email: string;
  name: string;
  image?: string;
  googleId?: string;
}): Promise<User> {
  const db = await getDatabase();
  
  const newUser: Omit<User, '_id'> = {
    email: userData.email,
    name: userData.name,
    image: userData.image,
    googleId: userData.googleId,
    
    // Default subscription settings
    subscriptionStatus: null,
    subscriptionPlan: 'free',
    
    // Free tier gets 50 one-time credits
    credits: 50,
    creditsUsed: 0,
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };
  
  const result = await db.collection<User>(COLLECTIONS.USERS).insertOne(newUser as User);
  
  return {
    ...newUser,
    _id: result.insertedId,
  } as User;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  
  const user = await db.collection<User>(COLLECTIONS.USERS).findOne({ email });
  
  if (user) {
    // Update last login
    await db.collection<User>(COLLECTIONS.USERS).updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        } 
      }
    );
  }
  
  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string | ObjectId): Promise<User | null> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  return await db.collection<User>(COLLECTIONS.USERS).findOne({ _id: objectId });
}

/**
 * Get user by Stripe customer ID
 */
export async function getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
  const db = await getDatabase();
  
  return await db.collection<User>(COLLECTIONS.USERS).findOne({ stripeCustomerId });
}

/**
 * Update user subscription information
 */
export async function updateUserSubscription(
  userId: string | ObjectId,
  subscriptionData: {
    stripeCustomerId?: string;
    subscriptionId?: string;
    subscriptionStatus: User['subscriptionStatus'];
    subscriptionPlan: SubscriptionPlan;
    subscriptionPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
): Promise<void> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  await db.collection<User>(COLLECTIONS.USERS).updateOne(
    { _id: objectId },
    {
      $set: {
        ...subscriptionData,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string | ObjectId): Promise<{
  credits: number;
  creditsUsed: number;
  plan: SubscriptionPlan;
}> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const user = await db.collection<User>(COLLECTIONS.USERS).findOne(
    { _id: objectId },
    { projection: { credits: 1, creditsUsed: 1, subscriptionPlan: 1 } }
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    credits: user.credits,
    creditsUsed: user.creditsUsed,
    plan: user.subscriptionPlan,
  };
}

/**
 * Deduct credits from user (atomic operation)
 */
export async function deductCredits(
  userId: string | ObjectId,
  amount: number
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  // First check if user has enough credits
  const user = await db.collection<User>(COLLECTIONS.USERS).findOne(
    { _id: objectId },
    { projection: { credits: 1 } }
  );
  
  if (!user) {
    return { success: false, newBalance: 0, error: 'User not found' };
  }
  
  if (user.credits < amount) {
    return { 
      success: false, 
      newBalance: user.credits, 
      error: 'Insufficient credits' 
    };
  }
  
  // Atomic update: deduct credits and increment creditsUsed
  const result = await db.collection<User>(COLLECTIONS.USERS).findOneAndUpdate(
    { 
      _id: objectId,
      credits: { $gte: amount } // Double-check in the query
    },
    {
      $inc: { 
        credits: -amount,
        creditsUsed: amount,
      },
      $set: {
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  
  if (!result) {
    return { 
      success: false, 
      newBalance: user.credits, 
      error: 'Failed to deduct credits' 
    };
  }
  
  return {
    success: true,
    newBalance: result.credits,
  };
}

/**
 * Add credits to user (for allocations, refunds, bonuses)
 */
export async function addCredits(
  userId: string | ObjectId,
  amount: number
): Promise<{ success: boolean; newBalance: number }> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const result = await db.collection<User>(COLLECTIONS.USERS).findOneAndUpdate(
    { _id: objectId },
    {
      $inc: { credits: amount },
      $set: { 
        updatedAt: new Date(),
        lastCreditAllocation: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  
  if (!result) {
    return { success: false, newBalance: 0 };
  }
  
  return {
    success: true,
    newBalance: result.credits,
  };
}

/**
 * Update user's Stripe customer ID
 */
export async function updateStripeCustomerId(
  userId: string | ObjectId,
  stripeCustomerId: string
): Promise<void> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  await db.collection<User>(COLLECTIONS.USERS).updateOne(
    { _id: objectId },
    {
      $set: {
        stripeCustomerId,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Get all users with active subscriptions (for admin/analytics)
 */
export async function getActiveSubscribers(): Promise<User[]> {
  const db = await getDatabase();
  
  return await db.collection<User>(COLLECTIONS.USERS)
    .find({ subscriptionStatus: 'active' })
    .toArray();
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  
  const user = await db.collection<User>(COLLECTIONS.USERS).findOne(
    { _id: objectId },
    { projection: { subscriptionStatus: 1 } }
  );
  
  return user?.subscriptionStatus === 'active';
}
