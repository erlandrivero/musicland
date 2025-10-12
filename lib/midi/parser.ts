/**
 * MIDI Parser for VexFlow Integration
 * Converts MIDI files to VexFlow notation
 */

import { Midi } from '@tonejs/midi';

export interface VexFlowNote {
  keys: string[];
  duration: string;
}

export interface ParsedMIDI {
  notes: VexFlowNote[][];
  tempo: number;
  timeSignature: {
    numerator: number;
    denominator: number;
  };
  keySignature: string;
}

/**
 * Convert MIDI note number to VexFlow notation
 * MIDI: 60 = C4, 61 = C#4, etc.
 */
function midiNoteToVexFlow(midiNote: number): string {
  const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[midiNote % 12];
  return `${noteName}/${octave}`;
}

/**
 * Convert MIDI duration (in ticks) to VexFlow duration
 */
function ticksToVexFlowDuration(ticks: number, ticksPerBeat: number): string {
  const beats = ticks / ticksPerBeat;
  
  if (beats >= 4) return 'w';      // Whole note
  if (beats >= 2) return 'h';      // Half note
  if (beats >= 1) return 'q';      // Quarter note
  if (beats >= 0.5) return '8';    // Eighth note
  if (beats >= 0.25) return '16';  // Sixteenth note
  
  return 'q'; // Default to quarter note
}

/**
 * Parse MIDI file and convert to VexFlow notation
 */
export async function parseMIDIFile(midiUrl: string): Promise<ParsedMIDI> {
  try {
    // Fetch MIDI file
    const response = await fetch(midiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch MIDI: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    
    console.log('[MIDI Parser] Loaded MIDI:', {
      name: midi.name,
      duration: midi.duration,
      tracks: midi.tracks.length,
      tempo: midi.header.tempos[0]?.bpm || 120
    });
    
    // Get first track with notes (usually melody)
    const track = midi.tracks.find(t => t.notes.length > 0);
    
    if (!track || track.notes.length === 0) {
      throw new Error('No notes found in MIDI file');
    }
    
    const ticksPerBeat = midi.header.ppq;
    const tempo = midi.header.tempos[0]?.bpm || 120;
    
    // Group notes into measures (4/4 time signature)
    const beatsPerMeasure = 4;
    const measures: VexFlowNote[][] = [];
    let currentMeasure: VexFlowNote[] = [];
    let currentBeat = 0;
    
    // Sort notes by time
    const sortedNotes = [...track.notes].sort((a, b) => a.time - b.time);
    
    // Take first 40 notes for initial display (10 measures x 4 beats)
    const notesToProcess = sortedNotes.slice(0, 40);
    
    for (const note of notesToProcess) {
      const vexNote = midiNoteToVexFlow(note.midi);
      const durationTicks = note.durationTicks;
      const vexDuration = ticksToVexFlowDuration(durationTicks, ticksPerBeat);
      
      currentMeasure.push({
        keys: [vexNote],
        duration: vexDuration
      });
      
      // Move to next measure after 4 beats
      currentBeat += (durationTicks / ticksPerBeat);
      
      if (currentBeat >= beatsPerMeasure) {
        measures.push([...currentMeasure]);
        currentMeasure = [];
        currentBeat = 0;
      }
    }
    
    // Add remaining notes as last measure
    if (currentMeasure.length > 0) {
      measures.push(currentMeasure);
    }
    
    // Ensure we have at least 10 measures (pad with rests if needed)
    while (measures.length < 10) {
      measures.push([
        { keys: ['b/4'], duration: 'wr' } // Whole rest
      ]);
    }
    
    console.log('[MIDI Parser] Parsed measures:', measures.length);
    
    return {
      notes: measures,
      tempo,
      timeSignature: {
        numerator: 4,
        denominator: 4
      },
      keySignature: 'C' // Default, can be enhanced
    };
    
  } catch (error) {
    console.error('[MIDI Parser] Error:', error);
    throw error;
  }
}

/**
 * Generate demo notes (fallback if MIDI parsing fails)
 */
export function generateDemoNotes(): VexFlowNote[][] {
  return [
    // Measure 1: C major scale ascending
    [
      { keys: ['c/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' }
    ],
    // Measure 2: Continue ascending
    [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['b/4'], duration: 'q' },
      { keys: ['c/5'], duration: 'q' }
    ],
    // Measure 3: Descending
    [
      { keys: ['c/5'], duration: 'q' },
      { keys: ['b/4'], duration: 'q' },
      { keys: ['a/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' }
    ],
    // Measure 4: Continue descending
    [
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' },
      { keys: ['c/4'], duration: 'q' }
    ],
    // Measure 5: Half notes
    [
      { keys: ['e/4'], duration: 'h' },
      { keys: ['g/4'], duration: 'h' }
    ],
    // Measure 6: Chord
    [
      { keys: ['c/4', 'e/4', 'g/4'], duration: 'w' }
    ],
    // Measure 7: Quarter notes
    [
      { keys: ['g/4'], duration: 'q' },
      { keys: ['f/4'], duration: 'q' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['d/4'], duration: 'q' }
    ],
    // Measure 8: Mixed
    [
      { keys: ['c/4'], duration: 'h' },
      { keys: ['e/4'], duration: 'q' },
      { keys: ['g/4'], duration: 'q' }
    ],
    // Measure 9: Chord
    [
      { keys: ['d/4', 'f/4', 'a/4'], duration: 'w' }
    ],
    // Measure 10: Final
    [
      { keys: ['c/4', 'e/4', 'g/4'], duration: 'w' }
    ]
  ];
}
