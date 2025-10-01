'use client';

import { useCredits, useCreditCalculator, CREDIT_COSTS } from '@/hooks/use-credits';
import { Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditCostPreviewProps {
  generationType: keyof typeof CREDIT_COSTS;
  quantity?: number;
  className?: string;
}

export function CreditCostPreview({
  generationType,
  quantity = 1,
  className,
}: CreditCostPreviewProps) {
  const { credits, hasCredits } = useCredits();
  const { calculateCost } = useCreditCalculator();

  const cost = calculateCost(generationType, quantity);
  const canAfford = hasCredits(cost);
  const remainingCredits = credits - cost;

  const typeLabels: Record<keyof typeof CREDIT_COSTS, string> = {
    STANDARD_GENERATION: 'Standard Generation',
    EXTENDED_GENERATION: 'Extended Generation',
    CUSTOM_MODE: 'Custom Mode',
    INSTRUMENTAL: 'Instrumental',
    LYRICS_ONLY: 'Lyrics Only',
    STEM_SEPARATION: 'Stem Separation',
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      canAfford 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-red-50 border-red-200',
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {canAfford ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <AlertCircle size={18} className="text-red-600" />
            )}
            <h4 className="font-semibold text-gray-900">
              {typeLabels[generationType]}
            </h4>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cost per generation:</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <Coins size={14} />
                {CREDIT_COSTS[generationType]}
              </span>
            </div>
            
            {quantity > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium text-gray-900">×{quantity}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total cost:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <Coins size={16} />
                {cost}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current balance:</span>
              <span className="font-medium text-gray-900">{credits}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">After generation:</span>
              <span className={cn(
                'font-medium',
                remainingCredits < 10 ? 'text-amber-600' : 'text-gray-900'
              )}>
                {Math.max(0, remainingCredits)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!canAfford && (
        <div className="mt-3 p-3 bg-red-100 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            Insufficient credits. You need {cost - credits} more credits to proceed.
          </p>
        </div>
      )}

      {canAfford && remainingCredits < 10 && (
        <div className="mt-3 p-3 bg-amber-100 rounded-lg">
          <p className="text-sm text-amber-800 font-medium">
            Warning: This will leave you with low credits ({remainingCredits} remaining).
          </p>
        </div>
      )}
    </div>
  );
}
