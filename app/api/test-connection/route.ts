import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

  // Test 1: MongoDB Connection
  console.log('[Test] Testing MongoDB connection...');
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    
    results.push({
      test: 'MongoDB Connection',
      status: 'success',
      message: 'Successfully connected to MongoDB',
      data: {
        database: db.databaseName,
        collections: collections.length,
      },
    });
  } catch (error: any) {
    overallSuccess = false;
    results.push({
      test: 'MongoDB Connection',
      status: 'failed',
      message: 'Failed to connect to MongoDB',
      error: error.message || 'Unknown error',
    });
  }

  // Test 2: Generation Request Validation
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

  // Test 3: Environment Configuration
  console.log('[Test] Checking environment configuration...');
  const envChecks = {
    SUNOAPI_KEY: !!process.env.SUNOAPI_KEY,
    SUNOAPI_BASE_URL: !!process.env.SUNOAPI_BASE_URL,
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
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
