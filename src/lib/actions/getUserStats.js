
'use server';

import { MongoClient, ObjectId } from 'mongodb';

export async function getUserStats(userId, userEmail) {
  if (!process.env.MONGODB_URI || (!userId && !userEmail)) {
    return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('recipehouse'); // আপনার সঠিক DB নাম দিন

    let userObjectId = (userId && ObjectId.isValid(userId)) ? new ObjectId(userId) : null;

    // 1. ইউজার কতটি রেসিপি তৈরি করেছেন
    const totalRecipes = await db.collection('recipes').countDocuments({
      $or: [
        { userId: userId },
        { userId: userObjectId },
        { userEmail: userEmail },
        { email: userEmail }
      ].filter(Boolean)
    });

    // 2. ইউজার কতটি রেসিপি Favorite করেছেন
    const totalFavorites = await db.collection('favorites').countDocuments({
      $or: [
        { userId: userId },
        { userId: userObjectId },
        { userEmail: userEmail }
      ].filter(Boolean)
    });

    // 3. ইউজারের নিজস্ব রেসিপিগুলোতে প্রাপ্ত মোট Likes (Aggregation)
    const likesResult = await db.collection('recipes').aggregate([
      {
        $match: {
          $or: [
            { userId: userId },
            { userId: userObjectId },
            { userEmail: userEmail }
          ].filter(Boolean)
        }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" }
        }
      }
    ]).toArray();

    const totalLikes = likesResult[0]?.totalLikes || 0;

    return { totalRecipes, totalFavorites, totalLikes };

  } catch (err) {
    console.error("Stats fetching error:", err);
    return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
  } finally {
    await client.close();
  }
}






// "use server";

// const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// export async function getUserStats(userId, email) {
//   try {
//     const res = await fetch(`${SERVER_URL}/user/stats?email=${email}`, { cache: 'no-store' });
//     return await res.json();
//   } catch (error) {
//     return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//   }
// }

// export async function getAdminStats() {
//   try {
//     const res = await fetch(`${SERVER_URL}/admin/stats`, { cache: 'no-store' });
//     return await res.json();
//   } catch (error) {
//     return { totalUsers: 0, totalRecipes: 0, premiumMembers: 0, totalReports: 0 };
//   }
// }








// export async function getAdminStats() {
//   try {
//     const res = await fetch(`${SERVER_URL}/admin/stats`, { 
//       cache: 'no-store' // ক্যাশিং বন্ধ রাখতে
//     });
    
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching admin stats in action:", error);
//     return { totalUsers: 0, totalRecipes: 0, premiumMembers: 0, totalReports: 0 };
//   }
// }

