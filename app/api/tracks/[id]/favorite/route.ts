import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// POST /api/tracks/:id/favorite - Toggle favorite status
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
    const body = await request.json();
    const { isFavorite } = body;

    // Update favorite status in MongoDB
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRACKS).findOneAndUpdate(
      { id, userId: session.user.id },
      { $set: { isFavorite, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    console.log('[API] Favorite updated successfully:', { id, isFavorite });
    
    return NextResponse.json({ 
      success: true,
      id: result.id, 
      isFavorite: result.isFavorite 
    }, { status: 200 });
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
