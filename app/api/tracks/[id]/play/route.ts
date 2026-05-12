import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

// GET /api/tracks/:id/play - Stream audio file (proxy to bypass CORS)
export async function GET(
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

    // Fetch track from MongoDB
    const db = await getDatabase();
    const track = await db.collection(COLLECTIONS.TRACKS).findOne({
      id,
      $or: [
        { userEmail: session.user.email },
        { userId: session.user.id }
      ]
    });

    if (!track) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    if (!track.audioUrl) {
      return NextResponse.json(
        { error: 'NO_AUDIO', message: 'No audio file available' },
        { status: 404 }
      );
    }

    // Proxy the audio stream
    const audioResponse = await fetch(track.audioUrl);
    
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: 'FETCH_ERROR', message: 'Failed to fetch audio from CDN' },
        { status: 500 }
      );
    }

    // Stream the audio with proper headers
    return new NextResponse(audioResponse.body, {
      status: 200,
      headers: {
        'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': audioResponse.headers.get('content-length') || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('[API] Failed to stream audio:', error);
    return NextResponse.json(
      {
        error: 'STREAM_ERROR',
        message: 'Failed to stream audio',
      },
      { status: 500 }
    );
  }
}

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
