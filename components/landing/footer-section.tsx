'use client'

import { motion } from 'framer-motion'
import { 
  Music, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/aimusicstudio' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/aimusicstudio' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/aimusicstudio' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/aimusicstudio' }
]

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Music Studio</span>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Create professional music with AI in seconds. Trusted by 50,000+ creators 
              worldwide for content creation, podcasts, and commercial projects.
            </p>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center text-gray-400 text-sm">
            © 2024 AI Music Studio. All rights reserved.
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-8 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                SSL
              </div>
              <span className="text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                GDPR
              </div>
              <span className="text-sm">Privacy Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
