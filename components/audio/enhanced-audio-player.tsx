'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Download,
  Share2,
  Heart,
  MoreVertical,
  X
} from 'lucide-react';

interface EnhancedAudioPlayerProps {
  audioUrl: string;
  title: string;
  artist?: string;
  duration?: number;
  trackId: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onFavorite?: (trackId: string) => void;
  onShare?: (trackId: string) => void;
  onDownload?: (trackId: string, format: string) => void;
  onClose?: () => void;
  isFavorite?: boolean;
}

export function EnhancedAudioPlayer({
  audioUrl,
  title,
  artist = 'AI Generated',
  duration,
  trackId,
  onPrevious,
  onNext,
  onFavorite,
  onShare,
  onDownload,
  onClose,
  isFavorite = false,
}: EnhancedAudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const downloadFormats = [
    { format: 'mp3-128', label: 'MP3 (128 kbps)' },
    { format: 'mp3-320', label: 'MP3 (320 kbps)' },
    { format: 'wav', label: 'WAV (Lossless)' },
    { format: 'flac', label: 'FLAC (Lossless)' },
  ];

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#D1D5DB',
      progressColor: '#3B82F6',
      cursorColor: '#8B5CF6',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 2,
      height: 80,
      barGap: 2,
      normalize: true,
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
      setTotalDuration(wavesurfer.getDuration());
      setIsLoading(false);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', () => {
      if (isLooping) {
        wavesurfer.play();
      } else {
        setIsPlaying(false);
        if (onNext) onNext();
      }
    });

    wavesurfer.on('error', (error) => {
      console.error('WaveSurfer error:', error);
      setIsLoading(false);
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      try {
        if (wavesurfer) {
          wavesurfer.destroy();
        }
      } catch (error) {
        // Ignore errors during cleanup
      }
    };
  }, [audioUrl, isLooping, onNext]);

  const togglePlayPause = useCallback(() => {
    if (!wavesurferRef.current) return;
    
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!wavesurferRef.current) return;
    
    if (isMuted) {
      wavesurferRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      wavesurferRef.current.setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  const handleDownload = useCallback((format: string) => {
    if (onDownload) {
      onDownload(trackId, format);
    }
    setShowDownloadMenu(false);
  }, [trackId, onDownload]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            <p className="text-sm text-blue-100">{artist}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onFavorite?.(trackId)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Favorite"
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onShare?.(trackId)}
              className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              title="Share"
            >
              <Share2 size={20} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                title="Close Player"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div className="relative bg-gray-50 p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading waveform...</p>
            </div>
          </div>
        )}
        <div ref={waveformRef} className="w-full" />
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Time Display */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-full transition-colors ${
              isShuffled 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          {/* Previous */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Previous"
            >
              <SkipBack size={24} />
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          {/* Next */}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Next"
            >
              <SkipForward size={24} />
            </button>
          )}

          {/* Loop */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 rounded-full transition-colors ${
              isLooping 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Loop"
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <button
              onClick={toggleMute}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Playback Speed */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {playbackSpeeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handlePlaybackRateChange(speed)}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                      speed === playbackRate ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            {showDownloadMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[200px]">
                {downloadFormats.map(({ format, label }) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-500">
        <span>Track ID: {trackId.slice(0, 8)}...</span>
        <span className="text-blue-600 font-medium">AI Generated • High Quality</span>
      </div>
    </div>
  );
}
