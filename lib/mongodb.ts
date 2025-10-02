import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;

// MongoDB connection options with pooling and timeouts
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Minimum number of connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
  retryWrites: true,
  retryReads: true,
  w: 'majority' as const,
};

console.log('[MongoDB] Initializing MongoDB connection...');

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
    globalWithMongo._mongoClientPromise = client.connect()
      .then((client) => {
        console.log('[MongoDB] ✅ Connected to MongoDB Atlas (Development)');
        return client;
      })
      .catch((error: Error) => {
        console.error('[MongoDB] ❌ Error connecting to MongoDB Atlas:', error);
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then((client) => {
      console.log('[MongoDB] ✅ Connected to MongoDB Atlas (Production)');
      return client;
    })
    .catch((error: Error) => {
      console.error('[MongoDB] ❌ Error connecting to MongoDB Atlas:', error);
      throw error;
    });
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
  SUBSCRIPTIONS: 'subscriptions',
  CREDIT_TRANSACTIONS: 'credit_transactions',
  GENERATIONS: 'generations',
} as const;
