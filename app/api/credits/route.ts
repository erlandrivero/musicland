import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/lib/db/users';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to check credits' },
        { status: 401 }
      );
    }

    // Fetch user from local database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found in database' },
        { status: 404 }
      );
    }

    // Return local database credits
    const response = {
      credits: user.credits || 0,
      totalCredits: (user.credits || 0) + (user.creditsUsed || 0),
      creditsUsed: user.creditsUsed || 0,
      extraCredits: 0,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('[API] Credits fetch error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
