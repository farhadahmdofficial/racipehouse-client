

'use server';

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

// ১. সকল রেসিপি ফেচ করা
export async function getAllRecipes() {
  try {
    await client.connect();
    const db = client.db('recipehouse');
    const recipes = await db.collection('recipes').find({}).toArray();

    return recipes.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// ২. Featured স্ট্যাটাস টগল করা
export async function toggleFeaturedRecipe(recipeId, currentFeatured) {
  try {
    await client.connect();
    const db = client.db('recipehouse');
    await db.collection('recipes').updateOne(
      { _id: new ObjectId(recipeId) },
      { $set: { isFeatured: !currentFeatured } }
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false };
  }
}

// ৩. রেসিপি ডিলিট করা
export async function deleteRecipe(recipeId) {
  try {
    await client.connect();
    const db = client.db('recipehouse');
    await db.collection('recipes').deleteOne({ _id: new ObjectId(recipeId) });
    return { success: true };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return { success: false };
  }
}
