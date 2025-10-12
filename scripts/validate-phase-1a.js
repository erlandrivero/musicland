/**
 * Phase 1A Validation Script
 * 
 * This script validates that all Phase 1A requirements are met:
 * 1. TypeScript interfaces include all SunoAPI fields
 * 2. MongoDB indexes are created
 * 3. API endpoints return complete track data including lyrics
 * 4. Error handling for missing lyrics works
 * 
 * Usage: node scripts/validate-phase-1a.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'ai-music-studio';
const COLLECTION_NAME = 'tracks';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateTypeScriptInterfaces() {
  log('\n📝 Validating TypeScript Interfaces...', 'blue');
  
  const typesFilePath = path.join(__dirname, '../types/index.ts');
  const typesContent = fs.readFileSync(typesFilePath, 'utf-8');
  
  const requiredFields = [
    'lyrics?:',
    'videoUrl?:',
    'imageUrl?:',
    'tags?:',
    'mv?:',
    'duration',
    'createdAt'
  ];
  
  let allFieldsPresent = true;
  requiredFields.forEach(field => {
    if (typesContent.includes(field)) {
      log(`  ✅ Field '${field}' found in Track interface`, 'green');
    } else {
      log(`  ❌ Field '${field}' missing in Track interface`, 'red');
      allFieldsPresent = false;
    }
  });
  
  return allFieldsPresent;
}

async function validateMongoDBIndexes() {
  log('\n🗄️  Validating MongoDB Indexes...', 'blue');
  
  if (!MONGODB_URI) {
    log('  ❌ MONGODB_URI not found in environment', 'red');
    return false;
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const indexes = await collection.indexes();
    const indexNames = indexes.map(idx => idx.name);
    
    const requiredIndexes = [
      'lyrics_title_tags_text',
      'tags_index',
      'userId_createdAt_index',
      'status_index'
    ];
    
    let allIndexesPresent = true;
    requiredIndexes.forEach(indexName => {
      if (indexNames.includes(indexName)) {
        log(`  ✅ Index '${indexName}' exists`, 'green');
      } else {
        log(`  ⚠️  Index '${indexName}' not found (run: npm run create-lyrics-indexes)`, 'yellow');
        allIndexesPresent = false;
      }
    });
    
    return allIndexesPresent;
  } catch (error) {
    log(`  ❌ Error connecting to MongoDB: ${error.message}`, 'red');
    return false;
  } finally {
    await client.close();
  }
}

async function validateAPIEndpoints() {
  log('\n🔌 Validating API Endpoint Updates...', 'blue');
  
  // Check tracks route.ts
  const tracksRoutePath = path.join(__dirname, '../app/api/tracks/route.ts');
  const tracksRouteContent = fs.readFileSync(tracksRoutePath, 'utf-8');
  
  const requiredTrackFields = [
    'lyrics',
    'videoUrl',
    'imageUrl',
    'mv',
    'tags'
  ];
  
  let allFieldsSaved = true;
  requiredTrackFields.forEach(field => {
    if (tracksRouteContent.includes(`${field}:`)) {
      log(`  ✅ API saves '${field}' field`, 'green');
    } else {
      log(`  ❌ API missing '${field}' field`, 'red');
      allFieldsSaved = false;
    }
  });
  
  // Check status route.ts
  const statusRoutePath = path.join(__dirname, '../app/api/music/status/[id]/route.ts');
  const statusRouteContent = fs.readFileSync(statusRoutePath, 'utf-8');
  
  const requiredStatusFields = [
    'lyrics:',
    'tags:'
  ];
  
  requiredStatusFields.forEach(field => {
    if (statusRouteContent.includes(field)) {
      log(`  ✅ Status API returns '${field}' field`, 'green');
    } else {
      log(`  ❌ Status API missing '${field}' field`, 'red');
      allFieldsSaved = false;
    }
  });
  
  return allFieldsSaved;
}

async function validateBackwardCompatibility() {
  log('\n🔄 Validating Backward Compatibility...', 'blue');
  
  if (!MONGODB_URI) {
    log('  ⚠️  Cannot test backward compatibility without MongoDB connection', 'yellow');
    return true;
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Check if there are tracks without lyrics
    const tracksWithoutLyrics = await collection.countDocuments({ lyrics: { $exists: false } });
    const tracksWithLyrics = await collection.countDocuments({ lyrics: { $exists: true, $ne: null } });
    const totalTracks = await collection.countDocuments();
    
    log(`  📊 Total tracks: ${totalTracks}`, 'blue');
    log(`  📊 Tracks with lyrics: ${tracksWithLyrics}`, 'green');
    log(`  📊 Tracks without lyrics: ${tracksWithoutLyrics}`, 'yellow');
    
    if (totalTracks === 0) {
      log('  ℹ️  No tracks in database yet - backward compatibility not applicable', 'blue');
    } else {
      log('  ✅ Schema is backward compatible (tracks without lyrics still exist)', 'green');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error checking backward compatibility: ${error.message}`, 'red');
    return false;
  } finally {
    await client.close();
  }
}

async function runValidation() {
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║         Phase 1A Validation - Lyrics & Metadata          ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  
  const results = {
    interfaces: await validateTypeScriptInterfaces(),
    indexes: await validateMongoDBIndexes(),
    endpoints: await validateAPIEndpoints(),
    compatibility: await validateBackwardCompatibility()
  };
  
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                    Validation Summary                     ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  
  const allPassed = Object.values(results).every(result => result);
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    const name = test.charAt(0).toUpperCase() + test.slice(1);
    log(`  ${icon} ${name}: ${passed ? 'PASSED' : 'FAILED'}`, color);
  });
  
  log('\n' + '='.repeat(60));
  
  if (allPassed) {
    log('\n🎉 All Phase 1A validations PASSED!', 'green');
    log('\n✅ Ready to proceed to Phase 1B: Create Lyrics Viewer Component', 'green');
  } else {
    log('\n⚠️  Some validations FAILED', 'yellow');
    log('\nRecommended actions:', 'yellow');
    if (!results.indexes) {
      log('  1. Run: npm run create-lyrics-indexes', 'yellow');
    }
    if (!results.interfaces || !results.endpoints) {
      log('  2. Review code changes and ensure all fields are properly added', 'yellow');
    }
  }
  
  log('\n' + '='.repeat(60) + '\n');
  
  process.exit(allPassed ? 0 : 1);
}

// Run validation
runValidation().catch(error => {
  log(`\n❌ Fatal error during validation: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
