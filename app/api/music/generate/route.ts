import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sunoAPI, isSunoAPIError, GenerationRequest } from '@/lib/sunoapi';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

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
      gender,
      projectId,
      styleWeight,
      weirdness,
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

    // Check user's credits from SunoAPI
    const creditsData = await sunoAPI.getCredits();
    
    if (creditsData.credits < 10) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_CREDITS', message: 'You need at least 10 credits to generate music' },
        { status: 402 }
      );
    }

    // Add gender to tags if specified
    let finalTags = tags;
    if (custom_mode && gender && gender !== 'auto') {
      const genderText = gender === 'female' ? 'female vocals' : 'male vocals';
      finalTags = tags ? `${tags}, ${genderText}` : genderText;
    }

    // Prepare generation request
    const generationRequest: GenerationRequest = {
      custom_mode,
      mv,
      gpt_description_prompt: custom_mode ? undefined : gpt_description_prompt,
      prompt: custom_mode ? prompt : undefined,
      tags: custom_mode ? finalTags : undefined,
      title: custom_mode ? title : undefined,
      make_instrumental: make_instrumental || false,
      style_weight: styleWeight !== undefined ? styleWeight : undefined,
      weirdness_constraint: weirdness !== undefined ? weirdness : undefined,
    };

    // Generate music using real SunoAPI
    const generations = await sunoAPI.generateMusic(generationRequest);
    
    console.log('[API] Generations received:', generations);

    // Ensure generations is an array
    const generationsArray = Array.isArray(generations) ? generations : [generations];

    // SunoAPI returns task IDs, not full generation objects
    // Map the response to our expected format
    const tracks = generationsArray.map((gen: any) => {
      console.log('[API] Mapping generation:', gen);
      console.log('[API] task_id:', gen.task_id, 'id:', gen.id);
      return {
        id: gen.task_id || gen.id,
        title: title || 'Untitled',
        status: 'processing',
        audioUrl: null,
        videoUrl: null,
        duration: null,
        created_at: new Date().toISOString(),
      };
    });

    // Log credit usage to MongoDB
    try {
      const db = await getDatabase();
      await db.collection(COLLECTIONS.CREDIT_HISTORY).insertOne({
        userId: session.user.id,
        userEmail: session.user.email,
        creditsUsed: 10,
        type: 'generation',
        description: `Music generation: ${title || 'Untitled'}`,
        metadata: {
          modelVersion: mv,
          customMode: custom_mode,
          genre: tags,
          trackIds: tracks.map(t => t.id),
        },
        createdAt: new Date(),
      });
      console.log('[API] Credit usage logged to MongoDB');
    } catch (logError) {
      console.error('[API] Failed to log credit usage:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      tracks: tracks,
      creditsUsed: 10,
      message: tracks[0].status === 'processing' ? 'Generation started. Poll /api/music/status/[id] for updates.' : 'Generation complete',
    }, { status: 201 });

  } catch (error: any) {
    console.error('[API] Music generation error:', error);
    console.error('[API] Error stack:', error.stack);

    if (isSunoAPIError(error)) {
      return NextResponse.json(
        {
          error: error.error,
          message: error.message,
          details: error,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate music',
        details: error.toString(),
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
