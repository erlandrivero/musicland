import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[Download API] ========== NEW DOWNLOAD REQUEST ==========');
    
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      console.log('[Download API] ❌ No session found');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to download tracks' },
        { status: 401 }
      );
    }

    console.log('[Download API] ✅ User authenticated:', session.user.email);
    
    const { id } = params;
    console.log('[Download API] Requested track ID:', id);

    // Fetch track from MongoDB - query by email OR userId for compatibility
    const db = await getDatabase();
    const track = await db.collection(COLLECTIONS.TRACKS).findOne({
      id,
      $or: [
        { userEmail: session.user.email },
        { userId: session.user.id }
      ]
    });

    if (!track) {
      console.log('[Download API] ❌ Track not found for ID:', id);
      console.log('[Download API] User email:', session.user.email);
      console.log('[Download API] User ID:', session.user.id);
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Track not found' },
        { status: 404 }
      );
    }

    console.log('[Download API] ✅ Track found:', track.title);
    console.log('[Download API] Track userEmail:', track.userEmail);
    console.log('[Download API] Track userId:', track.userId);
    console.log('[Download API] Track status:', track.status);
    console.log('[Download API] Has audioUrl:', !!track.audioUrl);

    // Verify ownership
    if (track.userEmail !== session.user.email && track.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'You do not have access to this track' },
        { status: 403 }
      );
    }

    if (track.status !== 'completed') {
      return NextResponse.json(
        { error: 'NOT_READY', message: 'Track is not ready for download yet' },
        { status: 400 }
      );
    }

    if (!track.audioUrl) {
      return NextResponse.json(
        { error: 'NO_AUDIO', message: 'No audio file available for this track' },
        { status: 404 }
      );
    }

    // Get download type from query params (audio or video)
    // Frontend sends 'format' param (mp3-high, wav, flac, etc.)
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'mp3-high';
    const type = searchParams.get('type') || 'audio';

    console.log('[Download API] Track ID:', id);
    console.log('[Download API] Format:', format);
    console.log('[Download API] Type:', type);
    console.log('[Download API] Has audioUrl:', !!track.audioUrl);
    console.log('[Download API] Has videoUrl:', !!track.videoUrl);

    const downloadUrl = type === 'video' && track.videoUrl ? track.videoUrl : track.audioUrl;

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'NO_FILE', message: `No ${type} file available for this track` },
        { status: 404 }
      );
    }

    // Proxy the file download to bypass CORS issues
    console.log('[Download API] ✅ Proxying download for:', track.title);
    console.log('[Download API] Fetching from:', downloadUrl);
    
    try {
      const audioResponse = await fetch(downloadUrl);
      
      if (!audioResponse.ok) {
        console.log('[Download API] ❌ Failed to fetch audio:', audioResponse.status);
        return NextResponse.json(
          { error: 'FETCH_ERROR', message: 'Failed to fetch audio file from CDN' },
          { status: 500 }
        );
      }

      const audioBlob = await audioResponse.blob();
      console.log('[Download API] ✅ Audio fetched, size:', audioBlob.size, 'bytes');
      
      // Determine file extension from format
      const extension = format.split('-')[0] || 'mp3';
      const filename = `${track.title || 'track'}.${extension}`;
      
      console.log('[Download API] ✅ Sending file:', filename);
      console.log('[Download API] ========== REQUEST COMPLETE ==========');
      
      // Return the audio file directly
      return new NextResponse(audioBlob, {
        status: 200,
        headers: {
          'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': audioBlob.size.toString(),
        },
      });
    } catch (fetchError: any) {
      console.error('[Download API] ❌ Error fetching audio:', fetchError);
      return NextResponse.json(
        { error: 'PROXY_ERROR', message: 'Failed to proxy audio file' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('[API] Download error:', error);
    return NextResponse.json(
      {
        error: 'DOWNLOAD_ERROR',
        message: 'Failed to prepare download',
      },
      { status: 500 }
    );
  }
}
