// Test MongoDB Connection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...\n');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }
  
  console.log('Connection String:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password
  console.log('');
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas\n');
    
    // Get database
    const db = client.db('ai-music-studio');
    console.log('Database:', db.databaseName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections found:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check tracks collection
    const tracksCount = await db.collection('tracks').countDocuments();
    console.log(`\n✅ Tracks collection has ${tracksCount} documents`);
    
    // Get a sample track to verify structure
    if (tracksCount > 0) {
      const sampleTrack = await db.collection('tracks').findOne();
      console.log('\nSample track fields:');
      console.log('  - id:', sampleTrack.id || 'N/A');
      console.log('  - userId:', sampleTrack.userId || 'N/A');
      console.log('  - userEmail:', sampleTrack.userEmail || 'N/A');
      console.log('  - title:', sampleTrack.title || 'N/A');
    }
    
    console.log('\n✅ MongoDB connection is working correctly!');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
