'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Content Creator",
    company: "@sarahcreates",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "This AI music generator has completely transformed my content creation workflow. I can create custom background music for my videos in minutes instead of hours searching for royalty-free tracks. The quality is incredible!",
    highlight: "Transformed my workflow"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Creative Director",
    company: "Pixel Studios",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "As an agency, we need high-quality music for client projects fast. This platform delivers professional-grade tracks that our clients love. The commercial licensing makes it perfect for our needs.",
    highlight: "Professional-grade quality"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Indie Musician",
    company: "Solo Artist",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "I use this for creating backing tracks and getting inspiration for new songs. The AI understands musical concepts so well - it's like having a collaborative partner that never runs out of ideas.",
    highlight: "Like having a creative partner"
  },
  {
    id: 4,
    name: "David Park",
    role: "Podcast Producer",
    company: "TechTalk Podcast",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "Creating custom intro and outro music for our podcast used to be expensive and time-consuming. Now we can generate exactly what we need in seconds. Our listeners constantly ask about our music!",
    highlight: "Exactly what we need"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50" id="testimonials">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-2 mb-4">
            Loved by{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              creators worldwide
            </span>
          </h2>
          <p className="body-large max-w-2xl mx-auto text-gray-600">
            Join thousands of content creators, agencies, and musicians who trust our AI 
            to create professional music for their projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-blue-600" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed relative z-10">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Highlight */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-6">
                  <div className="text-sm font-medium text-blue-700">
                    💡 &ldquo;{testimonial.highlight}&rdquo;
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <motion.div 
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-gray-600">Songs Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
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
          <div className="mb-4">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Ready to join our community of creators?
            </div>
            <div className="text-gray-600">
              Start creating professional music with AI today
            </div>
          </div>
          <a href="/auth/signin" className="btn-primary inline-block">
            Start Creating Music
          </a>
        </motion.div>
      </div>
    </section>
  )
}
