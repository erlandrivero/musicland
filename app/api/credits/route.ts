import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError } from '@/lib/sunoapi';
import { db } from '@/lib/db';

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

    // Update user's credits in database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        credits: creditsData.credits,
        totalCredits: totalCredits,
      },
    });

    return NextResponse.json({
      credits: creditsData.credits,
      totalCredits: totalCredits,
      creditsUsed: 0, // SunoAPI doesn't provide this, we'll track it ourselves
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
