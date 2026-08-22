

'use server';

export async function getUserStats(userId, userEmail) {
  try {
    if (!userId && !userEmail) {
      return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
    }

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // ১. FavoritesPage এর হুবহু API Route ও Params পাস করা হলো
    const favRes = await fetch(
      `${SERVER_URL}/api/recipes/favorites?userId=${encodeURIComponent(userId || '')}&userEmail=${encodeURIComponent(userEmail || '')}`,
      { cache: 'no-store' }
    );
    
    let totalFavorites = 0;
    if (favRes.ok) {
      const favData = await favRes.json();
      
      // FavoritesPage এর মতোই ডাটা এক্সট্র্যাক্ট করা
      const favList = 
        favData?.favorites || 
        favData?.data || 
        (Array.isArray(favData) ? favData : []);
      
      totalFavorites = favList.length;
    }

    // ২. Recipes API ফেচ করা
    const recipesRes = await fetch(
      `${SERVER_URL}/recipes?userId=${encodeURIComponent(userId || '')}&userEmail=${encodeURIComponent(userEmail || '')}`,
      { cache: 'no-store' }
    );

    let totalRecipes = 0;
    let totalLikes = 0;

    if (recipesRes.ok) {
      const recipesData = await recipesRes.json();
      const userRecipes = 
        recipesData?.recipes || 
        recipesData?.data || 
        (Array.isArray(recipesData) ? recipesData : []);

      totalRecipes = userRecipes.length;

      totalLikes = userRecipes.reduce((acc, recipe) => {
        if (Array.isArray(recipe.likes)) return acc + recipe.likes.length;
        return acc + (Number(recipe.likes) || 0);
      }, 0);
    }

    return {
      totalRecipes,
      totalFavorites,
      totalLikes,
    };
  } catch (error) {
    console.error("getUserStats Error:", error);
    return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
  }
}







// 'use server';

// export async function getUserStats(userId, userEmail) {
//   try {
//     if (!userId && !userEmail) {
//       return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//     }

//     // const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

//     // ১. Favorites Page যেই এক্সপ্রেস API থেকে 'Total: 2' ডাটা আনছে, ঠিক সেটি কল করা
//     const favRes = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/users/favorites?userId=${userId || ''}&userEmail=${userEmail || ''}`,
//       { cache: 'no-store' }
//     );
    
//     let totalFavorites = 0;
//     if (favRes.ok) {
//       const favData = await favRes.json();
//       // API রেসপন্স অ্যারে অথবা অবজেক্ট যাই হোক না কেন হ্যান্ডেল করা
//       const favList = Array.isArray(favData) 
//         ? favData 
//         : (favData?.favorites || favData?.data || []);
      
//       totalFavorites = favList.length;
//     }

//     // ২. Recipes API থেকে ইউজারের রেসিপি ডাটা ফেচ করা
//     const recipesRes = await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/recipes?userId=${userId || ''}&userEmail=${userEmail || ''}`,
//       { cache: 'no-store' }
//     );

//     let totalRecipes = 0;
//     let totalLikes = 0;

//     if (recipesRes.ok) {
//       const recipesData = await recipesRes.json();
//       const userRecipes = Array.isArray(recipesData) 
//         ? recipesData 
//         : (recipesData?.recipes || recipesData?.data || []);

//       totalRecipes = userRecipes.length;

//       totalLikes = userRecipes.reduce((acc, recipe) => {
//         if (Array.isArray(recipe.likes)) return acc + recipe.likes.length;
//         return acc + (Number(recipe.likes) || 0);
//       }, 0);
//     }

//     return {
//       totalRecipes,
//       totalFavorites,
//       totalLikes,
//     };
//   } catch (error) {
//     console.error("getUserStats Error:", error);
//     return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//   }
// }






// 'use server';

// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// export async function getUserStats(userId, userEmail) {
//   try {
//     if (!userId && !userEmail) {
//       return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//     }

//     const client = await clientPromise;
//     const db = client.db('recipehouse'); // আপনার মূল MongoDB Database Name

//     // ১. User Query Condition তৈরি
//     const userConditions = [];
//     if (userId) {
//       const cleanId = String(userId).trim();
//       userConditions.push({ userId: cleanId });
//       userConditions.push({ user_id: cleanId });
//       userConditions.push({ user: cleanId });
//       if (ObjectId.isValid(cleanId)) {
//         userConditions.push({ userId: new ObjectId(cleanId) });
//         userConditions.push({ user_id: new ObjectId(cleanId) });
//         userConditions.push({ user: new ObjectId(cleanId) });
//       }
//     }
//     if (userEmail) {
//       const cleanEmail = String(userEmail).trim();
//       userConditions.push({ userEmail: cleanEmail });
//       userConditions.push({ email: cleanEmail });
//       userConditions.push({ user_email: cleanEmail });
//     }

//     const query = userConditions.length > 0 ? { $or: userConditions } : { _id: null };

//     // ২. Total Recipes Count
//     const totalRecipes = await db.collection('recipes').countDocuments(query);

//     // ৩. Total Favorites Count (Favorites Page Express API matching)
//     const totalFavorites = await db.collection('favorites').countDocuments(query);

//     // ৪. Total Likes Count
//     const userRecipes = await db.collection('recipes').find(query, { projection: { likes: 1 } }).toArray();
//     const totalLikes = userRecipes.reduce((acc, recipe) => {
//       if (Array.isArray(recipe.likes)) return acc + recipe.likes.length;
//       return acc + (Number(recipe.likes) || 0);
//     }, 0);

//     return {
//       totalRecipes,
//       totalFavorites,
//       totalLikes,
//     };
//   } catch (error) {
//     console.error("getUserStats Error:", error);
//     return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//   }
// }










// 'use server';

// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// export async function getUserStats(userId, userEmail) {
//   try {
//     if (!userId && !userEmail) {
//       return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//     }

//     const client = await clientPromise;
//     const db = client.db('recipehouse');

//     // ১. Recipes ফিল্টার
//     const recipeQueryConditions = [];
//     if (userId) {
//       recipeQueryConditions.push({ userId: String(userId) });
//       if (ObjectId.isValid(userId)) recipeQueryConditions.push({ userId: new ObjectId(userId) });
//     }
//     if (userEmail) {
//       recipeQueryConditions.push({ userEmail: String(userEmail) });
//       recipeQueryConditions.push({ email: String(userEmail) });
//     }

//     const recipeQuery = recipeQueryConditions.length > 0 ? { $or: recipeQueryConditions } : { _id: null };

//     // ২. Favorites ফিল্টার (ডাটাবেজে সম্ভাব্য সব ফিল্ড নেম কভার করা হয়েছে)
//     const favQueryConditions = [];
//     if (userId) {
//       const cleanId = String(userId);
//       favQueryConditions.push({ userId: cleanId });
//       favQueryConditions.push({ user_id: cleanId });
//       favQueryConditions.push({ userID: cleanId });
//       if (ObjectId.isValid(cleanId)) {
//         favQueryConditions.push({ userId: new ObjectId(cleanId) });
//         favQueryConditions.push({ user_id: new ObjectId(cleanId) });
//       }
//     }
//     if (userEmail) {
//       const cleanEmail = String(userEmail);
//       favQueryConditions.push({ userEmail: cleanEmail });
//       favQueryConditions.push({ email: cleanEmail });
//       favQueryConditions.push({ user_email: cleanEmail });
//     }

//     const favQuery = favQueryConditions.length > 0 ? { $or: favQueryConditions } : { _id: null };

//     // ৩. ডাটাবেজ থেকে গণনা
//     const totalRecipes = await db.collection('recipes').countDocuments(recipeQuery);
    
//     // Favorites গণনা (কালেকশন নাম 'favorites' বা 'bookmarks' চেক করা)
//     let totalFavorites = await db.collection('favorites').countDocuments(favQuery).catch(() => 0);
//     if (totalFavorites === 0) {
//       totalFavorites = await db.collection('bookmarks').countDocuments(favQuery).catch(() => 0);
//     }

//     // ৪. Likes Received গণনা
//     const userRecipes = await db.collection('recipes').find(recipeQuery, { projection: { likes: 1 } }).toArray();
//     const totalLikes = userRecipes.reduce((acc, recipe) => {
//       if (Array.isArray(recipe.likes)) return acc + recipe.likes.length;
//       return acc + (Number(recipe.likes) || 0);
//     }, 0);

//     return {
//       totalRecipes,
//       totalFavorites,
//       totalLikes,
//     };
//   } catch (error) {
//     console.error("getUserStats Error:", error);
//     return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//   }
// }





// ok code 

// 'use server';

// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// export async function getUserStats(userId, userEmail) {
//   try {
//     if (!userId && !userEmail) {
//       return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//     }

//     const client = await clientPromise;
//     const db = client.db('recipehouse');

//     // MyRecipesPage এর হুবহু ফিল্টার কন্ডিশন
//     const queryConditions = [];

//     if (userId) {
//       queryConditions.push({ userId: String(userId) });
//       if (ObjectId.isValid(userId)) {
//         queryConditions.push({ userId: new ObjectId(userId) });
//       }
//     }

//     if (userEmail) {
//       queryConditions.push({ userEmail: String(userEmail) });
//       queryConditions.push({ email: String(userEmail) });
//     }

//     const query = queryConditions.length > 0 ? { $or: queryConditions } : { _id: null };

//     // ১. মোট রেসিপি গণনা
//     const totalRecipes = await db.collection('recipes').countDocuments(query);

//     // ২. মোট ফেভারিট গণনা
//     const totalFavorites = await db.collection('favorites')
//       .countDocuments(query)
//       .catch(() => 0);

//     // ৩. লাইক সংখ্যা গণনা
//     const userRecipes = await db.collection('recipes')
//       .find(query, { projection: { likes: 1 } })
//       .toArray();

//     const totalLikes = userRecipes.reduce((acc, recipe) => {
//       if (Array.isArray(recipe.likes)) return acc + recipe.likes.length;
//       return acc + (Number(recipe.likes) || 0);
//     }, 0);

//     return {
//       totalRecipes,
//       totalFavorites,
//       totalLikes,
//     };
//   } catch (error) {
//     console.error("getUserStats Error:", error);
//     return { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
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

