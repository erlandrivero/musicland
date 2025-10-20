import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// POST /api/tracks/:id/play - Increment play count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Update play count in MongoDB
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRACKS).findOneAndUpdate(
      { id },
      { $inc: { playCount: 1 } },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: result.value.id, playCount: result.value.playCount }, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to update play count:', error);
    return NextResponse.json(
      {
        error: 'UPDATE_ERROR',
        message: 'Failed to update play count',
      },
      { status: 500 }
    );
  }
}
