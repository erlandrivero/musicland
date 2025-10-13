'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, ZoomIn, ZoomOut, Printer, Music } from 'lucide-react';
import { parseMIDIFile, generateDemoNotes, type VexFlowNote } from '@/lib/midi/parser';

interface SheetMusicViewerProps {
  trackId: string;
  title?: string;
  audioUrl?: string;
}

export function SheetMusicViewer({ trackId, title, audioUrl }: SheetMusicViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasSheetMusic, setHasSheetMusic] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [midiUrl, setMidiUrl] = useState<string | null>(null);
  const [usedRealMIDI, setUsedRealMIDI] = useState(false);

  const generateBasicSheetMusic = async (notesData?: VexFlowNote[][]) => {
    if (!containerRef.current) {
      console.error('[SheetMusic] No container ref');
      return;
    }

    try {
      console.log('[SheetMusic] Starting generation...');
      
      // Clear previous content
      containerRef.current.innerHTML = '';

      // Dynamically import VexFlow to avoid SSR issues
      console.log('[SheetMusic] Importing VexFlow...');
      const VexFlowModule = await import('vexflow');
      console.log('[SheetMusic] VexFlow loaded:', VexFlowModule);
      
      // Use VexFlow 4.x API (official documentation pattern)
      const VF = VexFlowModule.Vex.Flow;
      console.log('[SheetMusic] VF:', VF);
      const { Renderer, Stave, StaveNote, Formatter } = VF;

      // Use provided notes or generate demo
      const allNotes = notesData || generateDemoNotes();
      
      // Calculate dynamic height based on number of measures
      const staveSpacing = 120;
      const startY = 100;
      const canvasHeight = startY + (allNotes.length * staveSpacing) + 100; // Extra padding at bottom
      
      // Create SVG renderer (dynamic size)
      const div = containerRef.current;
      console.log('[SheetMusic] Creating renderer...');
      const renderer = new Renderer(div, Renderer.Backends.SVG);
      renderer.resize(1000, canvasHeight);
      const context = renderer.getContext();
      
      // Add title at the top in musical style
      context.setFont('Times New Roman', 24, 'bold');
      context.fillText(title || 'Untitled', 30, 40);
      context.setFont('Times New Roman', 14, 'italic');
      const subtitle = 'AI-Generated Transcription';
      context.fillText(subtitle, 30, 60);
      
      context.setFont('Arial', 10);

      // Create multiple staves for a full page sheet music
      console.log('[SheetMusic] Creating staves...');
      
      const staveWidth = 950;
      
      // Create staves based on number of measures (all measures)
      const staves = [];
      for (let i = 0; i < allNotes.length; i++) {
        const stave = new Stave(20, startY + (i * staveSpacing), staveWidth);
        if (i === 0) {
          stave.addClef('treble').addTimeSignature('4/4');
        }
        stave.setContext(context).draw();
        staves.push(stave);
      }

      // Create StaveNote objects from parsed MIDI data
      console.log('[SheetMusic] Creating notes from data...');
      
      // Draw all measures
      console.log('[SheetMusic] Formatting and drawing...');
      staves.forEach((stave, index) => {
        if (allNotes[index]) {
          const measureNotes = allNotes[index].map(note => 
            new StaveNote({ keys: note.keys, duration: note.duration })
          );
          Formatter.FormatAndDraw(context, stave, measureNotes);
        }
      });

      console.log('[SheetMusic] ✅ Generation complete!');
      setHasSheetMusic(true);
    } catch (err: any) {
      console.error('[SheetMusic] ❌ Error generating:', err);
      console.error('[SheetMusic] Error stack:', err.stack);
      setError(`Failed to generate sheet music: ${err.message || 'Unknown error'}`);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setUsedRealMIDI(false);

    try {
      console.log('[SheetMusic] Attempting MIDI generation for track:', trackId);
      
      // Step 1: Call MIDI generation API
      const midiResponse = await fetch(`/api/tracks/${trackId}/generate-midi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (midiResponse.ok) {
        const midiData = await midiResponse.json();
        console.log('[SheetMusic] MIDI generation response:', midiData);

        if (midiData.midiUrl) {
          setMidiUrl(midiData.midiUrl);
          
          // Step 2: Parse MIDI file
          console.log('[SheetMusic] Parsing MIDI from:', midiData.midiUrl);
          const parsedMIDI = await parseMIDIFile(midiData.midiUrl);
          
          // Step 3: Generate sheet music from parsed MIDI
          console.log('[SheetMusic] ✅ Using REAL MIDI transcription!');
          setUsedRealMIDI(true);
          await generateBasicSheetMusic(parsedMIDI.notes);
          setIsGenerating(false);
          return;
        }
      } else {
        console.warn('[SheetMusic] MIDI generation failed:', await midiResponse.text());
      }
    } catch (err: any) {
      console.warn('[SheetMusic] MIDI error (falling back to demo):', err.message);
    }

    // Fallback: Generate demo sheet music
    console.log('[SheetMusic] Using demo notes (no MIDI available)');
    try {
      await generateBasicSheetMusic();
    } catch (err: any) {
      setError(err.message || 'Failed to generate sheet music');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // Open print dialog with only the sheet music
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Sheet Music - ${title || 'Music'}</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${svg.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPNG = () => {
    if (!containerRef.current) {
      console.error('No container ref');
      return;
    }

    const svg = containerRef.current.querySelector('svg');
    if (!svg) {
      console.error('No SVG found in container');
      console.log('Container contents:', containerRef.current.innerHTML.substring(0, 200));
      setError('Sheet music not found. Please generate it first.');
      return;
    }

    try {
      // Method 1: Download as SVG (most reliable)
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.download = `${title || 'sheet-music'}.svg`;
      link.href = url;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('Sheet music downloaded as SVG');
    } catch (err) {
      console.error('Failed to download sheet music:', err);
      setError('Failed to download. Please try the print option instead.');
    }
  };

  useEffect(() => {
    if (containerRef.current && !containerRef.current.id) {
      containerRef.current.id = `sheet-music-${trackId}`;
    }
  }, [trackId]);

  return (
    <div className={`relative flex flex-col ${!hasSheetMusic ? 'bg-gradient-to-br from-blue-50 to-purple-50 h-[320px]' : 'bg-white'}`}>
      {/* Generate prompt overlay */}
      {!hasSheetMusic && (
        <div className="flex flex-col items-center justify-center p-6 h-full">
          <div className="max-w-md text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Music className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Sheet Music
              </h3>
              <p className="text-gray-600">
                Convert this track into beautiful, readable musical notation
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                'Generate Sheet Music'
              )}
            </button>

            <p className="text-xs text-gray-500">
              This feature analyzes your audio and creates professional notation
            </p>
          </div>
        </div>
      )}

      {/* Sheet music view - always rendered */}
      <div className={`relative flex-1 overflow-auto bg-white p-6 ${!hasSheetMusic ? 'opacity-0 pointer-events-none absolute' : ''}`}>
        {/* Floating Controls - Top Right */}
        {hasSheetMusic && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-medium min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300" />

            {/* Export Controls */}
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPNG}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Download SVG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sheet Music Display - ref always here */}
        <div className="p-8">
          <div className="inline-block min-w-full">
            <div
              ref={containerRef}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              className="transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
