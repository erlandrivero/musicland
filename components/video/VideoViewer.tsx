'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Video as VideoIcon } from 'lucide-react';

interface VideoViewerProps {
  videoUrl?: string | null;
  audioUrl: string;
  title: string;
  artist?: string;
}

export function VideoViewer({ videoUrl, audioUrl, title, artist = 'AI Generated' }: VideoViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Debug: Log video URL
  useEffect(() => {
    console.log('[VideoViewer] Track:', title, 'VideoURL:', videoUrl);
  }, [title, videoUrl]);

  // Toggle play/pause
  const togglePlayPause = () => {
    // For video mode
    if (videoUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }
    
    // For audio visualization mode
    if (!videoUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoUrl && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (!videoUrl && audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoUrl && videoRef.current) {
      videoRef.current.volume = newVolume;
    } else if (!videoUrl && audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoUrl && videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Audio visualization (fallback if no video)
  useEffect(() => {
    if (videoUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Simple waveform visualization
    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.01;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated waveform
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.02 + time) * 50 * Math.sin(time * 2);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw circles
      ctx.fillStyle = '#8B5CF6';
      for (let i = 0; i < 5; i++) {
        const angle = time + i * Math.PI * 0.4;
        const x = canvas.width / 2 + Math.cos(angle) * 100;
        const y = canvas.height / 2 + Math.sin(angle) * 100;
        const radius = 10 + Math.sin(time * 3 + i) * 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [videoUrl, isPlaying]);

  if (!videoUrl) {
    // Fallback: Audio visualization
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Visualization Canvas */}
        <div className="relative flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
          
          {/* Overlay Info - Only show when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm px-8 py-6 rounded-lg">
                <VideoIcon className="w-16 h-16 mx-auto mb-4 text-white" />
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-300">{artist}</p>
                <p className="text-sm text-gray-400 mt-4">Audio Visualization</p>
              </div>
            </div>
          )}
        </div>

        {/* Simple Controls */}
        <div className="bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Video player
  return (
    <div className="flex flex-col h-full bg-black">
      {/* Video Element */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          src={videoUrl}
          key={videoUrl}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Video Controls */}
      <div className="bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Play controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
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
                className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Right: Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:text-blue-400 transition-colors"
            title="Fullscreen"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
