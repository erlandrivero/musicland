import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/lib/db/users';
import { getActiveSubscription } from '@/lib/db/subscriptions';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // 2. Get user from database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 3. Get active subscription details
    const subscription = await getActiveSubscription(user._id);

    // 4. Return subscription status (use subscription's period end if user's is missing)
    const periodEnd = user.subscriptionPeriodEnd || subscription?.currentPeriodEnd;
    
    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPeriodEnd: periodEnd,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
      },
      subscription: subscription ? {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        amount: subscription.amount,
        currency: subscription.currency,
      } : null,
    });

  } catch (error: any) {
    console.error('[Subscription Status] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch subscription status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
