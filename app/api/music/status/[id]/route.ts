import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError } from '@/lib/sunoapi';
import { db } from '@/lib/db';

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
        { error: 'Unauthorized', message: 'You must be logged in to check generation status' },
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

    // Fetch real status from SunoAPI
    const status = await sunoAPI.getGenerationStatus(id);

    // Update track in database
    await db.track.update({
      where: { id },
      data: {
        status: status.status,
        audioUrl: status.audio_url,
        videoUrl: status.video_url,
        title: status.title || undefined,
        duration: status.duration || undefined,
      },
    });

    return NextResponse.json({
      id: status.id,
      status: status.status,
      audioUrl: status.audio_url,
      videoUrl: status.video_url,
      title: status.title,
      duration: status.duration,
      error: status.error,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API] Status fetch error:', error);

    if (isSunoAPIError(error)) {
      return NextResponse.json(
        {
          error: error.error,
          message: error.message,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'STATUS_ERROR',
        message: 'Failed to fetch generation status',
      },
      { status: 500 }
    );
  }
}
