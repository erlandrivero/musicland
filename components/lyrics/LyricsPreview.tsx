'use client';

import React from 'react';
import { FileText, Music } from 'lucide-react';

interface LyricsPreviewProps {
  lyrics: string | null | undefined;
  maxLines?: number;
  className?: string;
  onClick?: () => void;
}

export function LyricsPreview({
  lyrics,
  maxLines = 3,
  className = '',
  onClick,
}: LyricsPreviewProps) {
  if (!lyrics || lyrics.trim() === '') {
    return (
      <div className={`${className} flex items-center gap-2 text-gray-400 dark:text-gray-600 text-sm`}>
        <Music className="w-4 h-4" />
        <span>No lyrics available</span>
      </div>
    );
  }

  // Extract first few lines (non-empty, non-section markers)
  const lines = lyrics
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.match(/^\[.+\]$/);
    })
    .slice(0, maxLines);

  if (lines.length === 0) {
    return (
      <div className={`${className} flex items-center gap-2 text-gray-400 dark:text-gray-600 text-sm`}>
        <FileText className="w-4 h-4" />
        <span>Lyrics available</span>
      </div>
    );
  }

  return (
    <div
      className={`${className} group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-start gap-2">
        <FileText className="w-4 h-4 text-gray-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {lines.map((line, index) => (
            <p
              key={index}
              className="text-sm text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors"
            >
              {line}
            </p>
          ))}
          {lyrics.split('\n').filter(l => l.trim() !== '').length > maxLines && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Click to read more...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
