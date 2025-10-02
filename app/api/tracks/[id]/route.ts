import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// DELETE /api/tracks/:id - Delete a track
export async function DELETE(
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

    // Delete track from MongoDB
    const db = await getDatabase();
    const result = await db.collection(COLLECTIONS.TRACKS).deleteOne({
      id,
      userEmail: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found or you do not have access' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Track deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Failed to delete track:', error);
    return NextResponse.json(
      {
        error: 'DELETE_ERROR',
        message: 'Failed to delete track',
      },
      { status: 500 }
    );
  }
}
