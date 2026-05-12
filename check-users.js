// Check users collection structure
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkUsers() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('ai-music-studio');
    
    // Get all users
    const users = await db.collection('users').find().toArray();
    console.log('Total users:', users.length, '\n');
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log('  _id:', user._id);
      console.log('  id:', user.id || 'N/A');
      console.log('  email:', user.email);
      console.log('  name:', user.name || 'N/A');
      console.log('');
    });
    
    // Get all projects
    const projects = await db.collection('projects').find().toArray();
    console.log('\nTotal projects:', projects.length, '\n');
    
    projects.forEach((project, index) => {
      console.log(`Project ${index + 1}: "${project.name}"`);
      console.log('  userId:', project.userId);
      console.log('  userEmail:', project.userEmail || 'N/A');
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUsers();
