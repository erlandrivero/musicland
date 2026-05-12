// Migrate projects to add userEmail field
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function migrateProjects() {
  console.log('Migrating projects to add userEmail field...\n');
  
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    // Get all users to map userId to email
    const users = await db.collection('users').find().toArray();
    const userMap = {};
    users.forEach(user => {
      if (user._id) userMap[user._id.toString()] = user.email;
      if (user.id) userMap[user.id] = user.email;
    });
    
    console.log('User mapping created:', Object.keys(userMap).length, 'users');
    
    // Get all projects
    const projects = await db.collection('projects').find().toArray();
    console.log('Found', projects.length, 'projects to migrate\n');
    
    let updated = 0;
    let skipped = 0;
    
    for (const project of projects) {
      if (project.userEmail) {
        console.log(`Skipping project "${project.name}" - already has userEmail`);
        skipped++;
        continue;
      }
      
      const email = userMap[project.userId];
      if (email) {
        await db.collection('projects').updateOne(
          { _id: project._id },
          { $set: { userEmail: email } }
        );
        console.log(`✅ Updated project "${project.name}" with email: ${email}`);
        updated++;
      } else {
        console.log(`⚠️  Could not find email for userId: ${project.userId}`);
      }
    }
    
    console.log(`\n✅ Migration complete: ${updated} updated, ${skipped} skipped`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrateProjects();
