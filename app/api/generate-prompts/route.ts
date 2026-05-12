import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/auth';
import { savePromptHistory } from '@/lib/db/promptHistory';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are an expert musicologist, audio engineer, and AI music generation specialist.
When given an artist name and song title, you must perform a deep internal analysis before generating prompts.

STEP 1: DEEP MUSICAL RESEARCH
Use your knowledge to analyze the requested song and artist. If needed, search for specific details.
Identify:
- Artist Vocal Style: Timbre, range, signature techniques (e.g., belting, falsetto, vocal fry, grit)
- Genre & Sub-genre: Primary genre and specific sub-genres or fusions
- Tempo & Rhythm: Approximate BPM, time signature, groove (e.g., swing, straight, syncopated)
- Instrumentation: Key instruments, signature sounds, production techniques (e.g., analog, synth-heavy, acoustic)
- Mood & Theme: Emotional resonance, lyrical themes, atmosphere

STEP 2: PROMPT GENERATION
Based strictly on your research in Step 1, generate exactly 4 different Suno AI music generation prompts.
Each prompt MUST be under 400 characters.
Each prompt should capture a different aspect or variation of the song's style:
- Prompt 1: Classic/original style faithful to the song's exact production era and arrangement
- Prompt 2: Genre/instrumentation focus (highlighting the specific musical arrangement)
- Prompt 3: Vocal and emotional focus (highlighting the singer's specific delivery style)
- Prompt 4: Modern reinterpretation or alternative arrangement

Format your response as valid JSON only, with no extra text:
{
  "artist_analysis": "Detailed 2-sentence analysis of the artist's specific vocal style and signature sound",
  "song_analysis": "Detailed 2-sentence analysis of the song's tempo, instrumentation, and production style",
  "prompts": [
    { "title": "Classic Style", "prompt": "...", "characters": 0 },
    { "title": "Instrumental Focus", "prompt": "...", "characters": 0 },
    { "title": "Vocal & Emotion", "prompt": "...", "characters": 0 },
    { "title": "Modern Interpretation", "prompt": "...", "characters": 0 }
  ]
}

CRITICAL RULES:
1. Be highly specific with musical terms (e.g., use "slap bass" instead of "bass", "warm contralto" instead of "female voice").
2. Every prompt in the "prompt" field MUST be 400 characters or fewer. Count carefully.
3. Focus on musical elements that Suno AI can understand and reproduce.`;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to generate prompts' },
        { status: 401 }
      );
    }

    const { artist, song } = await request.json();

    if (!artist || !song) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Artist and song are required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      console.error('[Prompt Generator] GOOGLE_AI_STUDIO_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'CONFIGURATION_ERROR', message: 'Gemini API key not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('[Prompt Generator] Generating prompts for:', artist, '-', song);
    console.log('[Prompt Generator] API Key present:', !!apiKey);

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });

    const userMessage = `Artist: ${artist}\nSong: ${song}\n\nResearch this song and generate 4 Suno AI music prompts, each under 400 characters.`;

    // Call Gemini 2.5 Flash with Google Search Grounding
    // Note: Can't use responseMimeType with tools, so we parse JSON manually
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        tools: [{ googleSearch: {} }], // Enable real-time web search
      },
    });

    const rawResponse = result.text || '';

    console.log('[Prompt Generator] Raw response:', rawResponse);

    // Extract JSON from response (may have markdown code blocks)
    let jsonText = rawResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(jsonText);

    // Validate and trim prompts to 400 chars to guarantee safety
    const validatedPrompts = parsed.prompts.map((p: any) => ({
      title: p.title,
      prompt: p.prompt.substring(0, 400),
      characters: Math.min(p.prompt.length, 400),
    }));

    // Save to MongoDB
    try {
      await savePromptHistory({
        userId: session.user.id || session.user.email || '',
        userEmail: session.user.email || '',
        artist,
        song,
        artistAnalysis: parsed.artist_analysis,
        songAnalysis: parsed.song_analysis,
        prompts: validatedPrompts,
      });
      console.log('[Prompt Generator] Saved to history');
    } catch (dbError) {
      console.error('[Prompt Generator] Failed to save prompt history:', dbError);
      // Continue even if DB save fails
    }

    return NextResponse.json({
      artist,
      song,
      artistAnalysis: parsed.artist_analysis,
      songAnalysis: parsed.song_analysis,
      prompts: validatedPrompts,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Prompt Generator] Error:', error);
    return NextResponse.json(
      {
        error: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate prompts. Please try again.',
      },
      { status: 500 }
    );
  }
}
