'use client';

import { useState } from 'react';
import { ArrowRight, X, Loader2, Clock } from 'lucide-react';
import { CREDIT_COSTS } from '@/types/suno-extended';

interface ExtendMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  audioId: string;
  trackTitle: string;
  currentDuration: number; // in seconds
  onExtensionStarted: (taskId: string) => void;
}

export function ExtendMusicModal({
  isOpen,
  onClose,
  trackId,
  audioId,
  trackTitle,
  currentDuration,
  onExtensionStarted,
}: ExtendMusicModalProps) {
  const [continueAt, setContinueAt] = useState(currentDuration);
  const [prompt, setPrompt] = useState('Continue the music');
  const [isExtending, setIsExtending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtend = async () => {
    setIsExtending(true);
    setError(null);

    try {
      const response = await fetch('/api/music/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioId,
          continueAt,
          prompt,
          title: `${trackTitle} (Extended)`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start extension');
      }

      const { taskId } = await response.json();
      onExtensionStarted(taskId);
      onClose();
    } catch (err) {
      console.error('Extension error:', err);
      setError(err instanceof Error ? err.message : 'Failed to extend music');
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Extend Music
              </h2>
              <p className="text-sm text-gray-600">
                Continue &quot;{trackTitle}&quot; • {CREDIT_COSTS.EXTEND_MUSIC} credits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExtending}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Timestamp Picker */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Continue from (seconds)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={currentDuration}
                step={1}
                value={continueAt}
                onChange={(e) => setContinueAt(Number(e.target.value))}
                className="flex-1"
                disabled={isExtending}
              />
              <div className="flex items-center gap-2 text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-gray-900">{formatTime(continueAt)}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{formatTime(currentDuration)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The AI will continue the music from this point forward
            </p>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extension instructions (optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Add more energy, Include a guitar solo, Build to a climax..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isExtending}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              💡 Extension Tips
            </h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Only {CREDIT_COSTS.EXTEND_MUSIC} credits vs {CREDIT_COSTS.FULL_SONG} for new song (40% savings!)</li>
              <li>• AI maintains the style and coherence of the original</li>
              <li>• Perfect for making 30-second clips into full songs</li>
              <li>• You can extend multiple times to build longer tracks</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExtending}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExtend}
            disabled={isExtending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExtending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Extend Music ({CREDIT_COSTS.EXTEND_MUSIC} credits)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
