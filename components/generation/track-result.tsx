'use client';

import { useState } from 'react';
import { AudioPlayer } from '@/components/audio/audio-player';
import { Save, Share2, Trash2, CheckCircle } from 'lucide-react';

interface TrackResultProps {
  id: string;
  audioUrl: string;
  title: string;
  tags?: string;
  duration?: number;
  createdAt?: string;
  onRegenerate?: () => void;
  onSave?: (trackId: string, projectName: string) => Promise<void>;
  onDelete?: (trackId: string) => Promise<void>;
}

export function TrackResult({
  id,
  audioUrl,
  title,
  tags,
  duration,
  createdAt,
  onRegenerate,
  onSave,
  onDelete,
}: TrackResultProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleSave = async () => {
    if (!onSave || !projectName.trim()) return;

    setIsSaving(true);
    try {
      await onSave(id, projectName.trim());
      setIsSaved(true);
      setShowSaveModal(false);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save track. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/track/${id}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      return;
    }

    try {
      await onDelete(id);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete track. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Audio Player */}
      <AudioPlayer
        audioUrl={audioUrl}
        title={title}
        duration={duration}
        onRegenerate={onRegenerate}
      />

      {/* Track Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            {tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Saved
            </div>
          )}
        </div>

        {createdAt && (
          <p className="text-sm text-gray-500">
            Generated {new Date(createdAt).toLocaleString()}
          </p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {onSave && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Save size={16} />
              Save
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Share2 size={16} />
            Share
          </button>

          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Save to Project</h3>
            
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !projectName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Track</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyShareUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Anyone with this link can listen to your track.
            </p>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
