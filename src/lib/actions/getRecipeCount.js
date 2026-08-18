


'use server';

import { MongoClient, ObjectId } from 'mongodb';

export async function getUserRecipeCount(userId, userEmail) {
  if (!process.env.MONGODB_URI || (!userId && !userEmail)) return 0;
  
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('recipehouse');

    let userObjectId = (userId && ObjectId.isValid(userId)) ? new ObjectId(userId) : null;

    return await db.collection('recipes').countDocuments({
      $or: [
        { userId: userId },
        { userId: userObjectId },
        { userEmail: userEmail },
        { email: userEmail }
      ].filter(Boolean)
    });
  } catch (err) {
    console.error("Recipe count error:", err);
    return 0;
  } finally {
    await client.close();
  }
}


