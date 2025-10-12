import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, createUser } from '@/lib/db/users';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // 2. Check if user exists in database
    console.log('[User Init] Session image URL:', session.user.image);
    let user = await getUserByEmail(session.user.email);
    
    // 3. If user doesn't exist, create them
    if (!user) {
      console.log('[User Init] Creating new user:', session.user.email);
      user = await createUser({
        email: session.user.email,
        name: session.user.name || 'User',
        image: session.user.image || undefined,
      });
      console.log('[User Init] ✅ User created successfully');
    } else {
      // Update user's image if it changed (Google profile updates)
      // Only update if session has a valid external image URL
      const sessionImage = session.user.image;
      const isValidExternalUrl = sessionImage && (sessionImage.startsWith('https://') || sessionImage.startsWith('http://'));
      
      if (isValidExternalUrl && user.image !== sessionImage) {
        const db = await import('@/lib/mongodb').then(m => m.getDatabase());
        const COLLECTIONS = await import('@/lib/mongodb').then(m => m.COLLECTIONS);
        
        await (await db).collection(COLLECTIONS.USERS).updateOne(
          { email: user.email },
          { 
            $set: { 
              image: sessionImage,
              updatedAt: new Date()
            } 
          }
        );
        user.image = sessionImage;
        console.log('[User Init] ✅ Updated user profile image');
      }
    }

    // 4. Return user data
    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
      },
    });

  } catch (error: any) {
    console.error('[User Init] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize user',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
