/**
 * MongoDB Index Creation Script for Lyrics Search
 * 
 * This script creates indexes on the tracks collection to enable:
 * 1. Full-text search on lyrics
 * 2. Efficient filtering by tags
 * 3. Fast sorting by creation date
 * 
 * Usage: node scripts/create-lyrics-indexes.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'ai-music-studio';
const COLLECTION_NAME = 'tracks';

async function createIndexes() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    console.error('Please ensure .env.local file exists with MONGODB_URI defined');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log('\n📊 Creating indexes on tracks collection...\n');

    // 1. Text index on lyrics for full-text search
    console.log('Creating text index on lyrics field...');
    const lyricsIndexResult = await collection.createIndex(
      { lyrics: 'text', title: 'text', tags: 'text' },
      {
        name: 'lyrics_title_tags_text',
        weights: {
          lyrics: 3,
          title: 2,
          tags: 1
        },
        default_language: 'english'
      }
    );
    console.log(`✅ Text index created: ${lyricsIndexResult}`);

    // 2. Index on tags for filtering
    console.log('\nCreating index on tags field...');
    const tagsIndexResult = await collection.createIndex(
      { tags: 1 },
      { name: 'tags_index' }
    );
    console.log(`✅ Tags index created: ${tagsIndexResult}`);

    // 3. Compound index on userId and createdAt for user-specific queries
    console.log('\nCreating compound index on userId and createdAt...');
    const userDateIndexResult = await collection.createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'userId_createdAt_index' }
    );
    console.log(`✅ User-Date index created: ${userDateIndexResult}`);

    // 4. Index on status for filtering
    console.log('\nCreating index on status field...');
    const statusIndexResult = await collection.createIndex(
      { status: 1 },
      { name: 'status_index' }
    );
    console.log(`✅ Status index created: ${statusIndexResult}`);

    // 5. Index on isFavorite for filtering favorites
    console.log('\nCreating index on isFavorite field...');
    const favoriteIndexResult = await collection.createIndex(
      { userId: 1, isFavorite: 1 },
      { name: 'userId_favorite_index' }
    );
    console.log(`✅ Favorite index created: ${favoriteIndexResult}`);

    // List all indexes
    console.log('\n📋 Current indexes on tracks collection:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`\n${i + 1}. ${index.name}`);
      console.log(`   Keys: ${JSON.stringify(index.key)}`);
      if (index.weights) {
        console.log(`   Weights: ${JSON.stringify(index.weights)}`);
      }
    });

    console.log('\n✅ All indexes created successfully!');
    console.log('\n📝 Note: These indexes will improve:');
    console.log('   - Lyrics search performance');
    console.log('   - Tag filtering speed');
    console.log('   - User-specific track queries');
    console.log('   - Status and favorite filtering');

  } catch (error) {
    console.error('\n❌ Error creating indexes:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the script
createIndexes().catch(console.error);
