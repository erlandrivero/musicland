import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPromptHistory } from '@/lib/db/promptHistory';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to view prompt history' },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email || '';
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('[Prompt History] Fetching history for user:', userId);

    const history = await getUserPromptHistory(userId, limit);

    return NextResponse.json({
      history,
      total: history.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Prompt History] Error:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: error.message || 'Failed to fetch prompt history',
      },
      { status: 500 }
    );
  }
}
