'use client';

import { Music, FileText, Scissors, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useState, useEffect } from 'react';

const typeIcons = {
  generation: Music,
  lyrics: FileText,
  stem_separation: Scissors,
};

const typeLabels = {
  generation: 'Music Generation',
  lyrics: 'Lyrics Generation',
  stem_separation: 'Stem Separation',
};

const typeColors = {
  generation: 'text-blue-600 bg-blue-100',
  lyrics: 'text-purple-600 bg-purple-100',
  stem_separation: 'text-green-600 bg-green-100',
};

interface HistoryEntry {
  _id: string;
  creditsUsed: number;
  type: string;
  description: string;
  createdAt: string;
  metadata?: any;
}

export function UsageHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Fetch history from MongoDB
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/credits/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClear = async () => {
    // TODO: Implement clear history API endpoint
    setHistory([]);
    setShowConfirm(false);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No usage history yet
        </h3>
        <p className="text-gray-600">
          Your credit usage will appear here after you generate music.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Usage History ({history.length})
        </h3>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Clear History
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to clear all usage history? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear History
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2">
        {history.map((entry) => {
          const Icon = typeIcons[entry.type as keyof typeof typeIcons] || Music;
          const label = typeLabels[entry.type as keyof typeof typeLabels] || entry.type;
          const colorClass = typeColors[entry.type as keyof typeof typeColors] || 'text-gray-600 bg-gray-100';

          return (
            <div
              key={entry._id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {label}
                </p>
                <p className="text-xs text-gray-500">
                  {entry.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {entry.creditsUsed} credits
                </span>
                <p className="text-xs text-gray-500">
                  {formatDate(new Date(entry.createdAt))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
