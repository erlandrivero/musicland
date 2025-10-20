import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import type { ExtendMusicRequest, ExtendMusicResponse } from '@/types/suno-extended';

export const runtime = 'nodejs';

/**
 * POST /api/music/extend
 * Extend/continue existing music tracks (5-7 credits)
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

    const body: ExtendMusicRequest = await request.json();
    const {
      audioId,
      prompt,
      style,
      title,
      continueAt,
      model = 'V5',
      negativeTags,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight,
      callBackUrl,
    } = body;

    if (!audioId || !continueAt) {
      return NextResponse.json(
        { error: 'Invalid request: audioId and continueAt are required' },
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

    // Call Suno API for music extension
    const response = await fetch('https://api.sunoapi.org/api/v1/generate/extend', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        defaultParamFlag: true,
        audioId,
        prompt: prompt || 'Continue the music',
        style,
        title,
        continueAt,
        model,
        negativeTags,
        vocalGender,
        styleWeight,
        weirdnessConstraint,
        audioWeight,
        callBackUrl: callBackUrl || `${process.env.NEXTAUTH_URL}/api/music/callback`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Suno API error:', error);
      return NextResponse.json(
        { error: 'Failed to extend music' },
        { status: response.status }
      );
    }

    const result: ExtendMusicResponse = await response.json();

    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.msg || 'Failed to extend music' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      taskId: result.data.taskId,
      status: 'pending',
      message: 'Music extension started',
    });
  } catch (error) {
    console.error('Music extension error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
