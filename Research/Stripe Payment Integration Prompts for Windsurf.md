# Stripe Payment Integration Prompts for Windsurf

## 🎯 Payment System Overview

**Pricing Structure**: 3 tiers with Stripe subscriptions
**Database**: MongoDB for user data and subscription management
**Payment Flow**: Stripe Checkout → Webhook → MongoDB update → Feature access

---

## Step 1: Stripe Setup and Configuration

### Prompt 1A: Stripe Environment Setup
```
Set up Stripe payment integration for the AI music platform with MongoDB:

STRIPE CONFIGURATION:
- Install Stripe dependencies: stripe, @stripe/stripe-js
- Configure Stripe with both test and live keys
- Set up Stripe webhook endpoint for subscription events
- Create Stripe customer management system

ENVIRONMENT VARIABLES:
Add these to .env.local:
```
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/aimusic
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/aimusic

# Stripe Price IDs (will be created in Stripe Dashboard)
STRIPE_PRICE_BASIC=price_basic_9_99
STRIPE_PRICE_CREATOR=price_creator_19_99
STRIPE_PRICE_TEAM=price_team_29_99
```

MONGODB SCHEMA SETUP:
Create user schema with subscription fields:
```typescript
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  image?: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | null;
  subscriptionPlan: 'free' | 'basic' | 'creator' | 'team';
  subscriptionPeriodEnd?: Date;
  credits: number;
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Subscription {
  _id: ObjectId;
  userId: ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  plan: 'basic' | 'creator' | 'team';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

STRIPE PRODUCTS SETUP:
Create these products in Stripe Dashboard:
1. Basic Plan - $9.99/month - 500 credits monthly
2. Creator Plan - $19.99/month - 1,500 credits monthly  
3. Team Plan - $29.99/month - 5,000 credits monthly + collaboration features

API ROUTES TO CREATE:
- /api/stripe/create-checkout-session
- /api/stripe/create-portal-session
- /api/stripe/webhooks
- /api/subscription/status
- /api/subscription/cancel

Include proper TypeScript types and MongoDB connection setup.
```

### Testing Step 1A:
**Verify**: 
- Stripe SDK initializes correctly
- MongoDB connection works
- Environment variables load properly
- User schema is defined correctly

---

### Prompt 1B: MongoDB Integration and User Management
```
Create comprehensive MongoDB integration for user and subscription management:

MONGODB CONNECTION:
- Set up MongoDB connection with connection pooling
- Create database models for User and Subscription
- Implement CRUD operations for user management
- Add indexes for performance optimization

USER MANAGEMENT FUNCTIONS:
```typescript
// lib/mongodb/users.ts
export async function createUser(userData: {
  email: string;
  name: string;
  image?: string;
}) {
  // Create user with default free plan
  // Initialize with free tier credits (50)
  // Return user object
}

export async function getUserByEmail(email: string) {
  // Fetch user with subscription details
  // Include current plan and credits
  // Return null if not found
}

export async function updateUserSubscription(userId: string, subscriptionData: {
  stripeCustomerId: string;
  subscriptionId: string;
  status: string;
  plan: string;
  periodEnd: Date;
}) {
  // Update user subscription status
  // Reset credits based on new plan
  // Update subscription collection
}

export async function getUserCredits(userId: string) {
  // Get current credit balance
  // Calculate credits used this period
  // Return credit information
}

export async function deductCredits(userId: string, amount: number) {
  // Deduct credits for music generation
  // Validate sufficient credits available
  // Update user record atomically
}
```

SUBSCRIPTION MANAGEMENT:
```typescript
// lib/mongodb/subscriptions.ts
export async function createSubscription(subscriptionData: {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  priceId: string;
  status: string;
}) {
  // Create subscription record
  // Link to user account
  // Set up credit allocation
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string,
  periodEnd?: Date
) {
  // Update subscription status
  // Handle cancellations and renewals
  // Manage credit allocations
}

export async function getActiveSubscription(userId: string) {
  // Get user's active subscription
  // Include plan details and status
  // Return null if no active subscription
}
```

CREDIT SYSTEM:
- Free Plan: 50 credits (one-time, no renewal)
- Basic Plan ($9.99): 500 credits monthly
- Creator Plan ($19.99): 1,500 credits monthly
- Team Plan ($29.99): 5,000 credits monthly

MONGODB INDEXES:
- User email (unique)
- User stripeCustomerId
- Subscription stripeSubscriptionId
- Subscription userId + status

Include proper error handling, validation, and TypeScript types throughout.
```

### Testing Step 1B:
**Verify**:
- MongoDB connection works
- User CRUD operations function correctly
- Subscription management works
- Credit system calculates properly
- Database indexes are created

---

## Step 2: Stripe Checkout Integration

### Prompt 2A: Checkout Session Creation
```
Create Stripe Checkout integration for subscription purchases:

CHECKOUT SESSION API:
```typescript
// app/api/stripe/create-checkout-session/route.ts
export async function POST(request: Request) {
  // Validate user authentication
  // Get price ID from request body
  // Create or retrieve Stripe customer
  // Create checkout session with:
  //   - Subscription mode
  //   - Success/cancel URLs
  //   - Customer email prefilled
  //   - Metadata with user ID
  // Return checkout session URL
}
```

PRICING CONFIGURATION:
```typescript
const PRICING_PLANS = {
  basic: {
    priceId: process.env.STRIPE_PRICE_BASIC,
    name: 'Basic Plan',
    price: 9.99,
    credits: 500,
    features: [
      '500 credits monthly',
      'Commercial licensing',
      'Standard quality',
      'Email support'
    ]
  },
  creator: {
    priceId: process.env.STRIPE_PRICE_CREATOR,
    name: 'Creator Plan', 
    price: 19.99,
    credits: 1500,
    features: [
      '1,500 credits monthly',
      'Commercial licensing',
      'High quality generation',
      'Advanced editing tools',
      'Priority support'
    ]
  },
  team: {
    priceId: process.env.STRIPE_PRICE_TEAM,
    name: 'Team Plan',
    price: 29.99,
    credits: 5000,
    features: [
      '5,000 credits monthly',
      'Commercial licensing',
      'Premium quality',
      'Team collaboration',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ]
  }
};
```

CHECKOUT FLOW:
1. User clicks "Upgrade to [Plan]" button
2. API creates Stripe customer (if new)
3. Create checkout session with plan details
4. Redirect to Stripe Checkout
5. Handle success/cancel redirects
6. Webhook processes subscription creation

ERROR HANDLING:
- Invalid plan selection
- User already has active subscription
- Stripe API errors
- Database connection issues
- Authentication failures

SECURITY MEASURES:
- Validate user authentication
- Sanitize input parameters
- Rate limiting on checkout creation
- CSRF protection
- Secure webhook validation

Include comprehensive TypeScript types and proper error responses.
```

### Testing Step 2A:
**Verify**:
- Checkout session creates successfully
- Redirects to actual Stripe Checkout page
- Plan details display correctly
- Error handling works for invalid requests
- User authentication is enforced

---

### Prompt 2B: Pricing Page and Upgrade UI
```
Create a professional pricing page and upgrade interface:

PRICING PAGE COMPONENT:
```typescript
// components/pricing/PricingPage.tsx
export default function PricingPage() {
  // Display 3 pricing tiers in card layout
  // Highlight most popular plan (Creator)
  // Show feature comparisons
  // Include FAQ section
  // Mobile-responsive design
}
```

PRICING CARD DESIGN:
- Clean, modern card layout
- Plan name and price prominently displayed
- Feature list with checkmarks
- "Current Plan" indicator for active subscriptions
- "Upgrade" or "Get Started" buttons
- Annual/monthly toggle (if offering annual discounts)

UPGRADE FLOW COMPONENTS:
```typescript
// components/subscription/UpgradeModal.tsx
export default function UpgradeModal({ 
  currentPlan, 
  targetPlan, 
  onClose 
}) {
  // Show plan comparison
  // Display price difference
  // Confirm upgrade action
  // Handle checkout redirect
}

// components/subscription/PlanSelector.tsx
export default function PlanSelector({ 
  currentPlan, 
  onPlanSelect 
}) {
  // Radio button selection
  // Plan details display
  // Price calculation
  // Feature comparison
}
```

SUBSCRIPTION STATUS DISPLAY:
```typescript
// components/subscription/SubscriptionStatus.tsx
export default function SubscriptionStatus() {
  // Current plan display
  // Credits remaining
  // Next billing date
  // Manage subscription button
  // Usage analytics
}
```

MOBILE-FIRST DESIGN:
- Touch-friendly buttons (min 44px height)
- Responsive card layout
- Swipeable plan comparison
- Bottom sheet modals on mobile
- Optimized for portrait orientation

PROFESSIONAL FEATURES:
- Loading states during checkout
- Success/error notifications
- Plan comparison tooltips
- Usage recommendations
- Upgrade incentives based on usage

INTEGRATION POINTS:
- Real-time subscription status
- Credit balance updates
- Plan feature enforcement
- Billing history access

Include proper TypeScript types, accessibility features, and smooth animations.
```

### Testing Step 2B:
**Verify**:
- Pricing page displays correctly
- Plan selection works properly
- Upgrade flow is smooth
- Mobile interface is touch-friendly
- Real subscription data displays

---

## Step 3: Webhook Processing and Subscription Management

### Prompt 3A: Stripe Webhook Handler
```
Create comprehensive Stripe webhook processing for subscription events:

WEBHOOK ENDPOINT:
```typescript
// app/api/stripe/webhooks/route.ts
export async function POST(request: Request) {
  // Verify webhook signature
  // Parse Stripe event
  // Handle different event types:
  //   - customer.subscription.created
  //   - customer.subscription.updated  
  //   - customer.subscription.deleted
  //   - invoice.payment_succeeded
  //   - invoice.payment_failed
  // Update MongoDB records
  // Return 200 status
}
```

EVENT HANDLERS:
```typescript
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Create subscription record in MongoDB
  // Update user plan and credits
  // Send welcome email
  // Log subscription creation
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription status
  // Handle plan changes
  // Update credit allocations
  // Notify user of changes
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Mark subscription as canceled
  // Downgrade user to free plan
  // Preserve remaining credits until period end
  // Send cancellation confirmation
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Renew subscription period
  // Reset monthly credits
  // Update payment history
  // Send receipt email
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Mark subscription as past_due
  // Send payment failure notification
  // Provide retry payment options
  // Handle dunning management
}
```

CREDIT MANAGEMENT:
```typescript
async function allocateCredits(userId: string, plan: string) {
  const creditAllocations = {
    free: 0, // No renewal for free plan
    basic: 500,
    creator: 1500,
    team: 5000
  };
  
  // Reset monthly credits
  // Preserve unused credits (up to limit)
  // Update user record
  // Log credit allocation
}
```

WEBHOOK SECURITY:
- Verify Stripe webhook signature
- Validate event authenticity
- Idempotent event processing
- Rate limiting protection
- Error logging and monitoring

DATABASE OPERATIONS:
- Atomic updates for subscription changes
- Transaction handling for credit allocations
- Proper error handling and rollback
- Audit logging for all changes

Include comprehensive error handling and logging throughout.
```

### Testing Step 3A:
**Verify**:
- Webhook receives real Stripe events
- Subscription creation updates database
- Credit allocation works correctly
- Payment success/failure handling
- Database updates are atomic

---

### Prompt 3B: Subscription Management Dashboard
```
Create a comprehensive subscription management interface:

SUBSCRIPTION DASHBOARD:
```typescript
// components/subscription/SubscriptionDashboard.tsx
export default function SubscriptionDashboard() {
  // Current plan overview
  // Credit usage analytics
  // Billing history
  // Payment method management
  // Plan upgrade/downgrade options
}
```

CURRENT PLAN DISPLAY:
- Plan name and price
- Credits remaining this period
- Next billing date
- Subscription status indicator
- Usage statistics and trends

BILLING MANAGEMENT:
```typescript
// components/subscription/BillingManagement.tsx
export default function BillingManagement() {
  // Payment method display
  // Update payment method
  // Download invoices
  // Billing address management
  // Tax information
}
```

PLAN CHANGE INTERFACE:
```typescript
// components/subscription/PlanChangeModal.tsx
export default function PlanChangeModal({ 
  currentPlan, 
  onPlanChange 
}) {
  // Plan comparison table
  // Prorated pricing calculation
  // Immediate vs. end-of-period changes
  // Confirmation flow
}
```

CUSTOMER PORTAL INTEGRATION:
```typescript
// app/api/stripe/create-portal-session/route.ts
export async function POST(request: Request) {
  // Validate user authentication
  // Get user's Stripe customer ID
  // Create Stripe Customer Portal session
  // Return portal URL for redirect
}
```

USAGE ANALYTICS:
- Credit usage over time
- Generation history
- Popular music styles
- Monthly/weekly trends
- Recommendations for plan optimization

CANCELLATION FLOW:
```typescript
// components/subscription/CancellationFlow.tsx
export default function CancellationFlow() {
  // Cancellation reasons survey
  // Retention offers
  // Immediate vs. end-of-period cancellation
  // Data export options
  // Feedback collection
}
```

MOBILE OPTIMIZATION:
- Bottom sheet navigation
- Touch-friendly controls
- Responsive data tables
- Swipe gestures for navigation
- Optimized for one-handed use

PROFESSIONAL FEATURES:
- Real-time data updates
- Smooth transitions
- Loading states
- Error handling
- Success notifications

Include proper TypeScript types and comprehensive error handling.
```

### Testing Step 3B:
**Verify**:
- Dashboard displays real subscription data
- Plan changes work correctly
- Customer portal redirects properly
- Billing history is accurate
- Mobile interface is fully functional

---

## Step 4: Feature Access Control and Credit System

### Prompt 4A: Plan-Based Feature Access Control
```
Implement comprehensive feature access control based on subscription plans:

FEATURE ACCESS MIDDLEWARE:
```typescript
// lib/auth/featureAccess.ts
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

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  free: {
    maxCreditsPerMonth: 50, // One-time only
    maxGenerationsPerDay: 5,
    advancedEditing: false,
    stemSeparation: false,
    collaboration: false,
    priorityQueue: false,
    commercialLicense: false,
    apiAccess: false,
    customModels: false
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
    customModels: false
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
    customModels: false
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
    customModels: true
  }
};

export async function checkFeatureAccess(
  userId: string, 
  feature: keyof PlanFeatures
): Promise<boolean> {
  // Get user's current plan
  // Check feature availability
  // Return access permission
}

export async function validateCreditUsage(
  userId: string, 
  creditsRequired: number
): Promise<{ allowed: boolean; reason?: string }> {
  // Check current credit balance
  // Validate daily generation limits
  // Return usage permission
}
```

FEATURE GATES:
```typescript
// components/ui/FeatureGate.tsx
export default function FeatureGate({ 
  feature, 
  plan, 
  children, 
  fallback 
}) {
  // Check if user's plan includes feature
  // Show upgrade prompt if not available
  // Render children if access granted
}

// Usage example:
<FeatureGate feature="stemSeparation" plan={userPlan}>
  <StemSeparationControls />
</FeatureGate>
```

API ROUTE PROTECTION:
```typescript
// lib/middleware/planValidation.ts
export function requirePlan(requiredPlan: string) {
  return async (req: Request, userId: string) => {
    const user = await getUserById(userId);
    const hasAccess = validatePlanAccess(user.subscriptionPlan, requiredPlan);
    
    if (!hasAccess) {
      throw new Error('Upgrade required for this feature');
    }
    
    return user;
  };
}
```

CREDIT VALIDATION:
```typescript
// app/api/music/generate/route.ts
export async function POST(request: Request) {
  // Validate user authentication
  // Check credit requirements for generation type
  // Validate daily generation limits
  // Process generation if allowed
  // Deduct credits atomically
  // Return generation result or upgrade prompt
}
```

UPGRADE PROMPTS:
```typescript
// components/subscription/UpgradePrompt.tsx
export default function UpgradePrompt({ 
  feature, 
  currentPlan, 
  onUpgrade 
}) {
  // Explain feature benefits
  // Show plan comparison
  // Highlight value proposition
  // Direct upgrade flow
}
```

Include proper TypeScript types and comprehensive error handling.
```

### Testing Step 4A:
**Verify**:
- Feature access control works correctly
- Credit validation prevents overuse
- Upgrade prompts appear appropriately
- API routes enforce plan restrictions
- Database updates are atomic

---

### Prompt 4B: Credit Management and Usage Tracking
```
Create comprehensive credit management and usage tracking system:

CREDIT TRACKING SYSTEM:
```typescript
// lib/credits/creditManager.ts
export interface CreditTransaction {
  _id: ObjectId;
  userId: ObjectId;
  type: 'allocation' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  generationId?: string;
  subscriptionPeriod: string; // YYYY-MM format
  createdAt: Date;
}

export async function deductCredits(
  userId: string, 
  amount: number, 
  description: string,
  generationId?: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  // Start MongoDB transaction
  // Check current credit balance
  // Validate sufficient credits
  // Deduct credits atomically
  // Log credit transaction
  // Return new balance
}

export async function allocateMonthlyCredits(
  userId: string, 
  plan: string
): Promise<void> {
  // Calculate credit allocation for plan
  // Check if already allocated this month
  // Add credits to user balance
  // Log allocation transaction
  // Handle credit rollover (max 2x monthly allocation)
}

export async function getCreditUsage(
  userId: string, 
  period?: string
): Promise<{
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  dailyUsage: Array<{ date: string; credits: number }>;
  monthlyUsage: Array<{ month: string; credits: number }>;
}> {
  // Aggregate credit transactions
  // Calculate usage statistics
  // Return comprehensive usage data
}
```

CREDIT DISPLAY COMPONENTS:
```typescript
// components/credits/CreditBalance.tsx
export default function CreditBalance({ userId }) {
  // Real-time credit balance
  // Usage progress bar
  // Next allocation date
  // Low credit warnings
}

// components/credits/CreditHistory.tsx
export default function CreditHistory({ userId }) {
  // Paginated transaction history
  // Filter by transaction type
  // Export functionality
  // Usage analytics charts
}

// components/credits/UsageAnalytics.tsx
export default function UsageAnalytics({ userId }) {
  // Daily/weekly/monthly usage charts
  // Generation type breakdown
  // Efficiency recommendations
  // Plan optimization suggestions
}
```

CREDIT COST CALCULATOR:
```typescript
const CREDIT_COSTS = {
  standard_generation: 5,
  extended_generation: 10,
  custom_mode: 8,
  instrumental_only: 3,
  stem_separation: 15,
  voice_cloning: 20,
  batch_generation: 25
};

export function calculateCreditCost(
  generationType: string,
  options: GenerationOptions
): number {
  // Base cost for generation type
  // Additional costs for premium features
  // Plan-based discounts
  // Return total credit cost
}
```

USAGE LIMITS AND WARNINGS:
```typescript
// components/credits/UsageLimits.tsx
export default function UsageLimits({ user }) {
  // Daily generation limit progress
  // Monthly credit usage
  // Approaching limit warnings
  // Upgrade recommendations
}
```

CREDIT REFUND SYSTEM:
```typescript
// lib/credits/refundManager.ts
export async function processRefund(
  userId: string,
  generationId: string,
  reason: string
): Promise<{ success: boolean; refundAmount: number }> {
  // Validate refund eligibility
  // Calculate refund amount
  // Add credits back to balance
  // Log refund transaction
  // Notify user of refund
}
```

REAL-TIME UPDATES:
```typescript
// hooks/useCredits.ts
export function useCredits(userId: string) {
  // React Query for credit data
  // Real-time balance updates
  // Optimistic updates for usage
  // Error handling and retry logic
}
```

MONGODB AGGREGATION PIPELINES:
```typescript
// Efficient credit usage queries
export async function getCreditAnalytics(userId: string) {
  // Aggregate daily usage
  // Calculate monthly trends
  // Generate usage insights
  // Return analytics data
}
```

Include comprehensive error handling, transaction safety, and performance optimization.
```

### Testing Step 4B:
**Verify**:
- Credit deduction works atomically
- Usage tracking is accurate
- Real-time updates function properly
- Analytics display correct data
- Refund system processes correctly

---

## Step 5: Testing and Production Deployment

### Prompt 5A: Comprehensive Payment Testing
```
Create comprehensive testing suite for payment integration:

STRIPE TEST SCENARIOS:
```typescript
// tests/stripe/payment.test.ts
describe('Stripe Payment Integration', () => {
  // Test successful subscription creation
  // Test payment failure handling
  // Test webhook processing
  // Test plan upgrades/downgrades
  // Test subscription cancellation
});
```

TEST PAYMENT METHODS:
Use Stripe test cards for comprehensive testing:
- 4242424242424242 (Visa - Success)
- 4000000000000002 (Card declined)
- 4000000000009995 (Insufficient funds)
- 4000000000000069 (Expired card)
- 4000000000000341 (Attach fails)

WEBHOOK TESTING:
```bash
# Install Stripe CLI for webhook testing
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Test webhook events
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

INTEGRATION TESTS:
```typescript
// tests/integration/subscription.test.ts
describe('Subscription Flow', () => {
  test('Complete subscription purchase flow', async () => {
    // Create test user
    // Initiate checkout session
    // Simulate successful payment
    // Verify webhook processing
    // Check database updates
    // Validate feature access
  });
  
  test('Credit allocation and usage', async () => {
    // Subscribe user to plan
    // Verify credit allocation
    // Test credit deduction
    // Check usage limits
    // Validate balance updates
  });
});
```

MONGODB TESTING:
```typescript
// tests/database/subscription.test.ts
describe('MongoDB Subscription Operations', () => {
  // Test user creation and updates
  // Test subscription CRUD operations
  // Test credit transactions
  // Test data consistency
  // Test concurrent operations
});
```

ERROR SCENARIO TESTING:
- Network failures during checkout
- Webhook delivery failures
- Database connection issues
- Invalid payment methods
- Subscription conflicts

PERFORMANCE TESTING:
- Concurrent checkout sessions
- High-volume webhook processing
- Credit deduction under load
- Database query optimization
- Memory usage monitoring

SECURITY TESTING:
- Webhook signature validation
- API endpoint authentication
- SQL injection prevention
- XSS protection
- Rate limiting effectiveness

Include automated test scripts and manual testing checklists.
```

### Testing Step 5A:
**Verify**:
- All Stripe test scenarios pass
- Webhook processing is reliable
- Database operations are atomic
- Error handling is comprehensive
- Performance meets requirements

---

### Prompt 5B: Production Deployment and Monitoring
```
Prepare payment system for production deployment with monitoring:

PRODUCTION ENVIRONMENT SETUP:
```bash
# Production environment variables
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aimusic_prod

# Stripe Price IDs (create in live mode)
STRIPE_PRICE_BASIC=price_live_basic_9_99
STRIPE_PRICE_CREATOR=price_live_creator_19_99
STRIPE_PRICE_TEAM=price_live_team_29_99
```

STRIPE LIVE MODE SETUP:
1. Create live products and prices in Stripe Dashboard
2. Configure live webhook endpoints
3. Set up payment method types
4. Configure tax settings
5. Set up customer portal

MONITORING AND LOGGING:
```typescript
// lib/monitoring/paymentLogger.ts
export function logPaymentEvent(
  event: string,
  data: any,
  userId?: string
) {
  // Log to monitoring service (DataDog, LogRocket, etc.)
  // Include relevant metadata
  // Set appropriate log levels
  // Track payment metrics
}

// Webhook monitoring
export function monitorWebhookHealth() {
  // Track webhook delivery success rate
  // Monitor processing times
  // Alert on failures
  // Track event types
}
```

ERROR MONITORING:
```typescript
// lib/monitoring/errorTracking.ts
export function trackPaymentError(
  error: Error,
  context: {
    userId?: string;
    stripeEventId?: string;
    operation: string;
  }
) {
  // Send to error tracking service
  // Include stack trace and context
  // Set up alerts for critical errors
  // Track error patterns
}
```

PERFORMANCE MONITORING:
- Payment processing times
- Database query performance
- Webhook processing latency
- Credit calculation efficiency
- User experience metrics

BUSINESS METRICS TRACKING:
```typescript
// lib/analytics/businessMetrics.ts
export function trackSubscriptionMetrics() {
  // Monthly recurring revenue (MRR)
  // Customer lifetime value (CLV)
  // Churn rate by plan
  // Conversion rates
  // Credit usage patterns
}
```

BACKUP AND RECOVERY:
- Automated MongoDB backups
- Stripe data synchronization
- Disaster recovery procedures
- Data retention policies
- GDPR compliance measures

SECURITY MEASURES:
- SSL/TLS encryption
- PCI compliance validation
- Webhook signature verification
- API rate limiting
- Fraud detection integration

DEPLOYMENT CHECKLIST:
- [ ] Live Stripe keys configured
- [ ] Webhook endpoints verified
- [ ] Database migrations completed
- [ ] Monitoring systems active
- [ ] Error tracking configured
- [ ] Performance baselines established
- [ ] Security measures validated
- [ ] Backup systems tested

ROLLBACK PROCEDURES:
- Database rollback scripts
- Feature flag toggles
- Emergency contact procedures
- Incident response plan
- Customer communication templates

Include comprehensive documentation for operations team.
```

### Testing Step 5B:
**Verify**:
- Production environment configured correctly
- Live payments process successfully
- Monitoring systems capture all events
- Error tracking identifies issues
- Performance meets SLA requirements

---

## 🔧 Professional Development Guidelines

### Payment Security Standards:
- PCI DSS compliance requirements
- Secure webhook signature validation
- Encrypted data transmission
- Secure API key management
- Regular security audits

### Testing Requirements:
- All payment flows tested with real Stripe test mode
- Webhook processing validated with actual events
- Database transactions tested for atomicity
- Error scenarios comprehensively covered
- Performance benchmarks established

### MongoDB Best Practices:
- Proper indexing for query performance
- Atomic operations for critical updates
- Connection pooling for scalability
- Backup and recovery procedures
- Data validation and sanitization

### Production Readiness:
- Comprehensive error handling
- Real-time monitoring and alerting
- Performance optimization
- Security measures implemented
- Documentation complete

Each step must be fully tested with real Stripe integration before proceeding. Focus on creating a secure, reliable payment system that provides excellent user experience.
