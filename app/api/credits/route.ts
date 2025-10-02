import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError } from '@/lib/sunoapi';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to check credits' },
        { status: 401 }
      );
    }

    // Fetch real credits from SunoAPI
    const creditsData = await sunoAPI.getCredits();

    // Debug logging to see what SunoAPI returns
    console.log('='.repeat(80));
    console.log('[API CREDITS] Raw SunoAPI Response:', creditsData);
    console.log('[API CREDITS] creditsData.credits:', creditsData.credits);
    console.log('[API CREDITS] creditsData.extra_credits:', creditsData.extra_credits);

    // Return the exact credits from SunoAPI
    // SunoAPI returns the total available credits in the 'credits' field
    const response = {
      credits: creditsData.credits, // Use exact value from SunoAPI
      totalCredits: creditsData.credits, // Same as available
      creditsUsed: 0, // We don't track historical total from SunoAPI
      extraCredits: creditsData.extra_credits || 0,
    };

    console.log('[API CREDITS] Returning to client:', response);
    console.log('='.repeat(80));

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('[API] Credits fetch error:', error);

    if (isSunoAPIError(error)) {
      return NextResponse.json(
        {
          error: error.error,
          message: error.message,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch credits',
      },
      { status: 500 }
    );
  }
}
