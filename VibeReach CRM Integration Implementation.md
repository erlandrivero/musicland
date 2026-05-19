# VibeReach CRM Integration Implementation

I need to connect our AI Music Studio Next.js app to our VibeReach CRM (GoHighLevel API v2) so that key user events automatically trigger our marketing workflows.

Please implement the following changes to connect the 4 key funnel events:

## 1. Create the VibeReach Helper Library
Create a new file at `lib/vibereach.ts` with the following code:

```typescript
import { User } from '@/lib/types/database';

const VIBEREACH_API_KEY = process.env.VIBEREACH_API_KEY;
const VIBEREACH_LOCATION_ID = process.env.VIBEREACH_LOCATION_ID;
const API_BASE_URL = 'https://services.leadconnectorhq.com';

const headers = {
  'Authorization': `Bearer ${VIBEREACH_API_KEY}`,
  'Version': '2021-07-28',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Creates or updates a contact in VibeReach
 */
export async function createOrUpdateContact(userData: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
}) {
  if (!VIBEREACH_API_KEY || !VIBEREACH_LOCATION_ID) {
    console.warn('[VibeReach] Missing API credentials, skipping contact creation');
    return null;
  }

  try {
    const payload = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      email: userData.email,
      phone: userData.phone || '',
      locationId: VIBEREACH_LOCATION_ID,
      tags: userData.tags || [],
      source: userData.source || 'AI Music Studio App',
    };

    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[VibeReach] API Error creating contact:', errorData);
      throw new Error('Failed to create contact in VibeReach');
    }

    const data = await response.json();
    return data.contact;
  } catch (error) {
    console.error('[VibeReach] Error in createOrUpdateContact:', error);
    return null;
  }
}

/**
 * Adds tags to an existing contact by ID
 */
export async function addTagsToContact(contactId: string, tags: string[]) {
  if (!VIBEREACH_API_KEY || !contactId || !tags.length) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tags })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[VibeReach] API Error adding tags:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[VibeReach] Error in addTagsToContact:', error);
    return false;
  }
}

/**
 * Looks up a contact by email
 */
export async function getContactByEmail(email: string) {
  if (!VIBEREACH_API_KEY || !VIBEREACH_LOCATION_ID) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/contacts/search/duplicate?locationId=${VIBEREACH_LOCATION_ID}&email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.contact || null;
  } catch (error) {
    console.error('[VibeReach] Error in getContactByEmail:', error);
    return null;
  }
}

/**
 * Adds a tag to a contact by email (looks up contact first)
 */
export async function addTagByEmail(email: string, tag: string) {
  try {
    // First try to find the contact
    const contact = await getContactByEmail(email);
    
    if (contact && contact.id) {
      // If contact exists, add the tag
      return await addTagsToContact(contact.id, [tag]);
    } else {
      // If contact doesn't exist, create it with the tag
      const newContact = await createOrUpdateContact({
        email,
        tags: [tag]
      });
      return !!newContact;
    }
  } catch (error) {
    console.error('[VibeReach] Error in addTagByEmail:', error);
    return false;
  }
}

/**
 * Creates or updates an opportunity in a pipeline
 */
export async function updateOpportunity(contactId: string, pipelineId: string, stageId: string, title: string, value?: number) {
  if (!VIBEREACH_API_KEY || !VIBEREACH_LOCATION_ID) return null;

  try {
    const payload = {
      pipelineId,
      locationId: VIBEREACH_LOCATION_ID,
      name: title,
      pipelineStageId: stageId,
      status: 'open',
      contactId,
      monetaryValue: value || 0
    };

    const response = await fetch(`${API_BASE_URL}/opportunities/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[VibeReach] API Error updating opportunity:', errorData);
      return null;
    }

    const data = await response.json();
    return data.opportunity;
  } catch (error) {
    console.error('[VibeReach] Error in updateOpportunity:', error);
    return null;
  }
}
```

## 2. Update User Initialization (App Signup)
In `app/api/user/init/route.ts`, update the user creation block (around line 22) to also create a VibeReach contact:

```typescript
    // 3. If user doesn't exist, create them
    if (!user) {
      console.log('[User Init] Creating new user:', session.user.email);
      user = await createUser({
        email: session.user.email,
        name: session.user.name || 'User',
        image: session.user.image || undefined,
      });
      console.log('[User Init] ✅ User created successfully');
      
      // Create contact in VibeReach
      try {
        const { createOrUpdateContact } = await import('@/lib/vibereach');
        const nameParts = (session.user.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await createOrUpdateContact({
          email: session.user.email,
          firstName,
          lastName,
          tags: ['app-user'],
          source: 'App Signup'
        });
        console.log('[User Init] ✅ VibeReach contact created');
      } catch (vrError) {
        console.error('[User Init] Failed to create VibeReach contact:', vrError);
        // Don't fail the request if CRM sync fails
      }
    } else {
```

## 3. Update Music Generation (First Song Generated)
In `app/api/music/generate/route.ts`, update the credit logging block (around line 111) to add the `song-generated` tag:

```typescript
    // Log credit usage to MongoDB and update VibeReach
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
      
      // Add tag to VibeReach to stop the "getting started" email
      if (session.user.email) {
        const { addTagByEmail } = await import('@/lib/vibereach');
        await addTagByEmail(session.user.email, 'song-generated');
        console.log('[API] Added song-generated tag to VibeReach');
      }
    } catch (logError) {
      console.error('[API] Failed to log credit usage or update CRM:', logError);
      // Don't fail the request if logging fails
    }
```

## 4. Update Stripe Webhooks (Trial Start & Subscription Upgrade)
In `app/api/stripe/webhooks/route.ts`, update the `handleSubscriptionCreated` function (around line 148) to handle both trial starts and paid upgrades:

```typescript
    // Allocate credits for the new subscription (reset to plan amount, don't add to free credits)
    await allocateMonthlyCredits(user._id, plan, subscription.id, true);

    // Check if this is a trial
    const isTrial = subscription.status === 'trialing';

    // Update VibeReach CRM
    try {
      const { addTagByEmail, getContactByEmail, updateOpportunity } = await import('@/lib/vibereach');
      
      // Add appropriate tag based on trial status
      if (isTrial) {
        await addTagByEmail(user.email, 'trial-user');
      } else {
        await addTagByEmail(user.email, 'paying-subscriber');
        
        // Move to Won stage in pipeline only if not a trial
        const contact = await getContactByEmail(user.email);
        if (contact && contact.id) {
          const PIPELINE_ID = '9yVjn110Z9Llv19wqXsa'; // Client Acquisition Pipeline
          const WON_STAGE_ID = '825cd2b7-50fb-4b25-aec3-ad4c361aeb1f'; // Won Stage
          
          await updateOpportunity(
            contact.id, 
            PIPELINE_ID, 
            WON_STAGE_ID, 
            `Subscription: ${plan}`, 
            subscription.items.data[0]?.price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0
          );
        }
      }
      console.log('[Webhook] ✅ VibeReach CRM updated for new subscription');
    } catch (vrError) {
      console.error('[Webhook] Failed to update VibeReach CRM:', vrError);
    }

    console.log('[Webhook] ✅ Subscription created successfully for user:', user.email);
```

## 5. Create the Lead Capture API Route
Create a new file at `app/api/leads/route.ts` to handle the landing page form submissions:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateContact } from '@/lib/vibereach';

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

    // Use the shared VibeReach helper to create the contact
    const contact = await createOrUpdateContact({
      email,
      firstName,
      lastName,
      phone,
      tags: ['ai-music-studio-lead', 'lead-magnet-prompts'],
      source: 'Landing Page Form'
    });

    if (!contact) {
      // In development, we might want to just simulate success if keys aren't set
      if (process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Simulating successful lead capture for:', email);
        return NextResponse.json({ success: true, simulated: true });
      }
      throw new Error('Failed to create contact in VibeReach');
    }

    return NextResponse.json({ 
      success: true, 
      contactId: contact.id 
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

## 6. Environment Variables
Make sure to add these to your `.env.local` and Netlify environment variables:
```env
VIBEREACH_API_KEY=pit-1dc64785-f11e-4d78-a5ac-2df940418c3b
VIBEREACH_LOCATION_ID=NtsbcQeGI55RfjPaLbtk
```
