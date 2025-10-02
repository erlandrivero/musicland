const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixSubscriptionDate() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    console.log('🔍 Finding users with active subscriptions...\n');
    
    // Find all users with active subscriptions
    const users = await db.collection('users').find({
      subscriptionStatus: 'active'
    }).toArray();
    
    console.log(`Found ${users.length} user(s) with active subscriptions\n`);
    
    for (const user of users) {
      console.log(`User: ${user.email}`);
      console.log(`Current subscriptionPeriodEnd: ${user.subscriptionPeriodEnd}`);
      
      // Find their subscription record
      const subscription = await db.collection('subscriptions').findOne({
        userId: user._id,
        status: 'active'
      });
      
      if (subscription) {
        console.log(`Subscription found: ${subscription.stripeSubscriptionId}`);
        console.log(`Subscription currentPeriodEnd: ${subscription.currentPeriodEnd}`);
        
        // Update user with correct date from subscription
        await db.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { 
              subscriptionPeriodEnd: subscription.currentPeriodEnd,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log(`✅ Updated user with correct date: ${subscription.currentPeriodEnd}\n`);
      } else {
        console.log('⚠️ No subscription record found\n');
      }
    }
    
    console.log('✅ All subscription dates fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixSubscriptionDate();
