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

    console.log(`[Generate MIDI] Starting for track: ${id}`);

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

    // Check if MIDI already exists
    if (track.midiUrl && !request.nextUrl.searchParams.get('regenerate')) {
      return NextResponse.json({
        success: true,
        midiUrl: track.midiUrl,
        cached: true
      });
    }

    // Call Python MIDI service on Render
    console.log(`[Generate MIDI] Calling Python service: ${MIDI_SERVICE_URL}`);
    console.log(`[Generate MIDI] Request body:`, { audioUrl: track.audioUrl, trackId: id });
    
    const midiResponse = await fetch(`${MIDI_SERVICE_URL}/generate-midi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioUrl: track.audioUrl,
        trackId: id
      }),
      signal: AbortSignal.timeout(120000) // 2 minute timeout
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

    // Save MIDI to public directory
    const fs = await import('fs/promises');
    const path = await import('path');
    const publicMidiDir = path.join(process.cwd(), 'public', 'midi');
    
    await fs.mkdir(publicMidiDir, { recursive: true });
    const midiFilename = `${id}.mid`;
    const midiPath = path.join(publicMidiDir, midiFilename);
    
    await fs.writeFile(midiPath, Buffer.from(midiBuffer));

    const midiUrl = `/midi/${midiFilename}`;

    // Update track in database
    await db.collection(COLLECTIONS.TRACKS).updateOne(
      { id },
      {
        $set: {
          midiUrl,
          midiStatus: 'completed',
          midiGeneratedAt: new Date(),
          midiSize,
          updatedAt: new Date()
        }
      }
    );

    console.log(`[Generate MIDI] Success! MIDI saved to: ${midiUrl}`);

    return NextResponse.json({
      success: true,
      midiUrl,
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
