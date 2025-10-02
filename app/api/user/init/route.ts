import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, createUser } from '@/lib/db/users';

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

    // 2. Check if user exists in database
    let user = await getUserByEmail(session.user.email);
    
    // 3. If user doesn't exist, create them
    if (!user) {
      console.log('[User Init] Creating new user:', session.user.email);
      user = await createUser({
        email: session.user.email,
        name: session.user.name || 'User',
        image: session.user.image || undefined,
      });
      console.log('[User Init] ✅ User created successfully');
    }

    // 4. Return user data
    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
      },
    });

  } catch (error: any) {
    console.error('[User Init] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize user',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
