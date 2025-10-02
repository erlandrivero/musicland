const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createIndexes() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('ai-music-studio');
    
    console.log('\n📊 Creating indexes...\n');
    
    // Users collection indexes
    console.log('Creating users collection indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('  ✅ Email index (unique)');
    
    await db.collection('users').createIndex({ stripeCustomerId: 1 }, { unique: true, sparse: true });
    console.log('  ✅ Stripe Customer ID index (unique, sparse)');
    
    await db.collection('users').createIndex({ subscriptionStatus: 1 });
    console.log('  ✅ Subscription Status index');
    
    await db.collection('users').createIndex({ subscriptionPlan: 1 });
    console.log('  ✅ Subscription Plan index');
    
    // Subscriptions collection indexes
    console.log('\nCreating subscriptions collection indexes...');
    await db.collection('subscriptions').createIndex({ stripeSubscriptionId: 1 }, { unique: true });
    console.log('  ✅ Stripe Subscription ID index (unique)');
    
    await db.collection('subscriptions').createIndex({ userId: 1 });
    console.log('  ✅ User ID index');
    
    await db.collection('subscriptions').createIndex({ status: 1 });
    console.log('  ✅ Status index');
    
    await db.collection('subscriptions').createIndex({ currentPeriodEnd: 1 });
    console.log('  ✅ Current Period End index');
    
    // Credit transactions collection indexes
    console.log('\nCreating credit_transactions collection indexes...');
    await db.collection('credit_transactions').createIndex({ userId: 1, createdAt: -1 });
    console.log('  ✅ User ID + Created At index (compound)');
    
    await db.collection('credit_transactions').createIndex({ type: 1 });
    console.log('  ✅ Transaction Type index');
    
    await db.collection('credit_transactions').createIndex({ subscriptionPeriod: 1 });
    console.log('  ✅ Subscription Period index');
    
    await db.collection('credit_transactions').createIndex({ generationId: 1 }, { sparse: true });
    console.log('  ✅ Generation ID index (sparse)');
    
    // Generations collection indexes
    console.log('\nCreating generations collection indexes...');
    await db.collection('generations').createIndex({ userId: 1, createdAt: -1 });
    console.log('  ✅ User ID + Created At index (compound)');
    
    await db.collection('generations').createIndex({ status: 1 });
    console.log('  ✅ Status index');
    
    await db.collection('generations').createIndex({ sunoGenerationId: 1 }, { sparse: true });
    console.log('  ✅ Suno Generation ID index (sparse)');
    
    console.log('\n✅ All indexes created successfully!\n');
    
    // List all indexes for verification
    console.log('📋 Verifying indexes...\n');
    
    const collections = ['users', 'subscriptions', 'credit_transactions', 'generations'];
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`${collectionName}:`);
      indexes.forEach(index => {
        console.log(`  - ${index.name}`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createIndexes();
