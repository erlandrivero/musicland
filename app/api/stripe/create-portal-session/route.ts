import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { getUserByEmail } from '@/lib/db/users';

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

    // 3. Check if user has a Stripe customer ID
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    // 4. Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    // 5. Return portal session URL
    return NextResponse.json({
      url: portalSession.url,
    });

  } catch (error: any) {
    console.error('[Stripe Portal] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create portal session',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
