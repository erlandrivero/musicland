import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// POST /api/tracks/:id/favorite - Toggle favorite status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { isFavorite } = body;

    // Update favorite status in MongoDB
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRACKS).findOneAndUpdate(
      { id, userEmail: session.user.email },
      { $set: { isFavorite } },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: result.value.id, isFavorite: result.value.isFavorite }, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to update favorite status:', error);
    return NextResponse.json(
      {
        error: 'UPDATE_ERROR',
        message: 'Failed to update favorite status',
      },
      { status: 500 }
    );
  }
}
