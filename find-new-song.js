// Find the new song "Over You, Over Me" in MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function findNewSong() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    // Search for the new song by title
    const newSong = await db.collection('tracks').findOne({ 
      title: 'Over You, Over Me' 
    });
    
    if (newSong) {
      console.log('✅ NEW SONG FOUND IN MONGODB!');
      console.log('=====================================');
      console.log('ID:', newSong.id);
      console.log('Title:', newSong.title);
      console.log('Created:', newSong.createdAt);
      console.log('Status:', newSong.status);
      console.log('Has audioUrl:', !!newSong.audioUrl);
      console.log('audioUrl:', newSong.audioUrl);
      console.log('userEmail:', newSong.userEmail);
      console.log('userId:', newSong.userId);
      console.log('');
      console.log('This song SHOULD be downloadable!');
    } else {
      console.log('❌ NEW SONG NOT FOUND IN MONGODB!');
      console.log('');
      console.log('This means the song was generated but not saved to the database.');
      console.log('The old songs work because they were saved before the auth changes.');
      console.log('');
      console.log('Let me check all tracks created in the last 30 days:');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTracks = await db.collection('tracks')
        .find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .toArray();
      
      console.log(`\nFound ${recentTracks.length} tracks in last 30 days:`);
      recentTracks.forEach(track => {
        console.log(`  - "${track.title}" (${track.createdAt})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findNewSong();
