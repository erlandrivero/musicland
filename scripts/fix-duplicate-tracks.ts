/**
 * Script to fix duplicate tracks in the database
 * This script will:
 * 1. Find and remove duplicate tracks (keeping the oldest one)
 * 2. Create a unique index on (id, userId) to prevent future duplicates
 */

import { getDatabase, COLLECTIONS } from '../lib/mongodb';

async function fixDuplicateTracks() {
  try {
    console.log('Connecting to database...');
    const db = await getDatabase();
    const tracksCollection = db.collection(COLLECTIONS.TRACKS);

    console.log('\n1. Finding duplicate tracks...');
    
    // Find all tracks grouped by id and userId
    const duplicates = await tracksCollection.aggregate([
      {
        $group: {
          _id: { id: '$id', userId: '$userId' },
          count: { $sum: 1 },
          docs: { $push: { _id: '$_id', createdAt: '$createdAt', title: '$title' } }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();

    console.log(`Found ${duplicates.length} sets of duplicate tracks`);

    if (duplicates.length > 0) {
      console.log('\n2. Removing duplicates (keeping oldest)...');
      let totalRemoved = 0;

      for (const dup of duplicates) {
        // Sort by createdAt to keep the oldest
        const sorted = dup.docs.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // Keep the first (oldest), remove the rest
        const toRemove = sorted.slice(1);
        
        console.log(`  - Track "${sorted[0].title}" (id: ${dup._id.id}): Keeping oldest, removing ${toRemove.length} duplicates`);
        
        for (const doc of toRemove) {
          await tracksCollection.deleteOne({ _id: doc._id });
          totalRemoved++;
        }
      }

      console.log(`\nRemoved ${totalRemoved} duplicate tracks`);
    }

    console.log('\n3. Creating unique index on (id, userId)...');
    
    // Check if index already exists
    const indexes = await tracksCollection.indexes();
    const indexExists = indexes.some(idx => 
      idx.name === 'id_userId_unique' || 
      (idx.key && idx.key.id === 1 && idx.key.userId === 1 && idx.unique)
    );

    if (indexExists) {
      console.log('  - Unique index already exists');
    } else {
      await tracksCollection.createIndex(
        { id: 1, userId: 1 },
        { unique: true, name: 'id_userId_unique' }
      );
      console.log('  - Unique index created successfully');
    }

    console.log('\n✅ Database cleanup complete!');
    
    // Show final stats
    const totalTracks = await tracksCollection.countDocuments();
    console.log(`\nTotal tracks in database: ${totalTracks}`);

  } catch (error) {
    console.error('❌ Error fixing duplicate tracks:', error);
    throw error;
  }
}

// Run the script
fixDuplicateTracks()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
