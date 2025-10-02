const { MongoClient } = require('mongodb');
const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function syncFromStripe() {
  if (!process.env.MONGODB_URI || !process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await mongoClient.connect();
    const db = mongoClient.db('ai-music-studio');
    
    console.log('🔍 Finding users with Stripe customer IDs...\n');
    
    const users = await db.collection('users').find({
      stripeCustomerId: { $exists: true, $ne: null }
    }).toArray();
    
    console.log(`Found ${users.length} user(s) with Stripe customers\n`);
    
    for (const user of users) {
      console.log(`\n📧 User: ${user.email}`);
      console.log(`Stripe Customer: ${user.stripeCustomerId}`);
      
      // Fetch active subscriptions from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 1,
      });
      
      if (subscriptions.data.length === 0) {
        console.log('⚠️ No active subscriptions in Stripe');
        continue;
      }
      
      const sub = subscriptions.data[0];
      console.log(`\n✅ Found active subscription: ${sub.id}`);
      console.log(`Status: ${sub.status}`);
      console.log(`Full subscription object:`, JSON.stringify(sub, null, 2));
      
      // Get dates from subscription items (correct location in new API)
      const periodStart = sub.items.data[0]?.current_period_start || sub.billing_cycle_anchor;
      const periodEnd = sub.items.data[0]?.current_period_end || sub.cancel_at;
      const cancelAtEnd = sub.cancel_at_period_end;
      
      console.log(`Current Period Start: ${periodStart ? new Date(periodStart * 1000) : 'Not found'}`);
      console.log(`Current Period End: ${periodEnd ? new Date(periodEnd * 1000) : 'Not found'}`);
      console.log(`Cancel at Period End: ${cancelAtEnd}`);
      
      // Determine plan
      const priceId = sub.items.data[0]?.price.id;
      let plan = 'creator';
      if (priceId === process.env.STRIPE_PRICE_BASIC) plan = 'basic';
      if (priceId === process.env.STRIPE_PRICE_CREATOR) plan = 'creator';
      if (priceId === process.env.STRIPE_PRICE_TEAM) plan = 'team';
      
      console.log(`Plan: ${plan}`);
      
      // Update user in MongoDB
      if (periodEnd) {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              subscriptionId: sub.id,
              subscriptionStatus: sub.status,
              subscriptionPlan: plan,
              subscriptionPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: cancelAtEnd || false,
              updatedAt: new Date(),
            }
          }
        );
      }
      
      // Update or create subscription record
      const existingSub = await db.collection('subscriptions').findOne({
        stripeSubscriptionId: sub.id
      });
      
      if (existingSub) {
        await db.collection('subscriptions').updateOne(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              status: sub.status,
              plan,
              currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(),
              cancelAtPeriodEnd: cancelAtEnd || false,
              amount: sub.items.data[0]?.price.unit_amount || 0,
              updatedAt: new Date(),
            }
          }
        );
        console.log('✅ Updated subscription record');
      } else {
        await db.collection('subscriptions').insertOne({
          userId: user._id,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: user.stripeCustomerId,
          stripePriceId: priceId,
          status: sub.status,
          plan,
          currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(),
          cancelAtPeriodEnd: cancelAtEnd || false,
          amount: sub.items.data[0]?.price.unit_amount || 0,
          currency: sub.currency,
          interval: sub.items.data[0]?.price.recurring?.interval || 'month',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('✅ Created subscription record');
      }
      
      console.log('\n✅ Sync complete for user!');
    }
    
    console.log('\n🎉 All users synced successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoClient.close();
  }
}

syncFromStripe();
