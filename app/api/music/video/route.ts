import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import type { MusicVideoRequest, MusicVideoResponse } from '@/types/suno-extended';

export const runtime = 'nodejs';

/**
 * POST /api/music/video
 * Generate MP4 video with visualizations (5 credits)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: MusicVideoRequest = await request.json();
    const {
      taskId,
      audioId,
      author,
      domainName = 'AI Music Studio',
      callBackUrl,
    } = body;

    if (!taskId || !audioId) {
      return NextResponse.json(
        { error: 'Invalid request: taskId and audioId are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SUNOAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Call Suno API for video generation
    const response = await fetch('https://api.sunoapi.org/api/v1/mp4/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        audioId,
        author: author || session.user.name || 'Anonymous',
        domainName,
        callBackUrl: callBackUrl || `${process.env.NEXTAUTH_URL}/api/music/callback`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Suno API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate video' },
        { status: response.status }
      );
    }

    const result: MusicVideoResponse = await response.json();

    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.msg || 'Failed to generate video' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      taskId: result.data.taskId,
      status: 'pending',
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
