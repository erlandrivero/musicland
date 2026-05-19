'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LeadCaptureForm } from '@/components/marketing';
import { Sparkles, Music, Zap, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [skipForm, setSkipForm] = useState(false);

  useEffect(() => {
    // If user is not authenticated, redirect to signin
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  if (skipForm) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">WELCOME TO AI MUSIC STUDIO</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome, {session.user?.name?.split(' ')[0] || 'there'}! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You&apos;re all set! Before you start creating amazing music, grab our free guide to get the best results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            {/* Left: What You Get */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎁 Your Free Welcome Gift
                </h2>
                <p className="text-gray-600 mb-6">
                  Get instant access to our <strong>Top 50 AI Music Prompts</strong> guide - the same prompts used by professional musicians to create studio-quality tracks.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">50 Ready-to-Use Prompts</h3>
                      <p className="text-sm text-gray-600">Every genre from Hip-Hop to Classical</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Pro Tips & Techniques</h3>
                      <p className="text-sm text-gray-600">Fine-tune for better results</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Real Examples</h3>
                      <p className="text-sm text-gray-600">See what works and why</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skip Button */}
              <button
                onClick={() => setSkipForm(true)}
                className="w-full text-center text-gray-600 hover:text-gray-900 text-sm py-3 transition-colors flex items-center justify-center gap-2"
              >
                Skip for now, take me to my dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Form */}
            <div>
              <LeadCaptureForm
                title="Get Your Free Guide"
                description="We'll send it to your inbox instantly."
                buttonText="Send Me The Guide"
                successRedirect="/dashboard"
                source="New User Welcome"
              />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              💡 <strong>Pro Tip:</strong> Use these prompts in the Generate page to create your first track in minutes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
