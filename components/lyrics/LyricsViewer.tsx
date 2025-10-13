'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Music, FileText } from 'lucide-react';
import { parseLyrics, searchLyrics, ParsedLyrics } from '@/lib/utils/lyricsUtils';
import { LyricsSection } from './LyricsSection';
import { LyricsControls } from './LyricsControls';

interface LyricsViewerProps {
  lyrics: string | null | undefined;
  title?: string;
  artist?: string;
  onShare?: () => void;
  className?: string;
  currentTime?: number;
  duration?: number;
}

export function LyricsViewer({
  lyrics,
  title,
  artist,
  onShare,
  className = '',
  currentTime = 0,
  duration = 0,
}: LyricsViewerProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Parse lyrics (memoized for performance)
  const parsedLyrics: ParsedLyrics = useMemo(() => {
    return parseLyrics(lyrics);
  }, [lyrics]);

  // Search results (memoized)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchLyrics(parsedLyrics, searchQuery);
  }, [parsedLyrics, searchQuery]);

  // Load font size preference from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('lyrics-font-size');
    if (savedFontSize && ['sm', 'base', 'lg', 'xl'].includes(savedFontSize)) {
      setFontSize(savedFontSize as 'sm' | 'base' | 'lg' | 'xl');
    }
  }, []);

  // Save font size preference
  const handleFontSizeChange = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setFontSize(size);
    localStorage.setItem('lyrics-font-size', size);
  };

  // Auto-scroll lyrics based on playback time
  useEffect(() => {
    if (!autoScroll || !contentRef.current || !duration || duration === 0) return;
    
    // Calculate scroll position based on current time
    const progress = currentTime / duration;
    const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
    const targetScroll = progress * scrollHeight;
    
    // Smooth scroll to position
    contentRef.current.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, [currentTime, duration, autoScroll]);

  // Empty state - no lyrics available
  if (!lyrics || lyrics.trim() === '') {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Lyrics Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            Lyrics are not available for this track yet. They may be added in a future update.
          </p>
        </div>
      </div>
    );
  }

  // No sections found (plain text)
  if (parsedLyrics.sections.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unable to Parse Lyrics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
            The lyrics format could not be parsed. Showing raw text:
          </p>
          <div className="w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
              {lyrics}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </h2>
        )}
        {artist && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {artist}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <span>{parsedLyrics.sections.length} {parsedLyrics.sections.length === 1 ? 'section' : 'sections'}</span>
          <span>•</span>
          <span>{parsedLyrics.totalLines} {parsedLyrics.totalLines === 1 ? 'line' : 'lines'}</span>
          {parsedLyrics.hasSections && (
            <>
              <span>•</span>
              <span>Structured format</span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <LyricsControls
        lyrics={parsedLyrics}
        title={title}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults || undefined}
        onShare={onShare}
      />

      {/* Auto-scroll Toggle */}
      {duration > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-scroll with playback</span>
          </label>
        </div>
      )}

      {/* Lyrics Content */}
      <div ref={contentRef} className="lyrics-content max-h-[400px] overflow-y-auto">
        {parsedLyrics.sections.map((section, index) => (
          <LyricsSection
            key={index}
            section={section}
            searchQuery={searchQuery}
            fontSize={fontSize}
            showLineNumbers={showLineNumbers}
            highlightedLines={searchResults?.lines || []}
          />
        ))}
      </div>

      {/* Footer Info */}
      {searchResults && searchResults.matches > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-gray-100">{searchResults.matches}</span> {searchResults.matches === 1 ? 'match' : 'matches'} for &quot;{searchQuery}&quot; in{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{searchResults.sections.length}</span> {searchResults.sections.length === 1 ? 'section' : 'sections'}
          </p>
        </div>
      )}
    </div>
  );
}
