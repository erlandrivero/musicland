'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';

// TypeScript interfaces
export interface CreditsData {
  credits: number;
  totalCredits: number;
  creditsUsed: number;
}

export interface CreditUsageRecord {
  id: string;
  type: 'generation' | 'lyrics' | 'stem_separation';
  cost: number;
  timestamp: string;
  description: string;
}

// Credit costs based on SunoAPI pricing (10 credits per generation)
export const CREDIT_COSTS = {
  STANDARD_GENERATION: 10,  // Standard music generation
  EXTENDED_GENERATION: 10,  // Extended generation (same cost)
  CUSTOM_MODE: 10,          // Custom mode (same cost)
  INSTRUMENTAL: 10,         // Instrumental (same cost)
  LYRICS_ONLY: 2,           // Lyrics generation only
  STEM_SEPARATION: 10,      // Stem separation
} as const;

// Low credit threshold
export const LOW_CREDIT_THRESHOLD = 10;

/**
 * Custom hook for managing credits with real SunoAPI integration
 * Features:
 * - Fetches real credit balance from API
 * - 5-minute cache with background refresh
 * - Automatic polling every 30 seconds when active
 * - Optimistic updates with rollback
 */
export function useCredits() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = status === 'authenticated';

  // Fetch credits from API
  const {
    data: creditsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CreditsData>({
    queryKey: ['credits'],
    queryFn: async () => {
      // Add cache buster to force fresh data
      const response = await fetch(`/api/credits?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch credits');
      }
      
      return response.json();
    },
    enabled: isAuthenticated,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache at all
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
  });

  // Mutation for optimistic credit updates
  const updateCreditsMutation = useMutation({
    mutationFn: async (newCredits: number) => {
      // This is for optimistic updates only
      // Actual credit deduction happens on the server
      return newCredits;
    },
    onMutate: async (newCredits) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['credits'] });

      // Snapshot previous value
      const previousCredits = queryClient.getQueryData<CreditsData>(['credits']);

      // Optimistically update
      if (previousCredits) {
        queryClient.setQueryData<CreditsData>(['credits'], {
          ...previousCredits,
          credits: newCredits,
          creditsUsed: previousCredits.totalCredits - newCredits,
        });
      }

      return { previousCredits };
    },
    onError: (err, newCredits, context) => {
      // Rollback on error
      if (context?.previousCredits) {
        queryClient.setQueryData(['credits'], context.previousCredits);
      }
    },
    onSettled: () => {
      // Refetch to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  // Check if user has sufficient credits
  const hasCredits = useCallback((cost: number): boolean => {
    return (creditsData?.credits ?? 0) >= cost;
  }, [creditsData?.credits]);

  // Check if credits are low
  const isLowCredits = useCallback((): boolean => {
    return (creditsData?.credits ?? 0) < LOW_CREDIT_THRESHOLD;
  }, [creditsData?.credits]);

  // Deduct credits optimistically
  const deductCredits = useCallback((cost: number) => {
    if (creditsData) {
      const newCredits = Math.max(0, creditsData.credits - cost);
      updateCreditsMutation.mutate(newCredits);
    }
  }, [creditsData, updateCreditsMutation]);

  // Refresh credits from API
  const refreshCredits = useCallback(async () => {
    console.log('[Credits] Refreshing credits...');
    await refetch();
    console.log('[Credits] Credits refreshed');
  }, [refetch]);

  return {
    // Data
    credits: creditsData?.credits ?? 0,
    totalCredits: creditsData?.totalCredits ?? 0,
    creditsUsed: creditsData?.creditsUsed ?? 0,
    
    // Status
    isLoading,
    isError,
    error: error as Error | null,
    isAuthenticated,
    
    // Computed values
    hasCredits,
    isLowCredits: isLowCredits(),
    percentageUsed: creditsData 
      ? Math.round((creditsData.creditsUsed / creditsData.totalCredits) * 100)
      : 0,
    
    // Actions
    deductCredits,
    refreshCredits,
  };
}

/**
 * Hook for managing credit usage history
 * Stores usage in localStorage for client-side tracking
 */
export function useCreditHistory() {
  const STORAGE_KEY = 'credit_usage_history';
  const MAX_HISTORY_ITEMS = 100;

  // Get usage history from localStorage
  const getHistory = useCallback((): CreditUsageRecord[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse credit history:', error);
      return [];
    }
  }, []);

  // Add usage record
  const addUsage = useCallback((
    type: CreditUsageRecord['type'],
    cost: number,
    description: string
  ) => {
    if (typeof window === 'undefined') return;

    const history = getHistory();
    const newRecord: CreditUsageRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      cost,
      timestamp: new Date().toISOString(),
      description,
    };

    const updatedHistory = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save credit history:', error);
    }
  }, [getHistory]);

  // Clear history
  const clearHistory = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get usage statistics
  const getStats = useCallback(() => {
    const history = getHistory();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyUsage = history
      .filter(record => new Date(record.timestamp) > oneDayAgo)
      .reduce((sum, record) => sum + record.cost, 0);

    const weeklyUsage = history
      .filter(record => new Date(record.timestamp) > oneWeekAgo)
      .reduce((sum, record) => sum + record.cost, 0);

    const totalUsage = history.reduce((sum, record) => sum + record.cost, 0);

    const usageByType = history.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + record.cost;
      return acc;
    }, {} as Record<string, number>);

    return {
      dailyUsage,
      weeklyUsage,
      totalUsage,
      usageByType,
      recordCount: history.length,
    };
  }, [getHistory]);

  return {
    getHistory,
    addUsage,
    clearHistory,
    getStats,
  };
}

/**
 * Hook for calculating credit costs
 */
export function useCreditCalculator() {
  const calculateCost = useCallback((
    generationType: keyof typeof CREDIT_COSTS,
    quantity: number = 1
  ): number => {
    return CREDIT_COSTS[generationType] * quantity;
  }, []);

  const canAfford = useCallback((
    currentCredits: number,
    generationType: keyof typeof CREDIT_COSTS,
    quantity: number = 1
  ): boolean => {
    const cost = calculateCost(generationType, quantity);
    return currentCredits >= cost;
  }, [calculateCost]);

  return {
    calculateCost,
    canAfford,
    CREDIT_COSTS,
  };
}
