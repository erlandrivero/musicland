'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertCircle, Coins, X, ExternalLink } from 'lucide-react';
import { useCredits } from '@/hooks/use-credits';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits,
}: InsufficientCreditsModalProps) {
  const { credits } = useCredits();
  const shortfall = requiredCredits - credits;

  const pricingTiers = [
    { credits: 50, price: 4, popular: false },
    { credits: 100, price: 8, popular: true },
    { credits: 250, price: 18, popular: false },
    { credits: 500, price: 32, popular: false },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold text-gray-900"
                      >
                        Insufficient Credits
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        You need more credits to continue
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Current Status */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-800 font-medium mb-1">
                        Current Balance
                      </p>
                      <p className="text-2xl font-bold text-red-900 flex items-center gap-2">
                        <Coins size={24} />
                        {credits}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-800 font-medium mb-1">
                        Required
                      </p>
                      <p className="text-2xl font-bold text-red-900">
                        {requiredCredits}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-300">
                    <p className="text-sm text-red-800">
                      You need <span className="font-bold">{shortfall} more credits</span> to proceed with this action.
                    </p>
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Purchase Credits
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {pricingTiers.map((tier) => (
                      <div
                        key={tier.credits}
                        className={`relative p-4 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md ${
                          tier.popular
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              Popular
                            </span>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Coins size={20} className="text-blue-600" />
                            <p className="text-2xl font-bold text-gray-900">
                              {tier.credits}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">credits</p>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            ${tier.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${(tier.price / tier.credits).toFixed(2)} per credit
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Navigate to purchase page
                      window.open('https://sunoapi.com/credits', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Coins size={20} />
                    Purchase Credits
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Credits are managed through SunoAPI. You&apos;ll be redirected to their platform to complete your purchase.
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
