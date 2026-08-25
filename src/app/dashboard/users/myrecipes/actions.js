


'use server';

import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function fetchUserRecipes(userId, userEmail) {
  try {
    const client = await clientPromise;
    const db = client.db('recipehouse');

    let userObjectId = null;
    if (userId && ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
    }

    const queryConditions = [];

    if (userId) {
      const cleanUserId = String(userId).trim();
      queryConditions.push({ userId: cleanUserId }, { userID: cleanUserId }, { user_id: cleanUserId });
    }

    if (userObjectId) {
      queryConditions.push({ userId: userObjectId }, { userID: userObjectId }, { user_id: userObjectId });
    }

    if (userEmail) {
      const cleanEmail = String(userEmail).trim();
      queryConditions.push({ userEmail: cleanEmail }, { email: cleanEmail }, { user_email: cleanEmail });
    }

    const query = queryConditions.length > 0 ? { $or: queryConditions } : { _id: null };

    const recipes = await db.collection('recipes')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return recipes.map(recipe => ({
      ...recipe,
      _id: recipe._id.toString()
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}