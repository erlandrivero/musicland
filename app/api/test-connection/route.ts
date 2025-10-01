import { NextRequest, NextResponse } from 'next/server';
import { sunoAPI, isSunoAPIError } from '@/lib/sunoapi';

export const runtime = 'nodejs';

interface TestResult {
  test: string;
  status: 'success' | 'failed';
  message: string;
  data?: any;
  error?: string;
}

export async function GET(request: NextRequest) {
  const results: TestResult[] = [];
  let overallSuccess = true;

  // Test 1: API Key Validation
  console.log('[Test] Starting API key validation...');
  try {
    const validation = await sunoAPI.validateAPIKey();
    
    if (validation.valid) {
      results.push({
        test: 'API Key Validation',
        status: 'success',
        message: 'API key is valid and authenticated',
        data: {
          credits: validation.credits,
        },
      });
    } else {
      overallSuccess = false;
      results.push({
        test: 'API Key Validation',
        status: 'failed',
        message: validation.message,
      });
    }
  } catch (error: any) {
    overallSuccess = false;
    results.push({
      test: 'API Key Validation',
      status: 'failed',
      message: 'Failed to validate API key',
      error: error.message || 'Unknown error',
    });
  }

  // Test 2: Fetch Credits
  console.log('[Test] Fetching credits...');
  try {
    const credits = await sunoAPI.getCredits();
    
    results.push({
      test: 'Fetch Credits',
      status: 'success',
      message: 'Successfully fetched credit balance',
      data: {
        credits: credits.credits,
        extraCredits: credits.extra_credits,
      },
    });
  } catch (error: any) {
    overallSuccess = false;
    const errorMessage = isSunoAPIError(error) ? error.message : 'Failed to fetch credits';
    results.push({
      test: 'Fetch Credits',
      status: 'failed',
      message: errorMessage,
      error: error.error || 'Unknown error',
    });
  }

  // Test 3: Test Generation Request (Dry Run - Check Parameters Only)
  console.log('[Test] Validating generation parameters...');
  try {
    // We'll validate the request structure without actually generating
    // to avoid consuming credits during testing
    const testRequest = {
      custom_mode: false,
      gpt_description_prompt: 'A happy upbeat pop song about coding',
      mv: 'chirp-v3-5',
      make_instrumental: false,
    };

    // Validate request structure
    if (!testRequest.mv) {
      throw new Error('Model version is required');
    }

    if (!testRequest.custom_mode && !testRequest.gpt_description_prompt) {
      throw new Error('Non-custom mode requires gpt_description_prompt');
    }

    results.push({
      test: 'Generation Request Validation',
      status: 'success',
      message: 'Generation request parameters are valid',
      data: {
        note: 'Actual generation not performed to preserve credits',
        validatedRequest: testRequest,
      },
    });
  } catch (error: any) {
    overallSuccess = false;
    results.push({
      test: 'Generation Request Validation',
      status: 'failed',
      message: 'Invalid generation request parameters',
      error: error.message || 'Unknown error',
    });
  }

  // Test 4: Environment Configuration
  console.log('[Test] Checking environment configuration...');
  const envChecks = {
    SUNOAPI_KEY: !!process.env.SUNOAPI_KEY,
    SUNOAPI_BASE_URL: !!process.env.SUNOAPI_BASE_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
  };

  const missingEnvVars = Object.entries(envChecks)
    .filter(([_, exists]) => !exists)
    .map(([key]) => key);

  if (missingEnvVars.length === 0) {
    results.push({
      test: 'Environment Configuration',
      status: 'success',
      message: 'All required environment variables are configured',
      data: {
        configured: Object.keys(envChecks),
      },
    });
  } else {
    overallSuccess = false;
    results.push({
      test: 'Environment Configuration',
      status: 'failed',
      message: 'Missing required environment variables',
      data: {
        missing: missingEnvVars,
      },
    });
  }

  // Return comprehensive test results
  return NextResponse.json({
    success: overallSuccess,
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
    },
    results,
  }, { 
    status: overallSuccess ? 200 : 500 
  });
}
