# Windsurf Implementation Guide: Remove Suno Token Verification

## Overview
The goal is to remove all direct SunoAPI token verification and credit fetching from the frontend and dashboard, relying entirely on the in-app MongoDB subscription and credit system. The app currently fetches credits directly from SunoAPI (`/api/credits/route.ts`) and validates the API key (`/api/test-connection/route.ts`, `/api/auth/validate-api/route.ts`). We need to switch this to use the local database credits.

## Phase 1: Update Credit API Route
Update `/app/api/credits/route.ts` to fetch credits from the local MongoDB database instead of SunoAPI.

```typescript
// /app/api/credits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail } from '@/lib/db/users';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to check credits' },
        { status: 401 }
      );
    }

    // Fetch user from local database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found in database' },
        { status: 404 }
      );
    }

    // Return local database credits
    const response = {
      credits: user.credits || 0,
      totalCredits: (user.credits || 0) + (user.creditsUsed || 0),
      creditsUsed: user.creditsUsed || 0,
      extraCredits: 0,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('[API] Credits fetch error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
```

## Phase 2: Update Generation API to Deduct Local Credits
Update `/app/api/music/generate/route.ts` to deduct credits from the local database before calling SunoAPI.

**Instructions for Windsurf:**
1. Open `/app/api/music/generate/route.ts`
2. Add imports for `getUserByEmail` and `deductCredits` from `@/lib/db/users`
3. Before calling `sunoAPI.generate()`, check if the user has enough local credits
4. If successful, deduct the credits using `deductCredits(user._id, GENERATION_COST)`
5. Remove any code that checks SunoAPI credits directly

## Phase 3: Remove SunoAPI Validation Routes
Delete or disable the routes that expose SunoAPI key validation to the frontend.

**Instructions for Windsurf:**
1. Delete the file `/app/api/auth/validate-api/route.ts`
2. Update `/app/api/test-connection/route.ts` to only test database and environment variables, removing the `sunoAPI.validateAPIKey()` and `sunoAPI.getCredits()` calls.

## Phase 4: Update Frontend Components
Remove references to SunoAPI in the frontend UI.

**Instructions for Windsurf:**
1. Open `/components/credits/insufficient-credits-modal.tsx`
2. Change the "Purchase Credits" button link from `https://sunoapi.com/credits` to `/pricing` or `#pricing`
3. Update the text "Credits are managed through SunoAPI..." to "Upgrade your subscription plan to get more credits."
4. Open `/components/dashboard/page.tsx` and ensure it relies on the local user data for credits (it already does this mostly, but verify no SunoAPI calls remain).

## Phase 5: Update use-credits Hook
Update the `useCredits` hook to rely on the updated local API.

**Instructions for Windsurf:**
1. Open `/hooks/use-credits.ts`
2. The hook already calls `/api/credits`, which we updated in Phase 1.
3. Ensure the optimistic deduction logic aligns with the local database structure.
4. Remove any comments or logic specifically referencing SunoAPI limits.
