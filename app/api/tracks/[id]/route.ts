import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

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

    // Verify track belongs to user
    const track = await db.track.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!track) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    if (track.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have access to this track' },
        { status: 403 }
      );
    }

    // Delete the track
    await db.track.delete({
      where: { id },
    });

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
