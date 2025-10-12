'use client';

import { useState, useEffect } from 'react';
import { Download, Music, AlertCircle, Loader2, Play, Pause } from 'lucide-react';

interface MidiViewerProps {
  trackId: string;
  title?: string;
  audioUrl?: string;
}

interface MidiStatus {
  midiUrl: string | null;
  midiStatus: string;
  midiGeneratedAt: string | null;
  midiSize: number | null;
  midiError: string | null;
}

export function MidiViewer({ trackId, title, audioUrl }: MidiViewerProps) {
  const [midiStatus, setMidiStatus] = useState<MidiStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch MIDI status on mount
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchMidiStatus = async () => {
      try {
        const response = await fetch(`/api/tracks/${trackId}/generate-midi`, {
          signal: abortController.signal
        });
        if (response.ok) {
          const data = await response.json();
          setMidiStatus(data);
        }
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === 'AbortError') {
          console.log('[MIDI Viewer] Fetch aborted');
          return;
        }
        console.error('[MIDI Viewer] Error fetching status:', err);
      }
    };
    
    fetchMidiStatus();
    
    // Cleanup: abort fetch on unmount
    return () => {
      abortController.abort();
    };
  }, [trackId]);

  const handleGenerateMidi = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('[MIDI Viewer] Generating MIDI for track:', trackId);
      
      const response = await fetch(`/api/tracks/${trackId}/generate-midi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setMidiStatus(data);
        console.log('[MIDI Viewer] MIDI generated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'MIDI generation failed');
      }
    } catch (err: any) {
      console.error('[MIDI Viewer] Error:', err);
      setError(err.message || 'Failed to generate MIDI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMidi = () => {
    if (midiStatus?.midiUrl) {
      const link = document.createElement('a');
      link.href = midiStatus.midiUrl;
      link.download = `${title || trackId}.mid`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          MIDI File
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Generate and download MIDI file for this track
        </p>
      </div>

      {/* Status Display */}
      {midiStatus && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              midiStatus.midiStatus === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : midiStatus.midiStatus === 'failed'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {midiStatus.midiStatus?.toUpperCase() || 'NOT GENERATED'}
            </span>
          </div>

          {midiStatus.midiGeneratedAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(midiStatus.midiGeneratedAt)}
              </span>
            </div>
          )}

          {midiStatus.midiSize && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">File Size:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatFileSize(midiStatus.midiSize)}
              </span>
            </div>
          )}

          {midiStatus.midiError && (
            <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{midiStatus.midiError}</span>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
              Generation Failed
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {!midiStatus?.midiUrl ? (
          <button
            onClick={handleGenerateMidi}
            disabled={isGenerating || !audioUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating MIDI...</span>
              </>
            ) : (
              <>
                <Music className="w-5 h-5" />
                <span>Generate MIDI</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDownloadMidi}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download MIDI</span>
            </button>
            
            <button
              onClick={handleGenerateMidi}
              disabled={isGenerating}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <Music className="w-4 h-4" />
          About MIDI Files
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
          MIDI (Musical Instrument Digital Interface) files contain musical note data that can be played 
          by MIDI-compatible software and instruments. Generated MIDI files are transcribed from the audio 
          using AI and may not be 100% accurate.
        </p>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-200">Processing Audio</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                This may take 30-90 seconds. The MIDI file will be ready shortly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
