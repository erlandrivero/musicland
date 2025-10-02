import { ObjectId } from 'mongodb';

// ============================================================================
// User Schema
// ============================================================================
export interface User {
  _id: ObjectId;
  email: string;
  name: string;
  image?: string;
  
  // Authentication
  googleId?: string;
  emailVerified?: Date;
  
  // Stripe Integration
  stripeCustomerId?: string;
  
  // Subscription Information
  subscriptionId?: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | null;
  subscriptionPlan: 'free' | 'basic' | 'creator' | 'team';
  subscriptionPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  
  // Credits System
  credits: number; // Current credit balance
  creditsUsed: number; // Total credits used (lifetime)
  lastCreditAllocation?: Date; // When credits were last allocated
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ============================================================================
// Subscription Schema
// ============================================================================
export interface Subscription {
  _id: ObjectId;
  userId: ObjectId;
  
  // Stripe Data
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  
  // Subscription Details
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'unpaid';
  plan: 'basic' | 'creator' | 'team';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  
  // Billing
  amount: number; // in cents
  currency: string; // 'usd'
  interval: 'month' | 'year';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Credit Transaction Schema
// ============================================================================
export interface CreditTransaction {
  _id: ObjectId;
  userId: ObjectId;
  
  // Transaction Details
  type: 'allocation' | 'usage' | 'refund' | 'bonus';
  amount: number; // positive for allocation/refund, negative for usage
  description: string;
  
  // Related Data
  generationId?: string; // optional, for usage transactions
  subscriptionId?: string; // optional, for allocation transactions
  subscriptionPeriod?: string; // 'YYYY-MM' format
  
  // Balance tracking
  balanceBefore: number;
  balanceAfter: number;
  
  // Metadata
  createdAt: Date;
  metadata?: Record<string, any>; // additional data as needed
}

// ============================================================================
// Music Generation Schema
// ============================================================================
export interface Generation {
  _id: ObjectId;
  userId: ObjectId;
  
  // Generation Details
  prompt: string;
  style?: string;
  generationParameters?: Record<string, any>; // SunoAPI parameters
  
  // Results
  sunoGenerationId?: string; // ID from SunoAPI
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audioUrl?: string; // when completed
  videoUrl?: string; // when completed
  title?: string; // generated title
  tags?: string[]; // generated tags
  
  // Credits
  creditsUsed: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ============================================================================
// Plan Features Configuration
// ============================================================================
export interface PlanFeatures {
  maxCreditsPerMonth: number;
  maxGenerationsPerDay: number;
  advancedEditing: boolean;
  stemSeparation: boolean;
  collaboration: boolean;
  priorityQueue: boolean;
  commercialLicense: boolean;
  apiAccess: boolean;
  customModels: boolean;
}

export const PLAN_FEATURES: Record<'free' | 'basic' | 'creator' | 'team', PlanFeatures> = {
  free: {
    maxCreditsPerMonth: 50, // One-time only, no renewal
    maxGenerationsPerDay: 5,
    advancedEditing: false,
    stemSeparation: false,
    collaboration: false,
    priorityQueue: false,
    commercialLicense: false,
    apiAccess: false,
    customModels: false,
  },
  basic: {
    maxCreditsPerMonth: 500,
    maxGenerationsPerDay: 50,
    advancedEditing: true,
    stemSeparation: false,
    collaboration: false,
    priorityQueue: false,
    commercialLicense: true,
    apiAccess: false,
    customModels: false,
  },
  creator: {
    maxCreditsPerMonth: 1500,
    maxGenerationsPerDay: 150,
    advancedEditing: true,
    stemSeparation: true,
    collaboration: false,
    priorityQueue: true,
    commercialLicense: true,
    apiAccess: true,
    customModels: false,
  },
  team: {
    maxCreditsPerMonth: 5000,
    maxGenerationsPerDay: 500,
    advancedEditing: true,
    stemSeparation: true,
    collaboration: true,
    priorityQueue: true,
    commercialLicense: true,
    apiAccess: true,
    customModels: true,
  },
};

// ============================================================================
// Pricing Configuration
// ============================================================================
export interface PricingPlan {
  id: 'basic' | 'creator' | 'team';
  name: string;
  price: number;
  priceId: string;
  productId: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_BASIC || '',
    productId: process.env.STRIPE_PRODUCT_BASIC || '',
    credits: 500,
    features: [
      '500 credits monthly',
      'Commercial licensing',
      'Standard quality',
      'Advanced editing tools',
      'Email support',
    ],
  },
  {
    id: 'creator',
    name: 'Creator Plan',
    price: 19.99,
    priceId: process.env.STRIPE_PRICE_CREATOR || '',
    productId: process.env.STRIPE_PRODUCT_CREATOR || '',
    credits: 1500,
    popular: true,
    features: [
      '1,500 credits monthly',
      'Commercial licensing',
      'High quality generation',
      'Stem separation',
      'Advanced editing tools',
      'Priority queue',
      'API access',
      'Priority support',
    ],
  },
  {
    id: 'team',
    name: 'Team Plan',
    price: 29.99,
    priceId: process.env.STRIPE_PRICE_TEAM || '',
    productId: process.env.STRIPE_PRODUCT_TEAM || '',
    credits: 5000,
    features: [
      '5,000 credits monthly',
      'Commercial licensing',
      'Premium quality',
      'Team collaboration',
      'Stem separation',
      'Advanced analytics',
      'Custom models',
      'API access',
      'Priority support',
      'Custom integrations',
    ],
  },
];

// ============================================================================
// Credit Cost Configuration
// ============================================================================
export const CREDIT_COSTS = {
  standard_generation: 5,
  extended_generation: 10,
  custom_mode: 8,
  instrumental_only: 3,
  stem_separation: 15,
  voice_cloning: 20,
  batch_generation: 25,
} as const;

// ============================================================================
// Type Helpers
// ============================================================================
export type SubscriptionPlan = 'free' | 'basic' | 'creator' | 'team';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | null;
export type TransactionType = 'allocation' | 'usage' | 'refund' | 'bonus';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';
