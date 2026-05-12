'use client';

import { useState } from 'react';
import { Search, Loader2, Music, User, Sparkles, AlertCircle } from 'lucide-react';
import { PromptCard } from './PromptCard';

interface GeneratedData {
  artistAnalysis: string;
  songAnalysis: string;
  prompts: Array<{
    title: string;
    prompt: string;
    characters: number;
  }>;
}

interface PromptGeneratorProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptGenerator({ onSelectPrompt }: PromptGeneratorProps) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<GeneratedData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist || !song) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist, song }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate prompts');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Prompt generation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Smart Prompt Generator</h2>
        </div>
        <p className="text-gray-600">
          Enter an artist and song. Our AI will research it and generate 4 perfect Suno prompts.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="e.g. Michael Jackson"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Song Title
              </label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="e.g. Beat It"
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !artist || !song}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Researching & Generating...
              </>
            ) : (
              <>
                <Search size={20} />
                Generate Prompts
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* AI Analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">AI Research Analysis</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">Artist Style:</p>
                <p className="text-sm text-blue-900">{data.artistAnalysis}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-700 mb-1">Song Details:</p>
                <p className="text-sm text-blue-900">{data.songAnalysis}</p>
              </div>
            </div>
          </div>

          {/* Prompt Cards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.prompts.map((p, i) => (
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
        </div>
      )}
    </div>
  );
}
