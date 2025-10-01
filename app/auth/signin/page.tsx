'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SignInModal } from '@/components/auth/sign-in-modal'

function SignInContent() {
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(true)
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleClose = () => {
    setIsModalOpen(false)
    // Redirect to home page when modal is closed
    window.location.href = '/'
  }

  return (
    <SignInModal 
      isOpen={isModalOpen}
      onClose={handleClose}
      callbackUrl={callbackUrl}
    />
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  )
}
