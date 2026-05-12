// Compare audio URLs between old and new songs
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function compareUrls() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    // Get the newest track
    const newestTrack = await db.collection('tracks')
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    
    // Get an old track
    const oldestTrack = await db.collection('tracks')
      .find()
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray();
    
    console.log('NEW SONG (April 2026):');
    console.log('======================');
    console.log('Title:', newestTrack[0].title);
    console.log('Created:', newestTrack[0].createdAt);
    console.log('Audio URL:', newestTrack[0].audioUrl);
    console.log('');
    
    console.log('OLD SONG (October 2025):');
    console.log('========================');
    console.log('Title:', oldestTrack[0].title);
    console.log('Created:', oldestTrack[0].createdAt);
    console.log('Audio URL:', oldestTrack[0].audioUrl);
    console.log('');
    
    // Extract CDN domains
    const newUrl = new URL(newestTrack[0].audioUrl);
    const oldUrl = new URL(oldestTrack[0].audioUrl);
    
    console.log('COMPARISON:');
    console.log('===========');
    console.log('New CDN:', newUrl.hostname);
    console.log('Old CDN:', oldUrl.hostname);
    console.log('');
    
    if (newUrl.hostname !== oldUrl.hostname) {
      console.log('⚠️  DIFFERENT CDNs!');
      console.log('This explains why old songs work but new ones don\'t.');
      console.log('The old CDN likely has proper CORS headers.');
    } else {
      console.log('✅ Same CDN - something else changed');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

compareUrls();
