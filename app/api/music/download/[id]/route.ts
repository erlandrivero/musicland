import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to download tracks' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch track from MongoDB
    const db = await getDatabase();
    const track = await db.collection(COLLECTIONS.TRACKS).findOne({
      id,
      userEmail: session.user.email,
    });

    if (!track) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    if (track.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have access to this track' },
        { status: 403 }
      );
    }

    if (track.status !== 'completed') {
      return NextResponse.json(
        { error: 'NOT_READY', message: 'Track is not ready for download yet' },
        { status: 400 }
      );
    }

    if (!track.audioUrl) {
      return NextResponse.json(
        { error: 'NO_AUDIO', message: 'No audio file available for this track' },
        { status: 404 }
      );
    }

    // Get download type from query params (audio or video)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'audio';

    const downloadUrl = type === 'video' && track.videoUrl ? track.videoUrl : track.audioUrl;

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'NO_FILE', message: `No ${type} file available for this track` },
        { status: 404 }
      );
    }

    // Return download URL (client will handle the actual download)
    return NextResponse.json({
      downloadUrl,
      title: track.title,
      type,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API] Download error:', error);
    return NextResponse.json(
      {
        error: 'DOWNLOAD_ERROR',
        message: 'Failed to prepare download',
      },
      { status: 500 }
    );
  }
}
