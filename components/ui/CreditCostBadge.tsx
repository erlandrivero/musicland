'use client';

import { Coins } from 'lucide-react';
import { CREDIT_COSTS, type FeatureType } from '@/types/suno-extended';

interface CreditCostBadgeProps {
  feature: FeatureType;
  className?: string;
  showIcon?: boolean;
}

export function CreditCostBadge({ 
  feature, 
  className = '',
  showIcon = true 
}: CreditCostBadgeProps) {
  const cost = CREDIT_COSTS[feature];
  
  // Color based on cost
  const getColorClasses = () => {
    if (cost <= 2) return 'bg-green-100 text-green-700 border-green-200';
    if (cost <= 5) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (cost <= 10) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getColorClasses()} ${className}`}>
      {showIcon && <Coins className="w-3 h-3" />}
      {cost} {cost > 1 ? 'credits' : 'credit'}
    </span>
  );
}
