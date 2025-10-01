import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError, GenerationRequest } from '@/lib/sunoapi';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to generate music' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      custom_mode,
      gpt_description_prompt,
      prompt,
      tags,
      title,
      make_instrumental,
      mv,
      projectId,
    } = body;

    // Validate required fields
    if (!mv) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Model version (mv) is required' },
        { status: 400 }
      );
    }

    if (custom_mode && (!prompt || !tags)) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Custom mode requires prompt and tags' },
        { status: 400 }
      );
    }

    if (!custom_mode && !gpt_description_prompt) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Non-custom mode requires gpt_description_prompt' },
        { status: 400 }
      );
    }

    // Check user's credits before generation
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits < 10) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_CREDITS', message: 'You need at least 10 credits to generate music' },
        { status: 402 }
      );
    }

    // Prepare generation request
    const generationRequest: GenerationRequest = {
      custom_mode,
      mv,
      gpt_description_prompt: custom_mode ? undefined : gpt_description_prompt,
      prompt: custom_mode ? prompt : undefined,
      tags: custom_mode ? tags : undefined,
      title: custom_mode ? title : undefined,
      make_instrumental: make_instrumental || false,
    };

    // Generate music using real SunoAPI
    const generations = await sunoAPI.generateMusic(generationRequest);

    // Save tracks to database
    const tracks = await Promise.all(
      generations.map(async (gen) => {
        return db.track.create({
          data: {
            id: gen.id,
            title: gen.title || title || 'Untitled',
            description: custom_mode ? prompt : gpt_description_prompt,
            audioUrl: gen.audio_url,
            videoUrl: gen.video_url,
            genre: tags,
            duration: gen.duration,
            status: gen.status,
            userId: session.user.id!,
            projectId: projectId || null,
            prompt: custom_mode ? prompt : gpt_description_prompt,
            style: tags,
            isCustom: custom_mode,
            model: 'suno',
          },
        });
      })
    );

    // Deduct credits from user (10 credits per generation)
    await db.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          decrement: 10,
        },
      },
    });

    return NextResponse.json({
      success: true,
      tracks: tracks.map(track => ({
        id: track.id,
        title: track.title,
        status: track.status,
        audioUrl: track.audioUrl,
        videoUrl: track.videoUrl,
      })),
      creditsUsed: 10,
    }, { status: 201 });

  } catch (error: any) {
    console.error('[API] Music generation error:', error);

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
        error: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate music',
      },
      { status: 500 }
    );
  }
}
