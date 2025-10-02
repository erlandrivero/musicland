import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { getUserByEmail, updateUserSubscription } from '@/lib/db/users';
import { getActiveSubscription, updateSubscription } from '@/lib/db/subscriptions';

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

    // 2. Get user from database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      );
    }

    // 3. Fetch subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found in Stripe' },
        { status: 404 }
      );
    }

    const stripeSubscription = subscriptions.data[0];

    // 4. Get plan from price ID
    const priceId = stripeSubscription.items.data[0]?.price.id;
    let plan: 'basic' | 'creator' | 'team' = 'creator';
    
    if (priceId === process.env.STRIPE_PRICE_BASIC) plan = 'basic';
    if (priceId === process.env.STRIPE_PRICE_CREATOR) plan = 'creator';
    if (priceId === process.env.STRIPE_PRICE_TEAM) plan = 'team';

    // 5. Update user with correct subscription data
    await updateUserSubscription(user._id, {
      stripeCustomerId: user.stripeCustomerId,
      subscriptionId: stripeSubscription.id,
      subscriptionStatus: stripeSubscription.status as any,
      subscriptionPlan: plan,
      subscriptionPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
    });

    // 6. Update subscription record if it exists
    const dbSubscription = await getActiveSubscription(user._id);
    if (dbSubscription) {
      await updateSubscription(stripeSubscription.id, {
        currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        status: stripeSubscription.status as any,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully',
      periodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
    });

  } catch (error: any) {
    console.error('[Subscription Sync] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to sync subscription',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
