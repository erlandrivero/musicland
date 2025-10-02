# Stripe + MongoDB Integration - Installation Checklist

## 📦 Required Dependencies

### Check if already installed:
```bash
npm list stripe @stripe/stripe-js mongodb next-auth
```

### Install missing dependencies:
```bash
npm install stripe @stripe/stripe-js mongodb
```

**Versions:**
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK
- `mongodb` - MongoDB driver (should already be installed)
- `next-auth` - Authentication (should already be installed)

---

## 🔧 Project Structure Verification

Verify these files were created:

### Database Layer
- ✅ `lib/mongodb.ts` - MongoDB connection with pooling
- ✅ `lib/types/database.ts` - TypeScript interfaces and types
- ✅ `lib/db/users.ts` - User CRUD operations
- ✅ `lib/db/subscriptions.ts` - Subscription management
- ✅ `lib/db/credits.ts` - Credit transaction operations

### API Routes
- ✅ `app/api/stripe/create-checkout-session/route.ts`
- ✅ `app/api/stripe/create-portal-session/route.ts`
- ✅ `app/api/stripe/webhooks/route.ts`
- ✅ `app/api/subscription/status/route.ts`

### Authentication & Access Control
- ✅ `lib/auth/featureAccess.ts` - Feature gating logic

### UI Components
- ✅ `components/pricing/PricingPage.tsx`
- ✅ `components/subscription/SubscriptionDashboard.tsx`
- ✅ `components/subscription/CreditBalance.tsx`
- ✅ `components/subscription/FeatureGate.tsx`
- ✅ `components/subscription/UpgradePrompt.tsx`

### Documentation
- ✅ `STRIPE_TESTING_GUIDE.md`
- ✅ `INSTALLATION_CHECKLIST.md` (this file)

---

## 🗄️ MongoDB Setup

### 1. Create Database Indexes

Run this script to create required indexes:

```javascript
// scripts/create-indexes.js
const { MongoClient } = require('mongodb');

async function createIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    console.log('Creating indexes...');
    
    // Users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ stripeCustomerId: 1 }, { unique: true, sparse: true });
    await db.collection('users').createIndex({ subscriptionStatus: 1 });
    
    // Subscriptions collection
    await db.collection('subscriptions').createIndex({ stripeSubscriptionId: 1 }, { unique: true });
    await db.collection('subscriptions').createIndex({ userId: 1 });
    await db.collection('subscriptions').createIndex({ status: 1 });
    
    // Credit transactions collection
    await db.collection('credit_transactions').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('credit_transactions').createIndex({ type: 1 });
    
    // Generations collection
    await db.collection('generations').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('generations').createIndex({ status: 1 });
    
    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await client.close();
  }
}

createIndexes();
```

**Run with:**
```bash
node scripts/create-indexes.js
```

---

## 🔑 Environment Variables Checklist

Verify all variables in `.env.local`:

### Stripe Configuration
- ✅ `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Your publishable key
- ✅ `STRIPE_SECRET_KEY` - Your secret key
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- ✅ `STRIPE_PRODUCT_BASIC` - Your Basic product ID
- ✅ `STRIPE_PRODUCT_CREATOR` - Your Creator product ID
- ✅ `STRIPE_PRODUCT_TEAM` - Your Team product ID
- ✅ `STRIPE_PRICE_BASIC` - Your Basic price ID
- ✅ `STRIPE_PRICE_CREATOR` - Your Creator price ID
- ✅ `STRIPE_PRICE_TEAM` - Your Team price ID

### MongoDB Configuration
- ✅ `MONGODB_URI` - Your MongoDB connection string

### NextAuth Configuration
- ✅ `NEXTAUTH_URL` - http://localhost:3000 (dev)
- ✅ `NEXTAUTH_SECRET` - Your secret key

---

## 🎨 Stripe Dashboard Configuration

### 1. Products Setup
Your products are already created:
- ✅ Basic Plan ($9.99/month)
- ✅ Creator Plan ($19.99/month)
- ✅ Team Plan ($29.99/month)

### 2. Webhook Configuration

**Development:**
1. Use Stripe CLI: `stripe listen --forward-to http://localhost:3000/api/stripe/webhooks`
2. Copy the webhook secret to `.env.local`

**Production:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/stripe/webhooks`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret to production environment

### 3. Customer Portal Configuration
1. Go to Stripe Dashboard → Settings → Customer Portal
2. Enable customer portal
3. Configure allowed actions:
   - ✅ Update payment method
   - ✅ View billing history
   - ✅ Cancel subscription
4. Set business information and branding

---

## 🧪 Testing Setup

### 1. Install Stripe CLI
```bash
# Windows (PowerShell with Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

### 2. Login to Stripe
```bash
stripe login
```

### 3. Start Webhook Forwarding
```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhooks
```

---

## 🚀 First Run Checklist

### Before Starting Development Server:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Verify Environment Variables**
   ```bash
   # Check if .env.local exists and has all required variables
   cat .env.local | grep STRIPE
   cat .env.local | grep MONGODB
   ```

3. **Test MongoDB Connection**
   ```bash
   # Create a test script or use existing connection
   node -e "require('./lib/mongodb').then(() => console.log('✅ MongoDB connected'))"
   ```

4. **Create Database Indexes**
   ```bash
   node scripts/create-indexes.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Start Stripe Webhook Forwarding** (in separate terminal)
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhooks
   ```

---

## 📝 Integration Points

### Where to Use Components:

**Pricing Page:**
```tsx
// app/pricing/page.tsx
import { PricingPage } from '@/components/pricing/PricingPage';

export default function PricingPageRoute() {
  return <PricingPage currentPlan="free" userEmail="user@example.com" />;
}
```

**Dashboard:**
```tsx
// app/dashboard/page.tsx
import { SubscriptionDashboard } from '@/components/subscription/SubscriptionDashboard';

export default function DashboardPage() {
  // Fetch user data
  return <SubscriptionDashboard user={userData} />;
}
```

**Credit Balance Widget:**
```tsx
// In any component
import { CreditBalance } from '@/components/subscription/CreditBalance';

<CreditBalance credits={user.credits} plan={user.subscriptionPlan} compact />
```

**Feature Gating:**
```tsx
import { FeatureGate } from '@/components/subscription/FeatureGate';

<FeatureGate 
  feature="stemSeparation" 
  userPlan={user.subscriptionPlan}
  hasAccess={hasAccess}
>
  <StemSeparationControls />
</FeatureGate>
```

---

## 🔍 Verification Steps

### 1. Test Checkout Flow
- [ ] Navigate to `/pricing`
- [ ] Click "Get Started" on a plan
- [ ] Complete checkout with test card: `4242 4242 4242 4242`
- [ ] Verify redirect to success page
- [ ] Check webhook logs for `subscription.created`

### 2. Verify Database Updates
- [ ] User's `subscriptionPlan` updated
- [ ] User's `subscriptionStatus` = 'active'
- [ ] User's `credits` allocated correctly
- [ ] New record in `subscriptions` collection
- [ ] New record in `credit_transactions` collection

### 3. Test Customer Portal
- [ ] Navigate to `/dashboard`
- [ ] Click "Manage Subscription"
- [ ] Verify redirect to Stripe Customer Portal
- [ ] Test updating payment method

### 4. Test Feature Access
- [ ] Verify free users see upgrade prompts
- [ ] Verify paid users can access premium features
- [ ] Test credit deduction on generation

---

## 🐛 Troubleshooting

### Common Issues:

**Issue: "Module not found: Can't resolve '@/lib/mongodb'"**
- Solution: Ensure `tsconfig.json` has path alias configured
- Check: `"@/*": ["./*"]` in `compilerOptions.paths`

**Issue: Webhook signature verification failed**
- Solution: Update `STRIPE_WEBHOOK_SECRET` from `stripe listen` output

**Issue: MongoDB connection timeout**
- Solution: Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)

**Issue: Price ID not found**
- Solution: Verify price IDs in `.env.local` match Stripe Dashboard

---

## ✅ Final Checklist

Before considering integration complete:

- [ ] All dependencies installed
- [ ] All files created and in correct locations
- [ ] Environment variables configured
- [ ] MongoDB indexes created
- [ ] Stripe products and prices configured
- [ ] Webhook endpoint configured
- [ ] Customer portal enabled
- [ ] Test checkout flow successful
- [ ] Webhooks processing correctly
- [ ] Database updates verified
- [ ] Credit system working
- [ ] Feature access control functioning
- [ ] UI components rendering correctly

---

## 🎉 You're Ready!

Once all checklist items are complete, your Stripe + MongoDB payment integration is ready for development and testing!

**Next Steps:**
1. Follow the `STRIPE_TESTING_GUIDE.md` for comprehensive testing
2. Integrate components into your existing pages
3. Test the complete user journey
4. Prepare for production deployment

**Need Help?**
- Stripe Documentation: https://stripe.com/docs
- MongoDB Documentation: https://docs.mongodb.com
- Next.js Documentation: https://nextjs.org/docs
