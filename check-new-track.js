// Check the newest track to see its structure
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkNewTrack() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    // Get the newest track (most recent createdAt)
    const newestTrack = await db.collection('tracks')
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    
    if (newestTrack.length === 0) {
      console.log('No tracks found');
      return;
    }
    
    console.log('Newest Track:');
    console.log('=============');
    console.log('ID:', newestTrack[0].id);
    console.log('Title:', newestTrack[0].title);
    console.log('Created:', newestTrack[0].createdAt);
    console.log('userId:', newestTrack[0].userId);
    console.log('userEmail:', newestTrack[0].userEmail);
    console.log('audioUrl:', newestTrack[0].audioUrl ? 'Present' : 'MISSING');
    console.log('videoUrl:', newestTrack[0].videoUrl ? 'Present' : 'Not set');
    console.log('status:', newestTrack[0].status);
    console.log('\nFull track data:');
    console.log(JSON.stringify(newestTrack[0], null, 2));
    
    // Get an old track for comparison
    console.log('\n\n=============');
    console.log('Oldest Track (for comparison):');
    console.log('=============');
    const oldestTrack = await db.collection('tracks')
      .find()
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray();
    
    if (oldestTrack.length > 0) {
      console.log('ID:', oldestTrack[0].id);
      console.log('Title:', oldestTrack[0].title);
      console.log('Created:', oldestTrack[0].createdAt);
      console.log('userId:', oldestTrack[0].userId);
      console.log('userEmail:', oldestTrack[0].userEmail);
      console.log('audioUrl:', oldestTrack[0].audioUrl ? 'Present' : 'MISSING');
      console.log('videoUrl:', oldestTrack[0].videoUrl ? 'Present' : 'Not set');
      console.log('status:', oldestTrack[0].status);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkNewTrack();
