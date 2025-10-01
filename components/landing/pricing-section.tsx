'use client'

import { motion } from 'framer-motion'
import { Check, Star, Zap } from 'lucide-react'

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out AI music generation",
    features: [
      "5 tracks per month",
      "Standard quality (MP3)",
      "Basic AI models",
      "Personal use license",
      "Community support"
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-gray-400 to-gray-600"
  },
  {
    name: "Creator",
    price: "$9.99",
    period: "per month",
    description: "Ideal for content creators and small projects",
    features: [
      "100 tracks per month",
      "High quality (WAV, MP3)",
      "Advanced AI models",
      "Commercial use license",
      "Priority support",
      "Stem separation",
      "Custom styles",
      "Mobile app access"
    ],
    cta: "Start Free Trial",
    popular: true,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    name: "Team",
    price: "$29.99",
    period: "per month",
    description: "Perfect for agencies and professional teams",
    features: [
      "Unlimited tracks",
      "Studio quality (FLAC, WAV, MP3)",
      "Premium AI models",
      "Extended commercial license",
      "24/7 priority support",
      "Advanced stem separation",
      "Custom model training",
      "Team collaboration tools",
      "API access",
      "White-label options"
    ],
    cta: "Start Free Trial",
    popular: false,
    gradient: "from-purple-500 to-pink-600"
  }
]

export function PricingSection() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-2 mb-4">
            Choose your{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              creative plan
            </span>
          </h2>
          <p className="body-large max-w-2xl mx-auto text-gray-600">
            Start free and scale as you grow. All plans include commercial licensing 
            and access to our latest AI models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative ${tier.popular ? 'md:-mt-4' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full ${
                tier.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-1">/{tier.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {tier.cta}
                </button>

                {tier.popular && (
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      14-day free trial • No credit card required
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-center mb-8">All plans include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">Commercial License</div>
                <div className="text-sm text-gray-600">Use in any project</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Check className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">No Royalties</div>
                <div className="text-sm text-gray-600">Keep 100% of earnings</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">Instant Download</div>
                <div className="text-sm text-gray-600">Multiple formats</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Check className="w-6 h-6 text-orange-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">Regular Updates</div>
                <div className="text-sm text-gray-600">Latest AI models</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-600">
            Have questions?{' '}
            <a href="#faq" className="text-blue-600 hover:text-blue-700 font-medium">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="#contact" className="text-blue-600 hover:text-blue-700 font-medium">
              contact support
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
