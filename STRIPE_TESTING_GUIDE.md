# Stripe Payment Integration - Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
- ✅ Environment variables configured in `.env.local`
- ✅ Stripe products created (Basic, Creator, Team)
- ✅ MongoDB connection active
- ✅ Development server running

---

## Step 1: Install Stripe CLI

### Windows (PowerShell)
```powershell
# Using Scoop
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases/latest
```

### Verify Installation
```bash
stripe --version
```

---

## Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with Stripe.

---

## Step 3: Forward Webhooks to Local Development

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhooks
```

**Important:** Keep this terminal window open! It will display:
- Your webhook signing secret (starts with `whsec_`)
- All webhook events as they arrive

**Update `.env.local`** with the webhook secret shown:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## Step 4: Test Checkout Flow

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Navigate to Pricing Page
```
http://localhost:3000/pricing
```

### 4.3 Sign In (if not already)
- Use Google OAuth or Magic Link

### 4.4 Select a Plan
- Click "Get Started" on any plan (Basic, Creator, or Team)

### 4.5 Complete Stripe Checkout
Use these **test card numbers**:

**✅ Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**❌ Card Declined:**
```
Card Number: 4000 0000 0000 0002
```

**❌ Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
```

**❌ Expired Card:**
```
Card Number: 4000 0000 0000 0069
```

---

## Step 5: Verify Webhook Processing

### 5.1 Check Stripe CLI Terminal
You should see events like:
```
✔ Received event: customer.subscription.created
✔ Received event: invoice.payment_succeeded
```

### 5.2 Check Server Logs
Look for:
```
[Stripe Webhook] Received event: customer.subscription.created
[Webhook] ✅ Subscription created successfully for user: user@example.com
```

### 5.3 Verify Database Updates
Check MongoDB for:
- User's `subscriptionPlan` updated to selected plan
- User's `subscriptionStatus` set to 'active'
- User's `credits` allocated (500, 1500, or 5000)
- New record in `subscriptions` collection
- New record in `credit_transactions` collection

---

## Step 6: Test Subscription Management

### 6.1 Navigate to Dashboard
```
http://localhost:3000/dashboard
```

### 6.2 Click "Manage Subscription"
This should redirect to Stripe Customer Portal

### 6.3 Test Portal Features
- ✅ Update payment method
- ✅ View billing history
- ✅ Download invoices
- ✅ Cancel subscription

---

## Step 7: Test Webhook Events Manually

### 7.1 Trigger Subscription Created
```bash
stripe trigger customer.subscription.created
```

### 7.2 Trigger Payment Succeeded
```bash
stripe trigger invoice.payment_succeeded
```

### 7.3 Trigger Payment Failed
```bash
stripe trigger invoice.payment_failed
```

### 7.4 Trigger Subscription Updated
```bash
stripe trigger customer.subscription.updated
```

### 7.5 Trigger Subscription Deleted
```bash
stripe trigger customer.subscription.deleted
```

---

## Step 8: Test Credit System

### 8.1 Check Initial Credits
After subscribing, verify user has correct credits:
- Basic: 500 credits
- Creator: 1,500 credits
- Team: 5,000 credits

### 8.2 Test Credit Deduction
Create a test API endpoint or use existing generation endpoint:
```typescript
// Example: Deduct 5 credits for a generation
const result = await deductCredits(userId, 5, 'Test generation');
console.log('New balance:', result.newBalance);
```

### 8.3 Verify Transaction Logging
Check `credit_transactions` collection for:
- Type: 'usage'
- Amount: -5
- Balance before/after recorded

---

## Step 9: Test Feature Access Control

### 9.1 Test Free Plan Restrictions
```typescript
// Should return false for free plan
const hasAccess = await checkFeatureAccess(userId, 'stemSeparation');
```

### 9.2 Test Paid Plan Access
```typescript
// Should return true for creator/team plans
const hasAccess = await checkFeatureAccess(userId, 'stemSeparation');
```

### 9.3 Test Upgrade Prompts
Navigate to a premium feature and verify upgrade prompt displays

---

## Step 10: Test Subscription Lifecycle

### Complete Flow Test:
1. ✅ User signs up (free plan, 50 credits)
2. ✅ User upgrades to Creator plan
3. ✅ Webhook processes subscription.created
4. ✅ User receives 1,500 credits
5. ✅ User generates music (credits deducted)
6. ✅ User accesses premium features
7. ✅ Monthly renewal (invoice.payment_succeeded)
8. ✅ Credits reset to 1,500
9. ✅ User cancels subscription
10. ✅ Subscription continues until period end
11. ✅ User downgraded to free plan

---

## Common Issues & Solutions

### Issue: Webhook signature verification failed
**Solution:** Make sure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the secret from `stripe listen`

### Issue: User not found in webhook handler
**Solution:** Ensure user has a `stripeCustomerId` in the database

### Issue: Credits not allocated
**Solution:** Check webhook logs for errors in `allocateMonthlyCredits()`

### Issue: Checkout session fails
**Solution:** Verify price IDs in `.env.local` match your Stripe dashboard

### Issue: MongoDB connection error
**Solution:** Check `MONGODB_URI` is correct and MongoDB is running

---

## Testing Checklist

### Environment Setup
- [ ] `.env.local` has all required variables
- [ ] Stripe CLI installed and authenticated
- [ ] Webhook forwarding active
- [ ] MongoDB connection working

### Checkout Flow
- [ ] Pricing page displays correctly
- [ ] Checkout session creates successfully
- [ ] Redirects to Stripe Checkout
- [ ] Test card payment succeeds
- [ ] Redirects back to success page

### Webhook Processing
- [ ] subscription.created event processed
- [ ] Database updated with subscription
- [ ] Credits allocated correctly
- [ ] invoice.payment_succeeded handled
- [ ] invoice.payment_failed handled

### Subscription Management
- [ ] Customer portal opens correctly
- [ ] Payment method can be updated
- [ ] Subscription can be canceled
- [ ] Cancellation syncs to database

### Credit System
- [ ] Initial allocation correct
- [ ] Deduction works atomically
- [ ] Transactions logged properly
- [ ] Balance updates in real-time

### Feature Access
- [ ] Free plan restrictions enforced
- [ ] Paid plan features accessible
- [ ] Upgrade prompts display
- [ ] Plan validation works

---

## Production Deployment Checklist

Before going live:
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to production URL
- [ ] Configure webhook in Stripe Dashboard
- [ ] Test with real credit card (small amount)
- [ ] Verify webhook delivery in production
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure backup procedures
- [ ] Test cancellation flow
- [ ] Verify email notifications work

---

## Support Resources

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Testing Cards:** https://stripe.com/docs/testing
- **Stripe CLI Docs:** https://stripe.com/docs/stripe-cli
- **Webhook Events:** https://stripe.com/docs/api/events/types

---

## Next Steps

1. Complete all testing checklist items
2. Fix any issues found during testing
3. Add email notifications for subscription events
4. Implement usage analytics dashboard
5. Set up production environment
6. Go live! 🚀
