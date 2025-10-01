import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Check your email
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We sent you a sign-in link. Click the link in your email to sign in to your account.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Didn&apos;t receive the email?</strong> Check your spam folder or try signing in again.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link 
              href="/auth/signin"
              className="w-full btn-primary inline-block text-center"
            >
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{' '}
            <a 
              href="mailto:support@aimusicstudio.com" 
              className="text-blue-600 hover:text-blue-700"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
