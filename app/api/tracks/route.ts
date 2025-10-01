import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/tracks - Get all tracks for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const tracks = await db.track.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        audioUrl: true,
        tags: true,
        duration: true,
        createdAt: true,
        status: true,
        isFavorite: true,
        playCount: true,
        downloadCount: true,
      },
    });

    return NextResponse.json(tracks, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to fetch tracks:', error);
    return NextResponse.json(
      {
        error: 'FETCH_ERROR',
        message: 'Failed to fetch tracks',
      },
      { status: 500 }
    );
  }
}
