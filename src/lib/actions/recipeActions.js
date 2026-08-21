

'use server';

import { MongoClient, ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb'; // আপনার প্রজেক্টের মঙ্গোডিবি ক্লায়েন্ট
// import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

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

export async function deleteRecipe(recipeId) {
  try {
    const client = await clientPromise;
    const db = client.db('recipehouse');

    const result = await db.collection('recipes').deleteOne({
      _id: new ObjectId(recipeId)
    });

    if (result.deletedCount === 1) {
      // এই পাথটির ক্যাশ ক্লিয়ার করবে যাতে UI সাথে সাথে রিফ্রেশ হয়
      revalidatePath('/dashboard/users/myrecipes');
      
      return { 
        success: true, 
        message: 'Recipe deleted successfully!' 
      };
    }

    return { 
      success: false, 
      message: 'Recipe not found or already deleted.' 
    };

  } catch (error) {
    console.error('Error deleting recipe:', error);
    return { 
      success: false, 
      message: error.message || 'Something went wrong while deleting.' 
    };
  }
}




// export async function deleteRecipe(recipeId) {
//   try {
//     await client.connect();
//     const db = client.db('recipehouse');
//     await db.collection('recipes').deleteOne({ _id: new ObjectId(recipeId) });
//     return { success: true };
//   } catch (error) {
//     console.error('Error deleting recipe:', error);
//     return { success: false };
//   }
// }
