import { NextRequest, NextResponse } from 'next/server';
import { sunoAPI } from '@/lib/sunoapi';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG] Testing SunoAPI generation...');
    
    const testRequest = {
      custom_mode: false,
      gpt_description_prompt: "A happy upbeat pop song about coding",
      mv: "chirp-v3-5",
      make_instrumental: false,
    };

    console.log('[DEBUG] Request:', JSON.stringify(testRequest, null, 2));
    
    const result = await sunoAPI.generateMusic(testRequest);
    
    console.log('[DEBUG] Raw result type:', typeof result);
    console.log('[DEBUG] Is array?:', Array.isArray(result));
    console.log('[DEBUG] Result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      resultType: typeof result,
      isArray: Array.isArray(result),
      result: result,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[DEBUG] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      fullError: error,
    }, { status: 500 });
  }
}
