# VibeReach Lead Capture Form Implementation

## Overview
This guide provides the complete implementation for a lead capture form on the AI Music Studio landing page. The form collects the user's name and email to offer the "Top 50 AI Music Prompts" PDF lead magnet, and automatically pushes this data to VibeReach (which is built on the GoHighLevel/LeadConnector API architecture).

## Architecture
1. **Frontend Component**: A React/Next.js form component (`LeadCaptureForm.tsx`)
2. **Backend API Route**: A Next.js API route (`/api/leads/route.ts`) that securely handles the API keys and communicates with VibeReach
3. **VibeReach Integration**: Uses the standard GoHighLevel API v2 endpoint for contact creation

## Phase 1: Create the Backend API Route

Create a new file at `app/api/leads/route.ts` to securely handle the VibeReach API communication.

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // VibeReach uses the GoHighLevel/LeadConnector API architecture
    // API v2 Endpoint: https://services.leadconnectorhq.com/contacts/
    
    const VIBEREACH_API_KEY = process.env.VIBEREACH_API_KEY;
    const VIBEREACH_LOCATION_ID = process.env.VIBEREACH_LOCATION_ID;

    if (!VIBEREACH_API_KEY || !VIBEREACH_LOCATION_ID) {
      console.error('Missing VibeReach API credentials');
      // In development, we might want to just simulate success if keys aren't set
      if (process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Simulating successful lead capture for:', email);
        return NextResponse.json({ success: true, simulated: true });
      }
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Format the payload according to GHL API v2 specs
    const payload = {
      firstName: firstName || '',
      lastName: lastName || '',
      name: `${firstName || ''} ${lastName || ''}`.trim(),
      email: email,
      phone: phone || '',
      locationId: VIBEREACH_LOCATION_ID,
      tags: ['ai-music-studio-lead', 'lead-magnet-prompts'],
      source: 'Landing Page Form',
      customFields: [
        {
          id: 'lead_magnet_requested',
          value: 'Top 50 AI Music Prompts'
        }
      ]
    };

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('VibeReach API Error:', errorData);
      throw new Error('Failed to create contact in VibeReach');
    }

    const data = await response.json();

    return NextResponse.json({ 
      success: true, 
      contactId: data.contact?.id 
    });

  } catch (error: any) {
    console.error('[Lead Capture] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}
```

## Phase 2: Create the Frontend Form Component

Create a new file at `components/marketing/LeadCaptureForm.tsx`.

```tsx
// components/marketing/LeadCaptureForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeadCaptureForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSuccess(true);
      
      // Optional: Redirect to a thank you page or directly to pricing/signup
      // setTimeout(() => router.push('/signup'), 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">You're in!</h3>
        <p className="text-green-700 mb-6">
          Check your email for the Top 50 AI Music Prompts PDF.
        </p>
        <button 
          onClick={() => router.push('/signup')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Start Your Free Trial Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get the Top 50 AI Music Prompts</h3>
        <p className="text-gray-600">
          Enter your email to get our exclusive PDF guide and learn how to generate studio-quality tracks.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Send Me The Prompts'
          )}
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
```

## Phase 3: Environment Variables Setup

Add these to your `.env.local` file:

```env
# VibeReach (GoHighLevel) API Integration
VIBEREACH_API_KEY=your_v2_api_key_here
VIBEREACH_LOCATION_ID=your_location_id_here
```

## Windsurf Prompt

Copy and paste this into Windsurf to implement the feature:

```
I need to add a lead capture form to my landing page that integrates with VibeReach (which uses the GoHighLevel API v2).

Please implement the following:
1. Create a new API route at `app/api/leads/route.ts` that accepts POST requests with firstName and email. It should call the GoHighLevel API (`https://services.leadconnectorhq.com/contacts/`) using Bearer token auth, passing the VIBEREACH_LOCATION_ID, and adding the tags ['ai-music-studio-lead', 'lead-magnet-prompts'].
2. Create a new React component at `components/marketing/LeadCaptureForm.tsx` that has a nice, modern UI with inputs for First Name and Email. It should have loading states, error handling, and a success state that encourages them to start a free trial.
3. Add instructions in the README on how to get the VIBEREACH_API_KEY and VIBEREACH_LOCATION_ID.
```
