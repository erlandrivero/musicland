import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError } from '@/lib/sunoapi';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    console.log('[API] Fetching status for task ID:', id);

    // Fetch status directly from SunoAPI (no database check)
    const status = await sunoAPI.getGenerationStatus(id);

    console.log('[API] Status response:', JSON.stringify(status, null, 2));

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
    console.error('[API] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

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
