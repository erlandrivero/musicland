'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  callbackUrl?: string
}

export function SignInModal({ isOpen, onClose, callbackUrl }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState<'google' | 'email' | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading('google')
      setError(null)
      await signIn('google', { 
        callbackUrl: callbackUrl || '/dashboard',
        redirect: true
      })
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.')
      setIsLoading(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsLoading('email')
      setError(null)
      
      const result = await signIn('email', {
        email,
        callbackUrl: callbackUrl || '/dashboard',
        redirect: false
      })

      if (result?.error) {
        setError('Failed to send magic link. Please check your email address.')
      } else {
        setEmailSent(true)
      }
    } catch (error) {
      setError('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const handleClose = () => {
    setEmail('')
    setEmailSent(false)
    setError(null)
    setIsLoading(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {emailSent ? 'Check Your Email' : 'Sign In to AI Music Studio'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {emailSent 
                      ? 'We sent you a magic link to sign in'
                      : 'Create professional music with AI in seconds'
                    }
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {emailSent ? (
                  /* Email Sent State */
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Magic link sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We sent a sign-in link to <strong>{email}</strong>. 
                      Click the link in your email to sign in.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setEmailSent(false)
                          setEmail('')
                        }}
                        className="w-full btn-outline"
                      >
                        Try Different Email
                      </button>
                      <button
                        onClick={handleClose}
                        className="w-full text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Sign In Form */
                  <div className="space-y-6">
                    {/* Error Message */}
                    {error && (
                      <motion.div
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-sm text-red-700">{error}</p>
                      </motion.div>
                    )}

                    {/* Google Sign In */}
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading !== null}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading === 'google' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      <span className="font-medium text-gray-700">
                        {isLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    {/* Email Sign In */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={isLoading !== null}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading !== null || !email}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading === 'email' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Magic Link...</span>
                          </div>
                        ) : (
                          'Send Magic Link'
                        )}
                      </button>
                    </form>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center">
                      By signing in, you agree to our{' '}
                      <a href="/terms" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
