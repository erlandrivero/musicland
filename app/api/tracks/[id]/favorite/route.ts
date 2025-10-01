import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// POST /api/tracks/:id/favorite - Toggle favorite status
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
    const body = await request.json();
    const { isFavorite } = body;

    // Update favorite status
    const track = await db.track.update({
      where: { id },
      data: {
        isFavorite: isFavorite,
      },
      select: {
        id: true,
        isFavorite: true,
      },
    });

    return NextResponse.json(track, { status: 200 });
  } catch (error: any) {
    console.error('[API] Failed to update favorite status:', error);
    return NextResponse.json(
      {
        error: 'UPDATE_ERROR',
        message: 'Failed to update favorite status',
      },
      { status: 500 }
    );
  }
}
