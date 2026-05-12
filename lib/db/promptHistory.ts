import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';

// ============================================================================
// Prompt History Types
// ============================================================================

export interface PromptHistoryEntry {
  _id?: ObjectId;
  userId: string;
  userEmail: string;
  artist: string;
  song: string;
  artistAnalysis: string;
  songAnalysis: string;
  prompts: Array<{
    title: string;
    prompt: string;
    characters: number;
  }>;
  modelUsed: string;
  createdAt: Date;
}

// ============================================================================
// Prompt History Operations
// ============================================================================

/**
 * Save generated prompts to history
 */
export async function savePromptHistory(data: {
  userId: string;
  userEmail: string;
  artist: string;
  song: string;
  artistAnalysis: string;
  songAnalysis: string;
  prompts: Array<{
    title: string;
    prompt: string;
    characters: number;
  }>;
}): Promise<PromptHistoryEntry> {
  const db = await getDatabase();
  
  const entry: Omit<PromptHistoryEntry, '_id'> = {
    userId: data.userId,
    userEmail: data.userEmail,
    artist: data.artist,
    song: data.song,
    artistAnalysis: data.artistAnalysis,
    songAnalysis: data.songAnalysis,
    prompts: data.prompts,
    modelUsed: 'gemini-2.5-flash-search',
    createdAt: new Date(),
  };

  const result = await db.collection('prompt_history').insertOne(entry);
  
  return {
    _id: result.insertedId,
    ...entry,
  };
}

/**
 * Get prompt history for a user
 */
export async function getUserPromptHistory(
  userId: string,
  limit: number = 20
): Promise<PromptHistoryEntry[]> {
  const db = await getDatabase();
  
  const history = await db
    .collection('prompt_history')
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return history as PromptHistoryEntry[];
}

/**
 * Get a specific prompt history entry
 */
export async function getPromptHistoryById(
  id: string,
  userId: string
): Promise<PromptHistoryEntry | null> {
  const db = await getDatabase();
  
  const entry = await db.collection('prompt_history').findOne({
    _id: new ObjectId(id),
    userId,
  });

  return entry as PromptHistoryEntry | null;
}

/**
 * Delete a prompt history entry
 */
export async function deletePromptHistory(
  id: string,
  userId: string
): Promise<boolean> {
  const db = await getDatabase();
  
  const result = await db.collection('prompt_history').deleteOne({
    _id: new ObjectId(id),
    userId,
  });

  return result.deletedCount === 1;
}

/**
 * Get total prompt generations count for a user
 */
export async function getUserPromptCount(userId: string): Promise<number> {
  const db = await getDatabase();
  
  const count = await db.collection('prompt_history').countDocuments({ userId });
  
  return count;
}
