'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { 
  LogOut, 
  ChevronDown, 
} from 'lucide-react'

export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session?.user) return null

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Removed menu items - keeping only user info and sign out

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          {session.user.image && !imageError ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full object-cover"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {session.user.name || 'User'}
          </div>
          <div className="text-xs text-gray-500">
            {session.user.credits} credits
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {session.user.image && !imageError ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {session.user.name || 'User'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {session.user.email}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {session.user.credits} credits • {session.user.subscription || 'Free'} plan
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left group"
              >
                <LogOut className="w-4 h-4" />
                <div>
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-red-500">End your session</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
