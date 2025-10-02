'use client';

import { useState } from 'react';
import { PRICING_PLANS, SubscriptionPlan } from '@/lib/types/database';
import { Check, Sparkles, Users, Zap } from 'lucide-react';

interface PricingPageProps {
  currentPlan?: SubscriptionPlan;
  userEmail?: string;
}

export function PricingPage({ currentPlan = 'free', userEmail }: PricingPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSelectPlan = async (priceId: string, planId: string) => {
    if (!userEmail) {
      // Redirect to sign in
      window.location.href = '/api/auth/signin';
      return;
    }

    setIsLoading(planId);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setIsLoading(null);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="w-8 h-8" />;
      case 'creator':
        return <Sparkles className="w-8 h-8" />;
      case 'team':
        return <Users className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start creating amazing AI-generated music. Upgrade anytime as your needs grow.
          </p>
        </div>

        {/* Free Plan Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Free Plan</h3>
              <p className="text-gray-600">
                Get started with 50 free credits (one-time). No credit card required.
              </p>
            </div>
            {currentPlan === 'free' && (
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Current Plan
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${
                  isPopular
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`mb-4 ${isPopular ? 'text-white' : 'text-purple-600'}`}>
                  {getPlanIcon(plan.id)}
                </div>

                {/* Plan Name */}
                <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-lg ${isPopular ? 'text-white opacity-90' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>

                {/* Credits */}
                <p className={`mb-6 ${isPopular ? 'text-white opacity-90' : 'text-gray-600'}`}>
                  <span className="font-bold text-xl">{plan.credits}</span> credits per month
                </p>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  <button
                    disabled
                    className={`w-full py-3 rounded-lg font-semibold mb-6 ${
                      isPopular
                        ? 'bg-white text-purple-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.priceId, plan.id)}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all ${
                      isPopular
                        ? 'bg-white text-purple-600 hover:bg-opacity-90'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    } disabled:opacity-50`}
                  >
                    {isLoading === plan.id ? 'Loading...' : 'Get Started'}
                  </button>
                )}

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isPopular ? 'text-white' : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${isPopular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">How do credits work?</h3>
              <p className="text-gray-600">
                Each music generation uses credits based on the type and length. Standard generations use 5 credits,
                while advanced features like stem separation use more. Credits renew monthly with your subscription.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time from your account dashboard. You&apos;ll continue to have
                access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">What happens to unused credits?</h3>
              <p className="text-gray-600">
                Unused credits do not roll over to the next month. However, your credit balance resets to your plan&apos;s
                monthly allocation at the start of each billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
