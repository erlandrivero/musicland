// Fix orphaned projects by assigning to erlandrivero@gmail.com
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixProjects() {
  console.log('Fixing orphaned projects...\n');
  
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    const userEmail = 'erlandrivero@gmail.com';
    
    // Get the user
    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user) {
      console.error('User not found:', userEmail);
      process.exit(1);
    }
    
    console.log('Found user:', user.name, '(' + user.email + ')');
    console.log('User _id:', user._id.toString(), '\n');
    
    // Update all projects with the orphaned userId
    const result = await db.collection('projects').updateMany(
      { userId: '685dc9e5e6ef774c601b35e8' },
      { 
        $set: { 
          userEmail: userEmail,
          userId: user._id.toString()
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} projects`);
    
    // Verify
    const projects = await db.collection('projects').find({ userEmail: userEmail }).toArray();
    console.log('\nProjects now assigned to', userEmail + ':');
    projects.forEach(p => {
      console.log(`  - ${p.name} (${p.trackIds?.length || 0} tracks)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixProjects();
