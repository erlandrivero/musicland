import { MongoClient, Db } from 'mongodb';

// Hardcoded MongoDB URI - environment variables not loading correctly
const MONGODB_URI = "mongodb+srv://admin:XyVm0f50Ju2ESPGt@cluster0.yzlzf6c.mongodb.net/ship-fast-code?retryWrites=true&w=majority&appName=Cluster0";

const uri = MONGODB_URI;
const options = {};

console.log('[MongoDB] Connecting to MongoDB Atlas...');

let clientPromise: Promise<MongoClient>;
let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch((error: Error) => {
      console.log('[MongoDB] Error connecting to MongoDB Atlas:', error);
      process.exit(1);
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ai-music-studio');
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  TRACKS: 'tracks',
  PROJECTS: 'projects',
  CREDIT_HISTORY: 'credit_history',
} as const;
