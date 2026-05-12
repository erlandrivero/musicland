'use client';

import { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp, Music, User, Clock } from 'lucide-react';
import { PromptCard } from './PromptCard';

interface HistoryEntry {
  _id: string;
  artist: string;
  song: string;
  artistAnalysis: string;
  songAnalysis: string;
  prompts: Array<{
    title: string;
    prompt: string;
    characters: number;
  }>;
  createdAt: string;
}

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/prompt-history?limit=10');
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setHistory(data.history);
    } catch (err: any) {
      console.error('Failed to load prompt history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <History className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Failed to load history</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No prompt history yet</p>
        <p className="text-sm">Generate your first prompts to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Recent Generations</h3>
        <span className="text-xs text-gray-500">({history.length})</span>
      </div>

      {history.map((entry) => (
        <div
          key={entry._id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
        >
          {/* Header */}
          <button
            onClick={() => toggleExpand(entry._id)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{entry.artist}</span>
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{entry.song}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(entry.createdAt)}
              </div>
              {expandedId === entry._id ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </button>

          {/* Expanded Content */}
          {expandedId === entry._id && (
            <div className="p-4 pt-0 border-t border-gray-100">
              {/* AI Analysis */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-blue-900 mb-2">
                  <strong>Artist:</strong> {entry.artistAnalysis}
                </p>
                <p className="text-blue-900">
                  <strong>Song:</strong> {entry.songAnalysis}
                </p>
              </div>

              {/* Prompts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entry.prompts.map((p, i) => (
                  <PromptCard
                    key={i}
                    title={p.title}
                    prompt={p.prompt}
                    characters={p.characters}
                    onUsePrompt={onSelectPrompt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
