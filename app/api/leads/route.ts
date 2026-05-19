import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface LeadData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, source } = body as LeadData;

    // Validation
    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'First name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // VibeReach uses the GoHighLevel/LeadConnector API architecture
    const VIBEREACH_API_KEY = process.env.VIBEREACH_API_KEY;
    const VIBEREACH_LOCATION_ID = process.env.VIBEREACH_LOCATION_ID;

    if (!VIBEREACH_API_KEY || !VIBEREACH_LOCATION_ID) {
      console.error('Missing VibeReach API credentials');
      
      // In development, simulate success if keys aren't set
      if (process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Simulating successful lead capture');
        console.log('Lead Data:', { firstName, lastName, email, phone, source });
        return NextResponse.json({ 
          success: true, 
          simulated: true,
          message: 'Development mode - lead not sent to VibeReach'
        });
      }
      
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Format the payload according to GHL API v2 specs
    const payload: any = {
      firstName: firstName.trim(),
      lastName: lastName?.trim() || '',
      name: `${firstName.trim()} ${lastName?.trim() || ''}`.trim(),
      email: email.toLowerCase().trim(),
      locationId: VIBEREACH_LOCATION_ID,
      tags: ['ai-music-studio-lead', 'lead-magnet-prompts'],
      source: source || 'Landing Page Form',
    };

    // Add phone if provided
    if (phone && phone.trim()) {
      payload.phone = phone.trim();
    }

    // Add custom fields only if they're configured in VibeReach
    // Comment out if you haven't created these custom fields yet
    /*
    payload.customFields = [
      {
        id: 'lead_magnet_requested',
        value: 'Top 50 AI Music Prompts'
      }
    ];
    */

    console.log('[Lead Capture] Sending to VibeReach:', { 
      email: payload.email, 
      name: payload.name 
    });

    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VIBEREACH_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('[VibeReach API Error]');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(responseData, null, 2));
      console.error('Payload sent:', JSON.stringify(payload, null, 2));
      
      // Handle duplicate contact gracefully
      if (response.status === 409 || responseData.message?.includes('already exists') || responseData.message?.includes('duplicate')) {
        console.log('[Lead Capture] Contact already exists, treating as success');
        return NextResponse.json({ 
          success: true, 
          duplicate: true,
          message: 'You\'re already on our list! Check your email for the guide.'
        });
      }
      
      // Return detailed error in development
      const errorMessage = responseData.message || responseData.error || 'Failed to create contact in VibeReach';
      throw new Error(errorMessage);
    }

    console.log('[Lead Capture] Success:', responseData.contact?.id);

    return NextResponse.json({ 
      success: true, 
      contactId: responseData.contact?.id,
      message: 'Lead captured successfully'
    });

  } catch (error: any) {
    console.error('[Lead Capture] Error:', error);
    console.error('[Lead Capture] Error stack:', error.stack);
    
    // Provide helpful error messages
    return NextResponse.json(
      { 
        error: 'Failed to process lead',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Please try again or contact support if the issue persists.',
        details: process.env.NODE_ENV === 'development' ? {
          errorType: error.name,
          errorMessage: error.message
        } : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  const hasApiKey = !!process.env.VIBEREACH_API_KEY;
  const hasLocationId = !!process.env.VIBEREACH_LOCATION_ID;
  
  return NextResponse.json({
    status: 'ok',
    configured: hasApiKey && hasLocationId,
    environment: process.env.NODE_ENV,
    message: hasApiKey && hasLocationId 
      ? 'VibeReach integration is configured' 
      : 'Missing VibeReach credentials'
  });
}
