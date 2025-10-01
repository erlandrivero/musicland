import { NextRequest, NextResponse } from 'next/server';
import { sunoAPI } from '@/lib/sunoapi';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const validation = await sunoAPI.validateAPIKey();
    
    if (validation.valid) {
      return NextResponse.json({
        valid: true,
        message: validation.message,
        credits: validation.credits,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        valid: false,
        message: validation.message,
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('[API] Validation error:', error);
    return NextResponse.json({
      valid: false,
      message: error.message || 'Failed to validate API key',
    }, { status: 500 });
  }
}
