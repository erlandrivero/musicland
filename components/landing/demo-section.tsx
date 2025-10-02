'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Volume2, Download } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const sampleTracks = [
  {
    id: 1,
    title: "Skyline Dreams",
    genre: "Pop",
    duration: "2:17",
    description: "An energetic and uplifting pop anthem.",
    audioUrl: "/audio/sample-pop.mp3"
  },
  {
    id: 2,
    title: "Midnight Lo-Fi",
    genre: "Lo-Fi",
    duration: "2:27",
    description: "A relaxing beat for late-night focus.",
    audioUrl: "/audio/sample-lofi.mp3"
  },
  {
    id: 3,
    title: "Cinematic Victory",
    genre: "Cinematic",
    duration: "2:00",
    description: "A dramatic and epic orchestral score.",
    audioUrl: "/audio/sample-cinematic.mp3"
  }
]

export function DemoSection() {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef<HTMLAudioElement>(null!)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleDownload = (audioUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `${title}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = async (trackId: number) => {
    if (playingTrack === trackId) {
      audioRef.current.pause()
      setPlayingTrack(null)
      return
    }

    const track = sampleTracks.find(t => t.id === trackId)
    if (track) {
      try {
        audioRef.current.src = track.audioUrl
        await audioRef.current.play()
        setPlayingTrack(trackId)
      } catch (error) {
        console.error("Audio playback failed:", error)
        setPlayingTrack(null)
      }
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50" id="demo">
      <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-2 mb-4">
            Hear the{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI magic
            </span>{' '}
            in action
          </h2>
          <p className="body-large max-w-2xl mx-auto text-gray-600 mb-8">
            Listen to tracks created by our AI in seconds. Each one is unique, 
            professional-quality, and ready for commercial use.
          </p>
        </motion.div>

        {/* Demo Video/Interactive Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-video relative">
              <video 
                className="w-full h-full object-cover"
                controls
                poster="/demo-video-poster.jpg"
              >
                <source src="/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 left-4 text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 px-4 py-2 rounded-lg backdrop-blur-sm pointer-events-none">
                <div className="text-xs font-medium opacity-90">🎵 Watch Demo</div>
                <div className="font-semibold text-sm">AI Music Generation in Action</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sample Tracks */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="heading-3 text-center mb-8">Sample AI-Generated Tracks</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTracks.map((track, index) => (
              <motion.div
                key={track.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{track.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{track.genre}</span>
                      <span>•</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePlay(track.id)}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                  >
                    {playingTrack === track.id ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{track.description}</p>
                {track.id === 2 && <div className="h-5" />}

                {/* Waveform Placeholder */}
                <div className="h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full ${
                          playingTrack === track.id 
                            ? 'animate-pulse' 
                            : ''
                        }`}
                        style={{ 
                          height: `${Math.random() * 30 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 flex-grow">
                    <Volume2 className="w-4 h-4" />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <button onClick={() => handleDownload(track.audioUrl, track.title)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="/auth/signin" className="btn-primary inline-block">
            Try It Yourself
          </a>
        </motion.div>
      </div>
    </section>
  )
}
