# MongoDB + Stripe Environment Setup Guide

## 🗄️ MongoDB Schema Design

### User Collection Schema
```javascript
// users collection
{
  _id: ObjectId,
  email: String, // unique index
  name: String,
  image: String, // optional
  
  // Authentication
  googleId: String, // optional, for Google OAuth
  emailVerified: Date, // optional, for magic link
  
  // Stripe Integration
  stripeCustomerId: String, // unique index
  
  // Subscription Information
  subscriptionId: String, // current active subscription
  subscriptionStatus: String, // 'active', 'canceled', 'past_due', 'incomplete', 'trialing', null
  subscriptionPlan: String, // 'free', 'basic', 'creator', 'team'
  subscriptionPeriodEnd: Date,
  cancelAtPeriodEnd: Boolean,
  
  // Credits System
  credits: Number, // current credit balance
  creditsUsed: Number, // total credits used (lifetime)
  lastCreditAllocation: Date, // when credits were last allocated
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

### Subscription Collection Schema
```javascript
// subscriptions collection
{
  _id: ObjectId,
  userId: ObjectId, // reference to users collection
  
  // Stripe Data
  stripeSubscriptionId: String, // unique index
  stripeCustomerId: String,
  stripePriceId: String,
  
  // Subscription Details
  status: String, // 'active', 'canceled', 'past_due', etc.
  plan: String, // 'basic', 'creator', 'team'
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: Boolean,
  canceledAt: Date, // optional
  
  // Billing
  amount: Number, // in cents
  currency: String, // 'usd'
  interval: String, // 'month'
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

### Credit Transactions Collection Schema
```javascript
// credit_transactions collection
{
  _id: ObjectId,
  userId: ObjectId, // reference to users collection
  
  // Transaction Details
  type: String, // 'allocation', 'usage', 'refund', 'bonus'
  amount: Number, // positive for allocation/refund, negative for usage
  description: String,
  
  // Related Data
  generationId: String, // optional, for usage transactions
  subscriptionId: String, // optional, for allocation transactions
  subscriptionPeriod: String, // 'YYYY-MM' format
  
  // Metadata
  createdAt: Date,
  metadata: Object // additional data as needed
}
```

### Music Generations Collection Schema
```javascript
// generations collection
{
  _id: ObjectId,
  userId: ObjectId, // reference to users collection
  
  // Generation Details
  prompt: String,
  style: String,
  generationParameters: Object, // SunoAPI parameters
  
  // Results
  sunoGenerationId: String, // ID from SunoAPI
  status: String, // 'pending', 'processing', 'completed', 'failed'
  audioUrl: String, // optional, when completed
  videoUrl: String, // optional, when completed
  title: String, // optional, generated title
  tags: [String], // optional, generated tags
  
  // Credits
  creditsUsed: Number,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date // optional
}
```

## 🔧 MongoDB Indexes

### Required Indexes for Performance
```javascript
// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ stripeCustomerId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ subscriptionStatus: 1 });
db.users.createIndex({ subscriptionPlan: 1 });

// Subscriptions collection indexes
db.subscriptions.createIndex({ stripeSubscriptionId: 1 }, { unique: true });
db.subscriptions.createIndex({ userId: 1 });
db.subscriptions.createIndex({ status: 1 });
db.subscriptions.createIndex({ currentPeriodEnd: 1 });

// Credit transactions collection indexes
db.credit_transactions.createIndex({ userId: 1, createdAt: -1 });
db.credit_transactions.createIndex({ type: 1 });
db.credit_transactions.createIndex({ subscriptionPeriod: 1 });
db.credit_transactions.createIndex({ generationId: 1 }, { sparse: true });

// Generations collection indexes
db.generations.createIndex({ userId: 1, createdAt: -1 });
db.generations.createIndex({ status: 1 });
db.generations.createIndex({ sunoGenerationId: 1 }, { sparse: true });
```

## 🔑 Environment Variables Setup

### Complete .env.local Configuration
```bash
# Next.js Configuration
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/aimusic
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aimusic?retryWrites=true&w=majority

# Stripe Configuration (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_BASIC=price_test_basic_999
STRIPE_PRICE_CREATOR=price_test_creator_1999
STRIPE_PRICE_TEAM=price_test_team_2999

# SunoAPI Configuration
SUNOAPI_KEY=your-actual-sunoapi-key
SUNOAPI_BASE_URL=https://api.sunoapi.com/v1

# Application Configuration
NEXT_PUBLIC_APP_NAME=AI Music Studio
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ MongoDB Connection Setup

### Connection Utility (lib/mongodb.ts)
```typescript
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}
```

## 🎯 Stripe Product Setup

### Create Products in Stripe Dashboard

**Basic Plan - $9.99/month**
```json
{
  "name": "Basic Plan",
  "description": "Perfect for individual creators",
  "metadata": {
    "credits": "500",
    "features": "Commercial licensing, Standard quality, Email support"
  }
}
```

**Creator Plan - $19.99/month**
```json
{
  "name": "Creator Plan", 
  "description": "Advanced features for content creators",
  "metadata": {
    "credits": "1500",
    "features": "High quality, Advanced editing, Stem separation, Priority support"
  }
}
```

**Team Plan - $29.99/month**
```json
{
  "name": "Team Plan",
  "description": "Collaboration tools for creative teams",
  "metadata": {
    "credits": "5000", 
    "features": "Team collaboration, Premium quality, Analytics, Custom integrations"
  }
}
```

### Stripe Webhook Configuration

**Required Webhook Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.created`
- `customer.updated`

**Webhook Endpoint URL:**
- Development: `https://your-ngrok-url.ngrok.io/api/stripe/webhooks`
- Production: `https://yourdomain.com/api/stripe/webhooks`

## 🧪 Database Initialization Script

### Setup Script (scripts/init-db.js)
```javascript
const { MongoClient } = require('mongodb');

async function initializeDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Create collections
    await db.createCollection('users');
    await db.createCollection('subscriptions');
    await db.createCollection('credit_transactions');
    await db.createCollection('generations');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ stripeCustomerId: 1 }, { unique: true, sparse: true });
    await db.collection('subscriptions').createIndex({ stripeSubscriptionId: 1 }, { unique: true });
    await db.collection('subscriptions').createIndex({ userId: 1 });
    await db.collection('credit_transactions').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('generations').createIndex({ userId: 1, createdAt: -1 });
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await client.close();
  }
}

initializeDatabase();
```

Run with: `node scripts/init-db.js`

## 🔒 Security Configuration

### MongoDB Security Best Practices
```javascript
// Connection with authentication
const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority&authSource=admin`;

// Connection options for security
const options = {
  ssl: true,
  sslValidate: true,
  authMechanism: 'SCRAM-SHA-1',
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

### Data Validation Schema
```javascript
// MongoDB schema validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'subscriptionPlan', 'credits'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        subscriptionPlan: {
          enum: ['free', 'basic', 'creator', 'team']
        },
        credits: {
          bsonType: 'number',
          minimum: 0
        }
      }
    }
  }
});
```

## 📊 Monitoring and Analytics

### Database Performance Monitoring
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(1, { slowms: 100 });

// Monitor slow queries
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty();

// Index usage statistics
db.users.aggregate([{ $indexStats: {} }]);
```

### Connection Health Check
```javascript
// Health check endpoint
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.admin().ping();
    
    return Response.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ 
      status: 'unhealthy', 
      error: error.message 
    }, { status: 500 });
  }
}
```

## ✅ Setup Validation Checklist

**MongoDB Setup:**
- [ ] Database connection established
- [ ] Collections created with proper schemas
- [ ] Indexes created for performance
- [ ] Validation rules implemented
- [ ] Connection pooling configured

**Stripe Integration:**
- [ ] Test mode products created
- [ ] Price IDs configured in environment
- [ ] Webhook endpoints set up
- [ ] Test payments working
- [ ] Customer portal configured

**Environment Configuration:**
- [ ] All environment variables set
- [ ] API keys validated
- [ ] Database URI correct
- [ ] Webhook secrets configured
- [ ] SSL certificates valid

**Security Measures:**
- [ ] Database authentication enabled
- [ ] Connection encryption active
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Error handling comprehensive

This setup provides a robust foundation for your Stripe + MongoDB integration with proper security, performance, and scalability considerations.
