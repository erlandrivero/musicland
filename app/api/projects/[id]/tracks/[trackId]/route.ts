import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// DELETE /api/projects/:id/tracks/:trackId - Remove a track from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; trackId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id, trackId } = params;
    const db = await getDatabase();

    // Remove track from project
    const result = await db.collection(COLLECTIONS.PROJECTS).findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.user.id },
      {
        $pull: { trackIds: trackId } as any,
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Track removed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Failed to remove track from project:', error);
    return NextResponse.json(
      {
        error: 'REMOVE_ERROR',
        message: 'Failed to remove track from project',
      },
      { status: 500 }
    );
  }
}
