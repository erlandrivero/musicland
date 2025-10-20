import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import type { WAVConversionRequest, WAVConversionResponse } from '@/types/suno-extended';

export const runtime = 'nodejs';

/**
 * POST /api/music/wav
 * Convert track to WAV format (3 credits)
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

    const body: WAVConversionRequest = await request.json();
    const { taskId, audioId, callBackUrl } = body;

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

    // Call Suno API for WAV conversion
    const response = await fetch('https://api.sunoapi.org/api/v1/wav/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        audioId,
        callBackUrl: callBackUrl || `${process.env.NEXTAUTH_URL}/api/music/callback`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Suno API error:', error);
      return NextResponse.json(
        { error: 'Failed to convert to WAV' },
        { status: response.status }
      );
    }

    const result: WAVConversionResponse = await response.json();

    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.msg || 'Failed to convert to WAV' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      taskId: result.data.taskId,
      status: 'pending',
      message: 'WAV conversion started',
    });
  } catch (error) {
    console.error('WAV conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
