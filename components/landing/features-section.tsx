'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Award, 
  Scale, 
  Smartphone, 
  Users, 
  Download 
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Advanced AI models trained on millions of professional tracks create unique, high-quality music tailored to your specifications."
  },
  {
    icon: Award,
    title: "Professional Quality",
    description: "Studio-grade audio output with professional mixing and mastering. Every track sounds like it was produced by experts."
  },
  {
    icon: Scale,
    title: "Commercial Licensing",
    description: "Full commercial rights included. Use your generated music in videos, podcasts, advertisements, and any commercial projects."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Create music anywhere with our responsive, touch-optimized interface. Full functionality on phones, tablets, and desktops."
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time. Share projects, get feedback, and collaborate seamlessly across devices."
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Download your tracks immediately in multiple formats (MP3, WAV, FLAC). No waiting, no processing delays."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-2 mb-4">
            Everything you need to create{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              amazing music
            </span>
          </h2>
          <p className="body-large max-w-2xl mx-auto text-gray-600">
            Professional music creation tools powered by cutting-edge AI technology. 
            No musical experience required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="card-hover h-full p-6 text-center group-hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="heading-3 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="body text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button className="btn-primary">
            Start Creating Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}
