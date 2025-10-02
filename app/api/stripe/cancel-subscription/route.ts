import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { getUserByEmail } from '@/lib/db/users';
import { getActiveSubscription, cancelSubscription } from '@/lib/db/subscriptions';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // 2. Get request body
    const body = await request.json();
    const { cancelAtPeriodEnd = true } = body;

    // 3. Get user from database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 4. Get active subscription
    const subscription = await getActiveSubscription(user._id);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // 5. Cancel subscription in Stripe
    if (cancelAtPeriodEnd) {
      // Cancel at period end (user keeps access until end of billing period)
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    // 6. Update database
    await cancelSubscription(subscription.stripeSubscriptionId, cancelAtPeriodEnd);

    return NextResponse.json({
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will cancel at the end of the billing period'
        : 'Subscription canceled immediately',
    });

  } catch (error: any) {
    console.error('[Cancel Subscription] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
