/**
 * MIDI File Analyzer
 * Analyzes MIDI file structure and content
 */

const fs = require('fs');
const { Midi } = require('@tonejs/midi');

// Read MIDI file
const midiPath = process.argv[2] || './Baila Sin Parar.mid';

console.log('🎵 MIDI File Analysis\n');
console.log('━'.repeat(60));
console.log(`File: ${midiPath}\n`);

try {
  const midiBuffer = fs.readFileSync(midiPath);
  const midi = new Midi(midiBuffer);
  
  // Basic Info
  console.log('📊 BASIC INFORMATION');
  console.log('━'.repeat(60));
  console.log(`Name:            ${midi.name || 'Untitled'}`);
  console.log(`Duration:        ${midi.duration.toFixed(2)} seconds (${Math.floor(midi.duration / 60)}:${Math.floor(midi.duration % 60).toString().padStart(2, '0')})`);
  console.log(`File Size:       ${(midiBuffer.length / 1024).toFixed(2)} KB`);
  console.log(`Format:          Type ${midi.header.format || 1}`);
  console.log();
  
  // Timing Info
  console.log('⏱️  TIMING INFORMATION');
  console.log('━'.repeat(60));
  console.log(`PPQ (Ticks):     ${midi.header.ppq}`);
  
  if (midi.header.tempos && midi.header.tempos.length > 0) {
    console.log(`Tempo:           ${midi.header.tempos[0].bpm.toFixed(1)} BPM`);
    if (midi.header.tempos.length > 1) {
      console.log(`Tempo Changes:   ${midi.header.tempos.length}`);
    }
  } else {
    console.log(`Tempo:           120 BPM (default)`);
  }
  
  if (midi.header.timeSignatures && midi.header.timeSignatures.length > 0) {
    const ts = midi.header.timeSignatures[0];
    console.log(`Time Signature:  ${ts.timeSignature[0]}/${ts.timeSignature[1]}`);
  } else {
    console.log(`Time Signature:  4/4 (default)`);
  }
  
  if (midi.header.keySignatures && midi.header.keySignatures.length > 0) {
    const ks = midi.header.keySignatures[0];
    console.log(`Key Signature:   ${ks.key} ${ks.scale}`);
  }
  console.log();
  
  // Track Info
  console.log('🎼 TRACK INFORMATION');
  console.log('━'.repeat(60));
  console.log(`Total Tracks:    ${midi.tracks.length}`);
  console.log();
  
  let totalNotes = 0;
  let minPitch = 127;
  let maxPitch = 0;
  
  midi.tracks.forEach((track, index) => {
    if (track.notes.length > 0) {
      console.log(`Track ${index + 1}:`);
      console.log(`  Name:          ${track.name || 'Unnamed'}`);
      console.log(`  Instrument:    ${track.instrument?.name || track.instrument?.number || 'Unknown'}`);
      console.log(`  Notes:         ${track.notes.length}`);
      console.log(`  Channel:       ${track.channel !== undefined ? track.channel : 'N/A'}`);
      
      // Analyze notes
      const pitches = track.notes.map(n => n.midi);
      const trackMin = Math.min(...pitches);
      const trackMax = Math.max(...pitches);
      
      console.log(`  Pitch Range:   ${trackMin} - ${trackMax} (${getNoteNameFromMidi(trackMin)} - ${getNoteNameFromMidi(trackMax)})`);
      
      // Calculate average note duration
      const avgDuration = track.notes.reduce((sum, n) => sum + n.duration, 0) / track.notes.length;
      console.log(`  Avg Duration:  ${avgDuration.toFixed(3)}s`);
      
      // Check for very short notes (ghost notes)
      const shortNotes = track.notes.filter(n => n.duration < 0.05).length;
      if (shortNotes > 0) {
        console.log(`  ⚠️  Short Notes:  ${shortNotes} (< 50ms)`);
      }
      
      console.log();
      
      totalNotes += track.notes.length;
      minPitch = Math.min(minPitch, trackMin);
      maxPitch = Math.max(maxPitch, trackMax);
    }
  });
  
  // Overall Statistics
  console.log('📈 OVERALL STATISTICS');
  console.log('━'.repeat(60));
  console.log(`Total Notes:     ${totalNotes}`);
  console.log(`Full Range:      ${minPitch} - ${maxPitch} (${getNoteNameFromMidi(minPitch)} - ${getNoteNameFromMidi(maxPitch)})`);
  console.log(`Note Density:    ${(totalNotes / midi.duration).toFixed(2)} notes/second`);
  console.log();
  
  // Quality Assessment
  console.log('✅ QUALITY ASSESSMENT');
  console.log('━'.repeat(60));
  
  // Check for empty tracks
  const emptyTracks = midi.tracks.filter(t => t.notes.length === 0).length;
  if (emptyTracks > 0) {
    console.log(`⚠️  Empty Tracks:   ${emptyTracks}`);
  } else {
    console.log(`✓  No empty tracks`);
  }
  
  // Check note density
  const density = totalNotes / midi.duration;
  if (density < 2) {
    console.log(`⚠️  Low density:    ${density.toFixed(2)} notes/sec (might be incomplete)`);
  } else if (density > 20) {
    console.log(`⚠️  High density:   ${density.toFixed(2)} notes/sec (might have noise)`);
  } else {
    console.log(`✓  Good density:   ${density.toFixed(2)} notes/sec`);
  }
  
  // Check for very short notes across all tracks
  const allNotes = midi.tracks.flatMap(t => t.notes);
  const ghostNotes = allNotes.filter(n => n.duration < 0.05).length;
  const ghostPercent = (ghostNotes / totalNotes * 100).toFixed(1);
  
  if (ghostNotes > totalNotes * 0.1) {
    console.log(`⚠️  Ghost notes:    ${ghostNotes} (${ghostPercent}% of total)`);
  } else {
    console.log(`✓  Few ghost notes: ${ghostNotes} (${ghostPercent}%)`);
  }
  
  // Check pitch range
  const pitchSpan = maxPitch - minPitch;
  if (pitchSpan < 12) {
    console.log(`⚠️  Narrow range:   ${pitchSpan} semitones (limited melody)`);
  } else if (pitchSpan > 60) {
    console.log(`⚠️  Wide range:     ${pitchSpan} semitones (might have octave errors)`);
  } else {
    console.log(`✓  Good range:     ${pitchSpan} semitones`);
  }
  
  console.log();
  console.log('━'.repeat(60));
  console.log('✅ Analysis complete!\n');
  
} catch (error) {
  console.error('❌ Error analyzing MIDI file:', error.message);
  process.exit(1);
}

// Helper function to convert MIDI number to note name
function getNoteNameFromMidi(midi) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = noteNames[midi % 12];
  return `${noteName}${octave}`;
}
