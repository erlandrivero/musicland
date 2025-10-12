'use client';

import React from 'react';
import { LyricsSection as LyricsSectionType, getSectionColor } from '@/lib/utils/lyricsUtils';

interface LyricsSectionProps {
  section: LyricsSectionType;
  searchQuery?: string;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showLineNumbers?: boolean;
  highlightedLines?: number[];
}

export function LyricsSection({
  section,
  searchQuery = '',
  fontSize,
  showLineNumbers = false,
  highlightedLines = [],
}: LyricsSectionProps) {
  const colors = getSectionColor(section.type);
  
  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const highlightSearchTerm = (text: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return (
          <mark
            key={index}
            className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded font-semibold"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      {section.type !== 'unknown' && (
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${colors.border}`}>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}
          >
            {section.label}
          </span>
        </div>
      )}

      {/* Section Lines */}
      <div className="space-y-2">
        {section.lines.map((line, index) => {
          const isHighlighted = highlightedLines.includes(line.lineNumber);
          
          return (
            <div
              key={index}
              className={`flex items-start gap-3 transition-colors duration-200 ${
                isHighlighted
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 -mx-2 px-2 py-1 rounded'
                  : ''
              }`}
            >
              {showLineNumbers && (
                <span className="text-xs text-gray-400 dark:text-gray-600 font-mono w-8 flex-shrink-0 text-right select-none">
                  {line.lineNumber}
                </span>
              )}
              <p
                className={`${fontSizeClasses[fontSize]} text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words`}
              >
                {highlightSearchTerm(line.text)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
