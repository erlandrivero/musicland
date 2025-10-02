import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// POST /api/projects/:id/tracks - Add tracks to a project
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
    const { trackIds } = body;

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Track IDs are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Add tracks to project
    const result = await db.collection(COLLECTIONS.PROJECTS).findOneAndUpdate(
      { _id: new ObjectId(id), userId: session.user.id },
      {
        $addToSet: { trackIds: { $each: trackIds } },
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
      { message: 'Tracks added successfully', trackIds: result.value.trackIds },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Failed to add tracks to project:', error);
    return NextResponse.json(
      {
        error: 'ADD_ERROR',
        message: 'Failed to add tracks to project',
      },
      { status: 500 }
    );
  }
}
