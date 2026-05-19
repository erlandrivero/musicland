'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  successRedirect?: string;
  source?: string;
}

export default function LeadCaptureForm({
  title = "Get the Top 50 AI Music Prompts",
  description = "Enter your details to get our exclusive PDF guide and learn how to generate studio-quality tracks.",
  buttonText = "Send Me The Prompts",
  successRedirect = '/signup',
  source = 'Landing Page Form'
}: LeadCaptureFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const trackEvent = (eventName: string, data?: any) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'Lead Capture',
        event_label: source,
        ...data
      });
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, data);
    }

    console.log('[Analytics]', eventName, data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Track form submission attempt
    trackEvent('lead_form_submit_attempt', {
      email: formData.email,
      firstName: formData.firstName
    });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Track successful lead capture
      trackEvent('lead_captured', {
        email: formData.email,
        firstName: formData.firstName,
        contactId: data.contactId,
        duplicate: data.duplicate
      });

      setIsSuccess(true);
      
      // Redirect after 3 seconds
      if (successRedirect) {
        setTimeout(() => {
          trackEvent('lead_redirect_to_signup');
          router.push(successRedirect);
        }, 3000);
      }
      
    } catch (err: any) {
      setError(err.message);
      trackEvent('lead_form_error', {
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-green-900 mb-3">You&apos;re In! 🎉</h3>
        <p className="text-green-700 mb-2 text-lg">
          Check your email for the <strong>Top 50 AI Music Prompts PDF</strong>.
        </p>
        <p className="text-green-600 text-sm mb-6">
          (It should arrive within the next few minutes)
        </p>
        
        <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
          <p className="text-sm text-gray-600 mb-2">
            Ready to create your first AI-generated track?
          </p>
          <p className="text-xs text-gray-500">
            Redirecting you to start your free trial...
          </p>
        </div>

        <button 
          onClick={() => router.push(successRedirect)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Start Your Free Trial Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter your first name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-xl transform ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed text-white' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              {buttonText}
            </>
          )}
        </button>
        
        <div className="pt-2">
          <p className="text-xs text-center text-gray-500">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
          <p className="text-xs text-center text-gray-400 mt-1">
            By submitting, you agree to receive emails from AI Music Studio.
          </p>
        </div>
      </form>

      {/* Trust indicators */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>No Credit Card</span>
          </div>
        </div>
      </div>
    </div>
  );
}
