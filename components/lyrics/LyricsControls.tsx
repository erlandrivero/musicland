'use client';

import React, { useState } from 'react';
import {
  Search,
  Copy,
  Download,
  ZoomIn,
  ZoomOut,
  Printer,
  Share2,
  Check,
  X,
} from 'lucide-react';
import { copyToClipboard, downloadTextFile, exportLyricsToText, ParsedLyrics } from '@/lib/utils/lyricsUtils';

interface LyricsControlsProps {
  lyrics: ParsedLyrics;
  title?: string;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  onFontSizeChange: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  searchResults?: { matches: number };
  onShare?: () => void;
}

export function LyricsControls({
  lyrics,
  title = 'Lyrics',
  fontSize,
  onFontSizeChange,
  onSearchChange,
  searchQuery,
  searchResults,
  onShare,
}: LyricsControlsProps) {
  const [copied, setCopied] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleCopy = async () => {
    const text = exportLyricsToText(lyrics, title);
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = exportLyricsToText(lyrics, title);
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lyrics.txt`;
    downloadTextFile(text, filename);
  };

  const handlePrint = () => {
    const text = exportLyricsToText(lyrics, title);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title} - Lyrics</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                line-height: 1.8;
              }
              h1 {
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 30px;
              }
              pre {
                white-space: pre-wrap;
                font-family: inherit;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <pre>${text}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const increaseFontSize = () => {
    const sizes: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      onFontSizeChange(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      onFontSizeChange(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showSearch
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          aria-label="Toggle search"
        >
          <Search className="w-4 h-4" />
          Search
        </button>

        {/* Font Size Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={decreaseFontSize}
            disabled={fontSize === 'sm'}
            className="p-2 rounded hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease font size"
            title="Decrease font size"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {fontSize === 'sm' && 'Small'}
            {fontSize === 'base' && 'Medium'}
            {fontSize === 'lg' && 'Large'}
            {fontSize === 'xl' && 'X-Large'}
          </span>
          <button
            onClick={increaseFontSize}
            disabled={fontSize === 'xl'}
            className="p-2 rounded hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase font size"
            title="Increase font size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy lyrics"
          title="Copy lyrics to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Download lyrics"
          title="Download as TXT file"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Print lyrics"
          title="Print lyrics"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>

        {/* Share */}
        {onShare && (
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share lyrics"
            title="Share lyrics"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search lyrics..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchResults && searchResults.matches > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {searchResults.matches} {searchResults.matches === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
