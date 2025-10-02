import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { getUserByEmail, updateStripeCustomerId } from '@/lib/db/users';
import { PRICING_PLANS } from '@/lib/types/database';

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
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // 3. Validate price ID
    const selectedPlan = PRICING_PLANS.find(plan => plan.priceId === priceId);
    
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // 4. Get user from database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 5. Check if user already has an active subscription
    if (user.subscriptionStatus === 'active') {
      return NextResponse.json(
        { 
          error: 'You already have an active subscription. Please manage your subscription in the customer portal.',
          redirectToPortal: true,
        },
        { status: 400 }
      );
    }

    // 6. Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user._id.toString(),
        },
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await updateStripeCustomerId(user._id, customerId);
    }

    // 7. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan: selectedPlan.id,
      },
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          plan: selectedPlan.id,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    // 8. Return checkout session URL
    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error: any) {
    console.error('[Stripe Checkout] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
