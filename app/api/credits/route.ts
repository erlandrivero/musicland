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

    // Calculate total credits (main + extra)
    const totalCredits = creditsData.credits + (creditsData.extra_credits || 0);
    
    // Calculate credits used (assuming user started with totalCredits)
    const creditsUsed = totalCredits - creditsData.credits;

    return NextResponse.json({
      credits: creditsData.credits,
      totalCredits: totalCredits,
      creditsUsed: creditsUsed,
      extraCredits: creditsData.extra_credits || 0,
    }, { status: 200 });

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
