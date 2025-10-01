import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/tracks/:id/play - Increment play count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Update play count
    const track = await db.track.update({
      where: { id },
      data: {
        playCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        playCount: true,
      },
    });

    return NextResponse.json(track, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to update play count:', error);
    return NextResponse.json(
      {
        error: 'UPDATE_ERROR',
        message: 'Failed to update play count',
      },
      { status: 500 }
    );
  }
}
