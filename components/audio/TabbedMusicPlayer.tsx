'use client';

import React, { useState } from 'react';
import { Music, FileText, Sheet, Info, FileAudio } from 'lucide-react';
import { EnhancedAudioPlayer } from './enhanced-audio-player';
import { LyricsViewer } from '../lyrics/LyricsViewer';
import { SheetMusicViewer } from '../sheet-music';
import { MidiViewer } from '../midi';

interface TabbedMusicPlayerProps {
  // Audio props
  audioUrl: string;
  title: string;
  artist?: string;
  duration?: number;
  trackId: string;
  
  // Lyrics props
  lyrics?: string | null;
  
  // Track metadata
  tags?: string;
  videoUrl?: string;
  imageUrl?: string;
  mv?: string;
  prompt?: string;
  style?: string;
  createdAt?: string;
  
  // Event handlers
  onPrevious?: () => void;
  onNext?: () => void;
  onFavorite?: (trackId: string) => void;
  onShare?: (trackId: string) => void;
  onDownload?: (trackId: string, format: string) => void;
  onClose?: () => void;
  isFavorite?: boolean;
}

type TabType = 'audio' | 'lyrics' | 'sheet' | 'midi' | 'details';

export function TabbedMusicPlayer({
  audioUrl,
  title,
  artist = 'AI Generated',
  duration,
  trackId,
  lyrics,
  tags,
  videoUrl,
  imageUrl,
  mv,
  prompt,
  style,
  createdAt,
  onPrevious,
  onNext,
  onFavorite,
  onShare,
  onDownload,
  onClose,
  isFavorite = false,
}: TabbedMusicPlayerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('audio');

  const tabs = [
    {
      id: 'audio' as TabType,
      label: 'Audio',
      icon: Music,
      enabled: true,
    },
    {
      id: 'lyrics' as TabType,
      label: 'Lyrics',
      icon: FileText,
      enabled: !!lyrics,
      badge: lyrics ? undefined : 'N/A',
    },
    {
      id: 'midi' as TabType,
      label: 'MIDI',
      icon: FileAudio,
      enabled: true,
    },
    {
      id: 'sheet' as TabType,
      label: 'Sheet Music',
      icon: Sheet,
      enabled: true,
    },
    {
      id: 'details' as TabType,
      label: 'Details',
      icon: Info,
      enabled: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      {/* Header with Track Info and Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
          <p className="text-sm text-blue-100 dark:text-blue-200">{artist}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {onFavorite && (
            <button
              onClick={() => onFavorite(trackId)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className={`w-5 h-5 ${isFavorite ? 'fill-white' : 'stroke-white fill-none'}`} viewBox="0 0 24 24" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(trackId)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              title="Share"
            >
              <svg className="w-5 h-5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Music player tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => tab.enabled && setActiveTab(tab.id)}
                disabled={!tab.enabled}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900'
                    : tab.enabled
                    ? 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    : 'border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className={`overflow-y-auto ${activeTab === 'audio' ? '' : 'min-h-[320px] max-h-[320px]'}`}>
        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <div className="p-0">
            <EnhancedAudioPlayer
              audioUrl={audioUrl}
              title={title}
              artist={artist}
              duration={duration}
              trackId={trackId}
              onPrevious={onPrevious}
              onNext={onNext}
              onFavorite={onFavorite}
              onShare={onShare}
              onDownload={onDownload}
              onClose={onClose}
              isFavorite={isFavorite}
            />
          </div>
        )}

        {/* Lyrics Tab */}
        {activeTab === 'lyrics' && (
          <div className="p-6">
            <LyricsViewer
              lyrics={lyrics}
              title={title}
              artist={artist}
              onShare={() => onShare?.(trackId)}
            />
          </div>
        )}

        {/* Sheet Music Tab - Keep mounted to preserve generated content */}
        <div className={`${activeTab === 'sheet' ? '' : 'hidden'}`}>
          <SheetMusicViewer
            key={trackId}
            trackId={trackId}
            title={title}
            audioUrl={audioUrl}
          />
        </div>

        {/* MIDI Tab */}
        {activeTab === 'midi' && (
          <div className="p-0">
            <MidiViewer
              trackId={trackId}
              title={title}
              audioUrl={audioUrl}
            />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Track Information
                </h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</dt>
                    <dd className="text-base text-gray-900 dark:text-gray-100">{title}</dd>
                  </div>
                  
                  {artist && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Artist</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100">{artist}</dd>
                    </div>
                  )}
                  
                  {tags && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Genre/Style</dt>
                      <dd className="flex flex-wrap gap-2">
                        {tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  
                  {mv && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">AI Model</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100 font-mono">{mv}</dd>
                    </div>
                  )}
                  
                  {prompt && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Generation Prompt</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100">{prompt}</dd>
                    </div>
                  )}
                  
                  {style && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Style</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100">{style}</dd>
                    </div>
                  )}
                  
                  {duration && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100">
                        {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                      </dd>
                    </div>
                  )}
                  
                  {createdAt && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</dt>
                      <dd className="text-base text-gray-900 dark:text-gray-100">
                        {new Date(createdAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Track ID</dt>
                    <dd className="text-base text-gray-900 dark:text-gray-100 font-mono">{trackId}</dd>
                  </div>
                </dl>
              </div>

              {/* Media Links */}
              {(videoUrl || imageUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Media Files
                  </h3>
                  <div className="space-y-2">
                    {videoUrl && (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        🎥 View Video
                      </a>
                    )}
                    {imageUrl && (
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        🖼️ View Cover Image
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
