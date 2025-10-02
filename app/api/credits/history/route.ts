import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// GET /api/credits/history - Get credit usage history for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    
    // Get all credit history for the user
    const history = await db
      .collection(COLLECTIONS.CREDIT_HISTORY)
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100) // Limit to last 100 transactions
      .toArray();

    // Calculate analytics
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyUsage = history
      .filter(h => new Date(h.createdAt) >= oneDayAgo)
      .reduce((sum, h) => sum + (h.creditsUsed || 0), 0);

    const weeklyUsage = history
      .filter(h => new Date(h.createdAt) >= sevenDaysAgo)
      .reduce((sum, h) => sum + (h.creditsUsed || 0), 0);

    const totalUsage = history.reduce((sum, h) => sum + (h.creditsUsed || 0), 0);

    // Usage by type
    const usageByType: Record<string, number> = {};
    history.forEach(h => {
      const type = h.type || 'generation';
      usageByType[type] = (usageByType[type] || 0) + (h.creditsUsed || 0);
    });

    return NextResponse.json({
      history,
      analytics: {
        dailyUsage,
        weeklyUsage,
        totalUsage,
        usageByType,
        recordCount: history.length,
      },
    });
  } catch (error: any) {
    console.error('[API] Failed to fetch credit history:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch credit history',
      },
      { status: 500 }
    );
  }
}

// POST /api/credits/history - Log credit usage
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { creditsUsed, type, description, metadata } = body;

    if (!creditsUsed || creditsUsed <= 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Credits used must be greater than 0' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const historyEntry = {
      userId: session.user.id,
      userEmail: session.user.email,
      creditsUsed,
      type: type || 'generation', // generation, lyrics, stem_separation
      description: description || 'Music generation',
      metadata: metadata || {},
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.CREDIT_HISTORY).insertOne(historyEntry);

    console.log('[API] Credit usage logged:', result.insertedId);

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Failed to log credit usage:', error);
    return NextResponse.json(
      {
        error: 'LOG_ERROR',
        message: 'Failed to log credit usage',
      },
      { status: 500 }
    );
  }
}
