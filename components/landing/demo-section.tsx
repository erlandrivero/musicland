'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Volume2, Download } from 'lucide-react'
import { useState } from 'react'

const sampleTracks = [
  {
    id: 1,
    title: "Upbeat Pop Anthem",
    genre: "Pop",
    duration: "2:45",
    description: "Energetic pop track with catchy hooks"
  },
  {
    id: 2,
    title: "Chill Lo-Fi Beat",
    genre: "Lo-Fi",
    duration: "3:12",
    description: "Relaxing background music perfect for focus"
  },
  {
    id: 3,
    title: "Epic Cinematic Score",
    genre: "Cinematic",
    duration: "4:20",
    description: "Dramatic orchestral piece for video content"
  }
]

export function DemoSection() {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)

  const togglePlay = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50" id="demo">
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
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative">
              <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group">
                <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-sm opacity-80">Watch Demo</div>
                <div className="font-semibold">See AI Music Generation in Action</div>
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
                  <div className="flex items-center gap-2 text-gray-400">
                    <Volume2 className="w-4 h-4" />
                    <div className="w-16 h-1 bg-gray-200 rounded-full">
                      <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
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
          <button className="btn-primary mr-4">
            Try It Yourself
          </button>
          <button className="btn-outline">
            View All Samples
          </button>
        </motion.div>
      </div>
    </section>
  )
}
