import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const MIDI_SERVICE_URL = process.env.MIDI_SERVICE_URL || 'http://localhost:5000';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get quality parameter from request body
    const body = await request.json().catch(() => ({}));
    const quality = body.quality || 'standard'; // default to standard

    console.log(`[Generate MIDI] Starting for track: ${id} (quality: ${quality})`);

    // Get track from database
    const db = await getDatabase();
    const track = await db.collection(COLLECTIONS.TRACKS).findOne({
      id,
      userEmail: session.user.email
    });

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    if (!track.audioUrl) {
      return NextResponse.json({ error: 'No audio URL found' }, { status: 400 });
    }

    // Check if MIDI already exists (skip cache if regenerating)
    if (track.midiUrl && !request.nextUrl.searchParams.get('regenerate')) {
      return NextResponse.json({
        success: true,
        midiUrl: track.midiUrl,
        cached: true
      });
    }

    // Call Python MIDI service on Render
    console.log(`[Generate MIDI] Calling Python service: ${MIDI_SERVICE_URL}`);
    console.log(`[Generate MIDI] Request body:`, { audioUrl: track.audioUrl, trackId: id, quality });
    
    const midiResponse = await fetch(`${MIDI_SERVICE_URL}/generate-midi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioUrl: track.audioUrl,
        trackId: id,
        quality: quality
      }),
      signal: AbortSignal.timeout(180000) // 3 minute timeout (for high quality)
    }).catch((fetchError) => {
      console.error('[Generate MIDI] Fetch failed:', fetchError);
      throw new Error(`MIDI service error: ${fetchError.message}`);
    });

    console.log(`[Generate MIDI] Response status: ${midiResponse.status}`);

    if (!midiResponse.ok) {
      const errorData = await midiResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[Generate MIDI] Error response:', errorData);
      throw new Error(`MIDI service error: ${errorData.error || midiResponse.statusText}`);
    }

    // Get MIDI binary data
    const midiBuffer = await midiResponse.arrayBuffer();
    const midiSize = parseInt(midiResponse.headers.get('X-MIDI-Size') || '0');

    console.log(`[Generate MIDI] Received MIDI: ${midiSize} bytes`);

    // Convert MIDI to base64 data URL for storage in database
    const midiBase64 = Buffer.from(midiBuffer).toString('base64');
    const midiDataUrl = `data:audio/midi;base64,${midiBase64}`;

    // Update track in database with data URL
    await db.collection(COLLECTIONS.TRACKS).updateOne(
      { id },
      {
        $set: {
          midiUrl: midiDataUrl,
          midiStatus: 'completed',
          midiGeneratedAt: new Date(),
          midiSize,
          updatedAt: new Date()
        }
      }
    );

    console.log(`[Generate MIDI] Success! MIDI stored as data URL (${midiSize} bytes)`);

    return NextResponse.json({
      success: true,
      midiUrl: midiDataUrl,
      midiSize
    });

  } catch (error: any) {
    console.error('[Generate MIDI] Error:', error);
    
    // Update status to failed
    try {
      const { id } = await params;
      const db = await getDatabase();
      await db.collection(COLLECTIONS.TRACKS).updateOne(
        { id },
        {
          $set: {
            midiStatus: 'failed',
            midiError: error.message,
            updatedAt: new Date()
          }
        }
      );
    } catch (updateError) {
      console.error('[Generate MIDI] Failed to update error status:', updateError);
    }

    return NextResponse.json(
      {
        error: 'MIDI generation failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const track = await db.collection(COLLECTIONS.TRACKS).findOne({
      id,
      userEmail: session.user.email
    }, {
      projection: {
        midiUrl: 1,
        midiStatus: 1,
        midiGeneratedAt: 1,
        midiSize: 1,
        midiError: 1
      }
    });

    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    return NextResponse.json({
      midiUrl: track.midiUrl || null,
      midiStatus: track.midiStatus || 'not_generated',
      midiGeneratedAt: track.midiGeneratedAt || null,
      midiSize: track.midiSize || null,
      midiError: track.midiError || null
    });

  } catch (error: any) {
    console.error('[Get MIDI Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get MIDI status' },
      { status: 500 }
    );
  }
}
