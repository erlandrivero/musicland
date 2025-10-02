import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// GET /api/tracks - Get all tracks for current user
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
    const tracks = await db
      .collection(COLLECTIONS.TRACKS)
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tracks, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to fetch tracks:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch tracks',
      },
      { status: 500 }
    );
  }
}

// POST /api/tracks - Save a new track
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
    const { id, title, audioUrl, videoUrl, tags, duration, lyrics } = body;

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Audio URL is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const trackId = id || crypto.randomUUID();
    
    // Check if track already exists to prevent duplicates
    const existingTrack = await db
      .collection(COLLECTIONS.TRACKS)
      .findOne({ id: trackId, userId: session.user.id });
    
    if (existingTrack) {
      console.log('[API] Track already exists, skipping duplicate:', trackId);
      return NextResponse.json(
        { success: true, track: existingTrack, id: existingTrack._id, duplicate: true },
        { status: 200 }
      );
    }
    
    const track = {
      id: trackId,
      userId: session.user.id,
      userEmail: session.user.email,
      title: title || 'Untitled Track',
      audioUrl,
      videoUrl: videoUrl || null,
      tags: tags || '',
      duration: duration || 0,
      lyrics: lyrics || null,
      status: 'completed',
      isFavorite: false,
      playCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.TRACKS).insertOne(track);

    console.log('[API] Track saved to MongoDB:', result.insertedId);

    return NextResponse.json(
      { success: true, track, id: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Failed to save track:', error);
    return NextResponse.json(
      {
        error: 'SAVE_ERROR',
        message: 'Failed to save track',
      },
      { status: 500 }
    );
  }
}
