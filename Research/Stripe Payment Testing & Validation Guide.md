# Stripe Payment Testing & Validation Guide

## 🎯 Testing Philosophy

**CRITICAL RULE**: Every payment feature must be tested with REAL Stripe test mode integration. No mock payments, no fake webhooks, no simulated responses.

## Step-by-Step Validation Checklist

### ✅ Step 1: Stripe Environment Testing

**After Prompt 1A (Stripe Setup):**

**Environment Variables Verification:**
```bash
# Test Stripe configuration
node -e "
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
stripe.prices.list({ limit: 3 })
  .then(prices => console.log('✅ Stripe connection successful:', prices.data.length, 'prices found'))
  .catch(err => console.error('❌ Stripe connection failed:', err.message));
"
```

**MongoDB Connection Test:**
```bash
# Test MongoDB connection
node -e "
const { MongoClient } = require('mongodb');
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    console.log('✅ MongoDB connection successful');
    client.close();
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));
"
```

**Manual Verification:**
- [ ] Stripe SDK initializes without errors
- [ ] MongoDB connection establishes successfully
- [ ] Environment variables load correctly
- [ ] User schema is properly defined
- [ ] Subscription schema is created

**Red Flags to Watch For:**
- Mock Stripe responses
- Hardcoded price IDs
- Missing environment variables
- Database connection errors

---

**After Prompt 1B (MongoDB Integration):**

**User Management Testing:**
```javascript
// Test in Node.js console or API route
const { createUser, getUserByEmail } = require('./lib/mongodb/users');

// Test user creation
const testUser = await createUser({
  email: 'test@example.com',
  name: 'Test User'
});
console.log('User created:', testUser);

// Test user retrieval
const retrievedUser = await getUserByEmail('test@example.com');
console.log('User retrieved:', retrievedUser);
```

**Credit System Testing:**
```javascript
// Test credit operations
const { deductCredits, getUserCredits } = require('./lib/mongodb/users');

// Check initial credits
const initialCredits = await getUserCredits(testUser._id);
console.log('Initial credits:', initialCredits);

// Deduct credits
const result = await deductCredits(testUser._id, 5);
console.log('Deduction result:', result);

// Verify new balance
const newCredits = await getUserCredits(testUser._id);
console.log('New credits:', newCredits);
```

**Database Verification:**
- [ ] User CRUD operations work correctly
- [ ] Credit deduction is atomic
- [ ] Subscription linking functions properly
- [ ] Database indexes are created
- [ ] Data validation works

---

### ✅ Step 2: Stripe Checkout Testing

**After Prompt 2A (Checkout Session):**

**Real Checkout Session Test:**
```bash
# Test checkout session creation
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"priceId": "price_test_basic_9_99"}'
```

**Expected Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Manual Testing Steps:**
1. [ ] Create checkout session via API
2. [ ] Receive valid Stripe Checkout URL
3. [ ] Navigate to Stripe Checkout page
4. [ ] Verify plan details display correctly
5. [ ] Test with Stripe test card: `4242424242424242`
6. [ ] Complete payment successfully
7. [ ] Verify redirect to success page

**Test Different Scenarios:**
- [ ] Valid plan selection
- [ ] Invalid plan ID
- [ ] Unauthenticated user
- [ ] User with existing subscription
- [ ] Network timeout handling

---

**After Prompt 2B (Pricing Page):**

**UI Component Testing:**
- [ ] Pricing page loads without errors
- [ ] All three plans display correctly ($9.99, $19.99, $29.99)
- [ ] Feature lists are accurate
- [ ] Upgrade buttons work
- [ ] Mobile layout is responsive
- [ ] Current plan is highlighted (if user has subscription)

**Integration Testing:**
- [ ] Clicking upgrade opens checkout
- [ ] Plan selection passes correct price ID
- [ ] Loading states display during checkout creation
- [ ] Error handling shows user-friendly messages

---

### ✅ Step 3: Webhook Processing Testing

**After Prompt 3A (Webhook Handler):**

**Webhook Endpoint Testing:**
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# In another terminal, trigger test events
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

**Webhook Verification:**
- [ ] Webhook signature validation works
- [ ] Subscription created event updates database
- [ ] Payment succeeded event allocates credits
- [ ] Subscription updated event changes plan
- [ ] Payment failed event handles gracefully
- [ ] Database updates are atomic

**Manual Database Verification:**
```javascript
// After webhook processing, check database
const user = await getUserByEmail('test@example.com');
console.log('User subscription status:', user.subscriptionStatus);
console.log('User plan:', user.subscriptionPlan);
console.log('User credits:', user.credits);
```

**Critical Tests:**
- [ ] Real webhook events from Stripe CLI
- [ ] Database updates match webhook data
- [ ] Credit allocation works correctly
- [ ] Error handling prevents data corruption
- [ ] Idempotent processing (duplicate events handled)

---

**After Prompt 3B (Subscription Dashboard):**

**Dashboard Testing:**
- [ ] Current subscription displays correctly
- [ ] Credit balance shows real data
- [ ] Billing history loads from Stripe
- [ ] Plan change options work
- [ ] Customer portal redirect functions

**Customer Portal Test:**
```bash
# Test portal session creation
curl -X POST http://localhost:3000/api/stripe/create-portal-session \
  -H "Authorization: Bearer your-jwt-token"
```

- [ ] Portal session creates successfully
- [ ] Redirects to actual Stripe Customer Portal
- [ ] User can update payment methods
- [ ] Subscription changes sync back to app

---

### ✅ Step 4: Feature Access Control Testing

**After Prompt 4A (Feature Access):**

**Plan Feature Testing:**
```javascript
// Test feature access for different plans
const { checkFeatureAccess } = require('./lib/auth/featureAccess');

// Test free plan limitations
const freeAccess = await checkFeatureAccess('user_id', 'stemSeparation');
console.log('Free plan stem separation:', freeAccess); // Should be false

// Test creator plan features
const creatorAccess = await checkFeatureAccess('creator_user_id', 'stemSeparation');
console.log('Creator plan stem separation:', creatorAccess); // Should be true
```

**Credit Validation Testing:**
```javascript
// Test credit validation
const { validateCreditUsage } = require('./lib/auth/featureAccess');

// Test with sufficient credits
const validUsage = await validateCreditUsage('user_id', 5);
console.log('Valid usage:', validUsage);

// Test with insufficient credits
const invalidUsage = await validateCreditUsage('user_id', 1000);
console.log('Invalid usage:', invalidUsage);
```

**UI Feature Gate Testing:**
- [ ] Free users see upgrade prompts for premium features
- [ ] Paid users can access plan-appropriate features
- [ ] Feature gates display correctly on mobile
- [ ] Upgrade prompts lead to correct checkout

---

**After Prompt 4B (Credit Management):**

**Credit Transaction Testing:**
```javascript
// Test credit deduction
const result = await deductCredits('user_id', 5, 'Music generation', 'gen_123');
console.log('Deduction result:', result);

// Test credit allocation
await allocateMonthlyCredits('user_id', 'creator');

// Test usage analytics
const usage = await getCreditUsage('user_id');
console.log('Usage analytics:', usage);
```

**Real-time Updates Testing:**
- [ ] Credit balance updates immediately after generation
- [ ] Usage analytics display accurate data
- [ ] Low credit warnings appear at correct thresholds
- [ ] Monthly allocation resets properly

---

### ✅ Step 5: Production Testing

**After Prompt 5A (Comprehensive Testing):**

**End-to-End Payment Flow:**
1. [ ] User signs up with Google/Magic Link
2. [ ] Views pricing page
3. [ ] Selects Creator plan ($19.99)
4. [ ] Completes Stripe Checkout with test card
5. [ ] Webhook processes subscription creation
6. [ ] User gains access to Creator features
7. [ ] Credits are allocated (1,500)
8. [ ] User generates music (credits deducted)
9. [ ] User accesses stem separation feature
10. [ ] User views subscription dashboard

**Stripe Test Cards:**
```
# Test successful payment
4242424242424242

# Test declined card
4000000000000002

# Test insufficient funds
4000000000009995

# Test expired card
4000000000000069
```

**Error Scenario Testing:**
- [ ] Payment failure handling
- [ ] Webhook delivery failures
- [ ] Database connection issues
- [ ] Network timeouts
- [ ] Invalid API responses

---

**After Prompt 5B (Production Deployment):**

**Production Readiness Checklist:**
- [ ] Live Stripe keys configured
- [ ] Production webhook endpoints set up
- [ ] MongoDB Atlas production database
- [ ] Error monitoring active (Sentry, LogRocket)
- [ ] Performance monitoring configured
- [ ] Security headers implemented
- [ ] SSL certificates valid

**Live Mode Testing:**
```bash
# Test with live Stripe keys (small amounts)
# Use real credit card for testing
# Verify webhook delivery in production
# Check database updates in production
```

## 🚨 Common Issues to Avoid

### Payment Integration Problems:
- **Issue**: Using mock Stripe responses
- **Solution**: Always test with real Stripe test mode

### Webhook Problems:
- **Issue**: Webhook signature validation failures
- **Solution**: Use correct webhook secret and verify implementation

### Database Problems:
- **Issue**: Non-atomic credit operations
- **Solution**: Use MongoDB transactions for critical operations

### Feature Access Problems:
- **Issue**: Plan restrictions not enforced
- **Solution**: Validate plan access on both frontend and backend

## 🎯 Success Criteria

**Each step is complete when:**
- All Stripe integrations use real test mode
- Webhook processing is reliable and tested
- Database operations are atomic and consistent
- Feature access control works correctly
- Error handling is comprehensive
- Mobile experience is fully functional

**Ready for production when:**
- All test scenarios pass consistently
- Performance meets requirements
- Security measures are validated
- Monitoring systems are active
- Documentation is complete
- Team is trained on operations

## 📋 Final Production Checklist

Before going live:
- [ ] All Stripe test scenarios pass
- [ ] Webhook processing is reliable
- [ ] Database operations are atomic
- [ ] Feature access control works
- [ ] Credit system is accurate
- [ ] Error handling is comprehensive
- [ ] Performance meets SLA
- [ ] Security measures validated
- [ ] Monitoring systems active
- [ ] Backup procedures tested

**Remember**: Payment systems require the highest level of testing and validation. Every feature must work perfectly with real Stripe integration before deployment.
