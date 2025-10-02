import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { 
  getUserByStripeCustomerId, 
  updateUserSubscription 
} from '@/lib/db/users';
import { 
  createSubscription, 
  updateSubscription,
  getSubscriptionByStripeId 
} from '@/lib/db/subscriptions';
import { allocateMonthlyCredits } from '@/lib/db/credits';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('[Stripe Webhook] No signature found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('[Stripe Webhook] Signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[Webhook] Processing subscription.created:', subscription.id);

  try {
    const customerId = subscription.customer as string;
    const user = await getUserByStripeCustomerId(customerId);

    if (!user) {
      console.error('[Webhook] User not found for customer:', customerId);
      return;
    }

    // Determine plan from price ID
    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanFromPriceId(priceId);

    if (!plan) {
      console.error('[Webhook] Unknown price ID:', priceId);
      return;
    }

    // Create subscription record in database
    await createSubscription({
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: priceId,
      status: subscription.status as any,
      plan,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.currency,
      interval: subscription.items.data[0]?.price.recurring?.interval as any,
    });

    // Update user subscription status
    await updateUserSubscription(user._id, {
      stripeCustomerId: customerId,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status as any,
      subscriptionPlan: plan,
      subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    });

    // Allocate credits for the new subscription (reset to plan amount, don't add to free credits)
    await allocateMonthlyCredits(user._id, plan, subscription.id, true);

    console.log('[Webhook] ✅ Subscription created successfully for user:', user.email);

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionCreated:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[Webhook] Processing subscription.updated:', subscription.id);

  try {
    const customerId = subscription.customer as string;
    const user = await getUserByStripeCustomerId(customerId);

    if (!user) {
      console.error('[Webhook] User not found for customer:', customerId);
      return;
    }

    // Determine plan from price ID
    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanFromPriceId(priceId);

    if (!plan) {
      console.error('[Webhook] Unknown price ID:', priceId);
      return;
    }

    // Update subscription record
    await updateSubscription(subscription.id, {
      status: subscription.status as any,
      plan,
      stripePriceId: priceId,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
    });

    // Update user subscription status
    await updateUserSubscription(user._id, {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status as any,
      subscriptionPlan: plan,
      subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    });

    console.log('[Webhook] ✅ Subscription updated successfully for user:', user.email);

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[Webhook] Processing subscription.deleted:', subscription.id);

  try {
    const customerId = subscription.customer as string;
    const user = await getUserByStripeCustomerId(customerId);

    if (!user) {
      console.error('[Webhook] User not found for customer:', customerId);
      return;
    }

    // Update subscription record
    await updateSubscription(subscription.id, {
      status: 'canceled',
      canceledAt: new Date(),
    });

    // Downgrade user to free plan
    await updateUserSubscription(user._id, {
      subscriptionStatus: 'canceled',
      subscriptionPlan: 'free',
      cancelAtPeriodEnd: false,
    });

    console.log('[Webhook] ✅ Subscription canceled for user:', user.email);

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[Webhook] Processing invoice.payment_succeeded:', invoice.id);

  try {
    const subscriptionId = (invoice as any).subscription as string;
    
    if (!subscriptionId) {
      console.log('[Webhook] No subscription ID in invoice');
      return;
    }

    const customerId = invoice.customer as string;
    const user = await getUserByStripeCustomerId(customerId);

    if (!user) {
      console.error('[Webhook] User not found for customer:', customerId);
      return;
    }

    // Get subscription to determine plan
    const dbSubscription = await getSubscriptionByStripeId(subscriptionId);
    
    if (!dbSubscription) {
      console.error('[Webhook] Subscription not found:', subscriptionId);
      return;
    }

    // Allocate monthly credits for renewal
    await allocateMonthlyCredits(user._id, dbSubscription.plan, subscriptionId);

    console.log('[Webhook] ✅ Payment succeeded, credits allocated for user:', user.email);

  } catch (error) {
    console.error('[Webhook] Error in handlePaymentSucceeded:', error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[Webhook] Processing invoice.payment_failed:', invoice.id);

  try {
    const subscriptionId = (invoice as any).subscription as string;
    
    if (!subscriptionId) {
      console.log('[Webhook] No subscription ID in invoice');
      return;
    }

    const customerId = invoice.customer as string;
    const user = await getUserByStripeCustomerId(customerId);

    if (!user) {
      console.error('[Webhook] User not found for customer:', customerId);
      return;
    }

    // Update subscription status to past_due
    await updateSubscription(subscriptionId, {
      status: 'past_due',
    });

    // Get current subscription plan to maintain it
    const dbSubscription = await getSubscriptionByStripeId(subscriptionId);
    
    await updateUserSubscription(user._id, {
      subscriptionStatus: 'past_due',
      subscriptionPlan: dbSubscription?.plan || user.subscriptionPlan,
    });

    console.log('[Webhook] ⚠️ Payment failed for user:', user.email);
    
    // TODO: Send email notification to user about payment failure

  } catch (error) {
    console.error('[Webhook] Error in handlePaymentFailed:', error);
    throw error;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function getPlanFromPriceId(priceId: string): 'basic' | 'creator' | 'team' | null {
  if (priceId === process.env.STRIPE_PRICE_BASIC) return 'basic';
  if (priceId === process.env.STRIPE_PRICE_CREATOR) return 'creator';
  if (priceId === process.env.STRIPE_PRICE_TEAM) return 'team';
  return null;
}
