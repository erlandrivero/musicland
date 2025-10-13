'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Play, Download, Share2, Trash2, Heart, Clock, Calendar } from 'lucide-react';
import { TabbedMusicPlayer } from '@/components/audio';

export interface Track {
  id: string;
  title: string;
  audioUrl: string;
  videoUrl?: string;
  imageUrl?: string;
  tags?: string;
  lyrics?: string;
  duration?: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  isFavorite?: boolean;
  playCount?: number;
  downloadCount?: number;
  mv?: string;
}

interface TrackListProps {
  tracks: Track[];
  onPlay?: (trackId: string) => void;
  onDownload?: (trackId: string, format: string) => void;
  onShare?: (trackId: string) => void;
  onDelete?: (trackId: string) => void;
  onFavorite?: (trackId: string) => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'oldest' | 'title' | 'duration' | 'plays';
type FilterOption = 'all' | 'favorites' | 'completed' | 'processing';

export function TrackList({
  tracks,
  onPlay,
  onDownload,
  onShare,
  onDelete,
  onFavorite,
}: TrackListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Extract unique genres from tracks
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    tracks.forEach(track => {
      if (track.tags) {
        track.tags.split(',').forEach(tag => genres.add(tag.trim()));
      }
    });
    return Array.from(genres);
  }, [tracks]);

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    let result = [...tracks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.tags?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterBy !== 'all') {
      if (filterBy === 'favorites') {
        result = result.filter(track => track.isFavorite);
      } else {
        result = result.filter(track => track.status === filterBy);
      }
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter(track =>
        selectedGenres.some(genre =>
          track.tags?.toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'plays':
          return (b.playCount || 0) - (a.playCount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [tracks, searchQuery, filterBy, selectedGenres, sortBy]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks by title or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tracks</option>
              <option value="favorites">Favorites</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="duration">Duration</option>
            <option value="plays">Most Played</option>
          </select>

          {/* Genre Filters */}
          {availableGenres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableGenres.slice(0, 5).map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          {(searchQuery || filterBy !== 'all' || selectedGenres.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterBy('all');
                setSelectedGenres([]);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Track List */}
      {filteredTracks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tracks found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No tracks match your search "${searchQuery}"`
              : 'Start generating music to see your tracks here'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Track Card */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {formatDuration(track.duration)}
                    </p>
                  </div>
                  <button
                    onClick={() => onFavorite?.(track.id)}
                    className={`p-1 rounded transition-colors ${
                      track.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={20} fill={track.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {track.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {track.tags.split(',').slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={12} />
                  {formatDate(track.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentlyPlaying(track.id);
                      onPlay?.(track.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play size={16} />
                    Play
                  </button>
                  <button
                    onClick={() => onShare?.(track.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(track.id)}
                    className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setCurrentlyPlaying(track.id);
                    onPlay?.(track.id);
                  }}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  <Play size={20} />
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDuration(track.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(track.createdAt)}
                    </span>
                    {track.playCount !== undefined && (
                      <span>{track.playCount} plays</span>
                    )}
                  </div>
                </div>

                {track.tags && (
                  <div className="flex flex-wrap gap-1">
                    {track.tags.split(',').slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onFavorite?.(track.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      track.isFavorite 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                    }`}
                    title="Favorite"
                  >
                    <Heart size={18} fill={track.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => onShare?.(track.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete?.(track.id)}
                    className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Currently Playing */}
      {currentlyPlaying && (() => {
        const currentTrack = filteredTracks.find(t => t.id === currentlyPlaying);
        if (!currentTrack) return null;
        
        const currentIndex = filteredTracks.findIndex(t => t.id === currentlyPlaying);
        
        // Debug: Log track data
        console.log('[TrackList] Playing track:', {
          title: currentTrack.title,
          videoUrl: currentTrack.videoUrl,
          hasVideo: !!currentTrack.videoUrl
        });
        
        return (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl">
            <div className="max-w-7xl mx-auto">
              <TabbedMusicPlayer
                key={currentlyPlaying}
                trackId={currentlyPlaying}
                audioUrl={currentTrack.audioUrl}
                title={currentTrack.title}
                artist="AI Generated"
                lyrics={currentTrack.lyrics}
                tags={currentTrack.tags}
                duration={currentTrack.duration}
                videoUrl={currentTrack.videoUrl}
                imageUrl={currentTrack.imageUrl}
                mv={currentTrack.mv}
                createdAt={currentTrack.createdAt}
                isFavorite={currentTrack.isFavorite}
                onClose={() => setCurrentlyPlaying(null)}
                onNext={() => {
                  if (currentIndex >= 0 && currentIndex < filteredTracks.length - 1) {
                    setCurrentlyPlaying(filteredTracks[currentIndex + 1].id);
                  }
                }}
                onPrevious={() => {
                  if (currentIndex > 0) {
                    setCurrentlyPlaying(filteredTracks[currentIndex - 1].id);
                  }
                }}
                onFavorite={onFavorite}
                onShare={onShare}
                onDownload={onDownload}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
