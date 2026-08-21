


import { auth } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { headers } from 'next/headers';
import { deleteRecipe } from '@/lib/actions/recipeActions';

export const dynamic = 'force-dynamic';

export default async function MyRecipesPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Add your Recipe</h2>
          <Link href="/dashboard/users/addrecipe" className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl">
            Add Recipe
          </Link>
        </div>
      </div>
    );
  }

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  try {
    const client = await clientPromise;
    const db = client.db('recipehouse');

    // Safe ObjectId conversion Check
    let userObjectId = null;
    if (userId && ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
    }

    // Dynamic query conditions (Capital 'ID', Small 'id', Email & ObjectId-all covered)
    const queryConditions = [];

    if (userId) {
      const cleanUserId = String(userId).trim();
      queryConditions.push({ userId: cleanUserId });   // camelCase String
      queryConditions.push({ userID: cleanUserId });   // Capital ID String
      queryConditions.push({ user_id: cleanUserId });  // snake_case
    }

    if (userObjectId) {
      queryConditions.push({ userId: userObjectId });  // camelCase ObjectId
      queryConditions.push({ userID: userObjectId });  // Capital ID ObjectId
      queryConditions.push({ user_id: userObjectId }); // snake_case ObjectId
    }

    if (userEmail) {
      const cleanEmail = String(userEmail).trim();
      queryConditions.push({ userEmail: cleanEmail });
      queryConditions.push({ email: cleanEmail });
      queryConditions.push({ user_email: cleanEmail });
    }

    const query = queryConditions.length > 0 ? { $or: queryConditions } : { _id: null };

    // Debugging: terminal console check
    console.log("👉 Fetching recipes for Query:", JSON.stringify(query));

    const recipes = await db.collection('recipes')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      _id: recipe._id.toString()
    }));

    console.log("👉 Found Recipes Count:", formattedRecipes.length);

    return (
      <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
                My Recipes ({formattedRecipes.length})
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Manage your culinary creations.
              </p>
            </div>
            <Link
              href="/dashboard/users/addrecipe"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              <FaPlus /> Add New Recipe
            </Link>
          </div>

          {/* Recipe List */}
          {formattedRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <div className="text-4xl text-slate-300 dark:text-slate-700 mb-3">🍽️</div>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                You have not posted any recipes yet.
              </p>
              <Link
                href="/dashboard/users/addrecipe"
                className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
              >
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                      <th className="py-4 px-6">Recipe</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    {formattedRecipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                              alt={recipe.name || "Recipe"}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                                {recipe.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                                {recipe.instructions || recipe.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                          {recipe.category || 'General'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-orange-600 dark:text-orange-400">
                          ${recipe.price || 0}
                        </td>
                        <td className="py-4 px-6">
                          {recipe.status && (
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                              recipe.status === 'approved'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                            }`}>
                              {recipe.status}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <form action={deleteRecipe}>
                            <input type="hidden" name="id" value={recipe._id} />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return <div className="text-center py-20 text-red-500">Failed to load recipes.</div>;
  }
}





// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { headers } from 'next/headers';
// import { deleteRecipe } from '@/lib/actions/recipeActions';
// import { useId } from 'react';

// export const dynamic = 'force-dynamic';

// export default async function MyRecipesPage() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
//           <h2 className="text-2xl font-bold mb-4"> Add  your Recipe</h2>
//           <Link href="/addrecipe" className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl">
//             Add Recipe
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userId = session?.user?.id;
//   const userEmail = session?.user?.email;

//   console.log(userId,"userId");

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('Please add your Mongo URI to .env.local');

//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('recipehouse');

//     // Safe ObjectId conversion Check
//     let userObjectId = null;
//     if (userId && ObjectId.isValid(userId)) {
//       userObjectId = new ObjectId(userId);
//     }

//     // dynamic query conditions
//     const queryConditions = [];

//     if (userId) {
//       queryConditions.push({ userId: userId });
//       queryConditions.push({ userId: userId.trim() });
//     }
//     if (userObjectId) {
//       queryConditions.push({ userId: userObjectId });
//     }
//     if (userEmail) {
//       queryConditions.push({ userEmail: userEmail });
//       queryConditions.push({ email: userEmail });
//     }

//     const query = queryConditions.length > 0 ? { $or: queryConditions } : { _id: null };

//     const recipes = await db.collection('recipes')
//       .find(query)
//       .sort({ createdAt: -1 })
//       .toArray();

//     const formattedRecipes = recipes.map(recipe => ({
//       ...recipe,
//       _id: recipe._id.toString()
//     }));
//     console.log(formattedRecipes,'formattedRecipes');

//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//             <div>
//               <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//                 My Recipes ({formattedRecipes.length})
//               </h1>
//               <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//                 Manage your culinary creations.
//               </p>
//             </div>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//             >
//               <FaPlus /> Add New Recipe
//             </Link>
//           </div>

//           {/* Recipe List */}
//           {formattedRecipes.length === 0 ? (
//             <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//               <div className="text-4xl text-slate-300 dark:text-slate-700 mb-3">🍽️</div>
//               <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
//                 You have not posted any recipes yet.
//               </p>
//               <Link
//                 href="/dashboard/users/addrecipe"
//                 className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//               >
//                 Create Your First Recipe
//               </Link>
//             </div>
//           ) : (
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
//                       <th className="py-4 px-6">Recipe</th>
//                       <th className="py-4 px-6">Category</th>
//                       <th className="py-4 px-6">Price</th>
//                       <th className="py-4 px-6">Status</th>
//                       <th className="py-4 px-6 text-right">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
//                     {formattedRecipes.map((recipe) => (
//                       <tr key={recipe._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-4">
//                             <img
//                               src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
//                               alt={recipe.name || "Recipe"}
//                               className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
//                             />
//                             <div>
//                               <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
//                                 {recipe.name}
//                               </h3>
//                               <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
//                                 {recipe.instructions || recipe.description || "No description provided"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
//                           {recipe.category || 'General'}
//                         </td>
//                         <td className="py-4 px-6 font-semibold text-orange-600 dark:text-orange-400">
//                           ${recipe.price || 0}
//                         </td>
//                         <td className="py-4 px-6">
//                           {recipe.status && (
//                             <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
//                               recipe.status === 'approved'
//                                 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
//                                 : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
//                             }`}>
//                               {recipe.status}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-4 px-6 text-right">
//                           <form action={deleteRecipe}>
//                             <input type="hidden" name="id" value={recipe._id} />
//                             <button
//                               type="submit"
//                               className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition"
//                             >
//                               Delete
//                             </button>
//                           </form>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } finally {
//     await client.close();
//   }
// }



// ok code 
// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { headers } from 'next/headers';
// // import { mytollte } from '@/lib/actions/myrecipes';

// export default async function MyRecipesPage() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
//           <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//           <Link href="/login" className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ১. Session থেকে ID ও Email নেওয়া
//   const userId = session?.user?.id;
//   const userEmail = session?.user?.email;

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('Please add your Mongo URI to .env.local');

//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('recipehouse');

//     // Safe ObjectId conversion
//     let userObjectId = null;
//     if (userId && ObjectId.isValid(userId)) {
//       userObjectId = new ObjectId(userId);
//     }

//     // ২. ফিল্টারিং পছন্দমতো যেকোনো একটি মিললেই ডাটা নিয়ে আসবে
//     const recipes = await db.collection('recipes')
//       .find({
//         $or: [
//           { userId: userId },             // String matching
//           { userId: userObjectId },       // ObjectId matching
//           { userEmail: userEmail },       // Email matching (যদি সেভ থাকে)
//           { email: userEmail }
//         ]
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     const formattedRecipes = recipes.map(recipe => ({
//       ...recipe,
//       _id: recipe._id.toString()
//     }));

    

//     return (<div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               My Recipes ({formattedRecipes.length})
//             </h1> 
            

//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage your culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Recipe List Table */}
//         {formattedRecipes.length === 0 ? (
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <div className="text-4xl text-slate-300 dark:text-slate-700 mb-3">🍽️</div>
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
//                     <th className="py-4 px-6">Recipe</th>
//                     <th className="py-4 px-6">Category</th>
//                     <th className="py-4 px-6">Price</th>
//                     <th className="py-4 px-6">Status</th>
//                     <th className="py-4 px-6 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
//                   {formattedRecipes.map((recipe) => (
//                     <tr key={recipe._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-4">
//                           <img
//                             src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
//                             alt={recipe.name || "Recipe"}
//                             className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
//                           />
//                           <div>
//                             <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
//                               {recipe.name}
//                             </h3>
//                             <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
//                               {recipe.instructions || recipe.description || "No description provided"}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
//                         {recipe.category || 'General'}
//                       </td>
//                       <td className="py-4 px-6 font-semibold text-orange-600 dark:text-orange-400">
//                         ${recipe.price || 0}
//                       </td>
//                       <td className="py-4 px-6">
//                         {recipe.status && (
//                           <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
//                             recipe.status === 'approved'
//                               ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
//                               : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
//                           }`}>
//                             {recipe.status}
//                           </span>
//                         )}
//                       </td>

//                       {/* Server Action Form Delete Button */}
//                       <td className="py-4 px-6 text-right">
//                         <form >
//                           <input type="hidden" name="id" value={recipe._id} />
//                           <button
//                             type="submit"
//                             className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition"
//                           >
//                             Delete
//                           </button>
//                         </form>
//                         {/* <form action={deleterecipe}>
//                           <input type="hidden" name="id" value={recipe._id} />
//                           <button
//                             type="submit"
//                             className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-950/40 hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800/60 px-3.5 py-1.5 rounded-lg transition"
//                           >
//                             Delete
//                           </button>
//                         </form> */}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
    
// //     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
// //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //     {/* Header */}
// //     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
// //       <div>
// //         <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
// //           My Recipes ({formattedRecipes.length})
// //         </h1>
// //         <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
// //           Manage your culinary creations.
// //         </p>
// //       </div>
// //       <Link
// //         href="/dashboard/users/addrecipe"
// //         className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
// //       >
// //         <FaPlus /> Add New Recipe
// //       </Link>
// //     </div>

// //     {/* Recipe List - Table View */}
// //     {formattedRecipes.length === 0 ? (
// //       <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
// //         <div className="text-4xl text-slate-300 dark:text-slate-700 mb-3">🍽️</div>
// //         <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
// //           You haven't posted any recipes yet.
// //         </p>
// //         <Link
// //           href="/dashboard/users/addrecipe"
// //           className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
// //         >
// //           Create Your First Recipe
// //         </Link>
// //       </div>
// //     ) : (
// //       <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left border-collapse">
// //             <thead>
// //               <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
// //                 <th className="py-4 px-6">Recipe</th>
// //                 <th className="py-4 px-6">Category</th>
// //                 <th className="py-4 px-6">Price</th>
// //                 <th className="py-4 px-6">Status</th>
// //                 <th className="py-4 px-6 text-right">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
// //               {formattedRecipes.map((recipe) => (
// //                 <tr key={recipe._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
// //                   {/* Image & Title */}
// //                   <td className="py-4 px-6">
// //                     <div className="flex items-center gap-4">
// //                       <img
// //                         src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
// //                         alt={recipe.name || "Recipe"}
// //                         className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
// //                       />
// //                       <div>
// //                         <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
// //                           {recipe.name}
// //                         </h3>
// //                         <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
// //                           {recipe.instructions || recipe.description || "No description provided"}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </td>

// //                   {/* Category */}
// //                   <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
// //                     {recipe.category || 'General'}
// //                   </td>

// //                   {/* Price */}
// //                   <td className="py-4 px-6 font-semibold text-orange-600 dark:text-orange-400">
// //                     ${recipe.price || 0}
// //                   </td>

// //                   {/* Status */}
// //                   <td className="py-4 px-6">
// //                     {recipe.status && (
// //                       <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
// //                         recipe.status === 'approved'
// //                           ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
// //                           : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
// //                       }`}>
// //                         {recipe.status}
// //                       </span>
// //                     )}
// //                   </td>

// //                   {/* Action */}
// //                   <td className="py-4 px-6 text-right">
// //                     <Link
// //                       href={`/dashboard/users/myrecipes/${recipe._id}`}
// //                       className="inline-block text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-lg transition"
// //                     >
// //                       View
// //                     </Link>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     )}
// //   </div>
// // </div>



//       // <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       //     {/* Header */}
//       //     <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//       //       <div>
//       //         <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//       //           My Recipes ({formattedRecipes.length})
//       //         </h1>
//       //         <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//       //           Manage your culinary creations.
//       //         </p>
//       //       </div>
//       //       <Link
//       //         href="/dashboard/users/addrecipe"
//       //         className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//       //       >
//       //         <FaPlus /> Add New Recipe
//       //       </Link>
//       //     </div>

//       //     {/* Recipe List */}
//       //     {formattedRecipes.length === 0 ? (
//       //       <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//       //         <div className="text-4xl text-slate-300 dark:text-slate-700 mb-3">🍽️</div>
//       //         <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
//       //           You haven't posted any recipes yet.
//       //         </p>
//       //         <Link
//       //           href="/dashboard/users/addrecipe"
//       //           className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//       //         >
//       //           Create Your First Recipe
//       //         </Link>
//       //       </div>
//       //     ) : (
//       //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       //         {formattedRecipes.map((recipe) => (
//       //           <div
//       //             key={recipe._id}
//       //             className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-800/80"
//       //           >
//       //             <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative">
//       //               <img
//       //                 src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
//       //                 alt={recipe.name || "Recipe"}
//       //                 className="w-full h-full object-cover"
//       //               />
//       //               {recipe.status && (
//       //                 <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
//       //                   recipe.status === 'approved' 
//       //                     ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
//       //                     : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
//       //                 }`}>
//       //                   {recipe.status}
//       //                 </span>
//       //               )}
//       //             </div>
//       //             <div className="p-5">
//       //               <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
//       //                 {recipe.name}
//       //               </h3>
//       //               <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
//       //                 {recipe.instructions || recipe.description || "No instructions provided"}
//       //               </p>
//       //               <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 border-slate-100 dark:border-slate-800">
//       //                 <span>Category: {recipe.category || 'General'}</span>
//       //                 <span className="font-semibold text-orange-600 dark:text-orange-400">
//       //                   ${recipe.price || 0}
//       //                 </span>
//       //               </div>
//       //             </div>
//       //           </div>
//       //         ))}
//       //       </div>
//       //     )}
//       //   </div>
//       // </div>
//     );
//   } finally {
//     await client.close();
//   }
// }








// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { headers } from 'next/headers';

// export default async function MyRecipesPage() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
//           <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//           <Link href="/login" className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userId = session.user.id;

//   // const userId = session.user.id;
// console.log("Logged in User ID:", userId);
// console.log("Type of User ID:", typeof userId);

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('Please add your Mongo URI to .env.local');

//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('recipes');

//     // userId String অথবা ObjectId দুটোই সাপোর্ট করার জন্য
//     let userObjectId = null;
//     try {
//       userObjectId = new ObjectId(userId);
//     } catch (e) {}

//     // ১. আপনার ডাটাবেজে isPublished নেই, status রয়েছে।
//     // ২. নিজস্ব রেসিপি দেখার জন্য status ফিল্টার বাদ দেওয়া সবচেয়ে নিরাপদ।
//     const recipes = await db.collection('recipes')
//       .find({
//         $or: [
//           { userId: userId },           // String (যেমন আপনার ডাটাতে আছে: "6a721f72d1e2a237da9d1ba1")
//           { userId: userObjectId }      // ObjectId fallback
//         ]
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     const formattedRecipes = recipes.map(recipe => ({
//       ...recipe,
//       _id: recipe._id.toString()
//     }));

//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//             <div>
//               <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//                 My Recipes ({formattedRecipes.length})
//               </h1>
//               <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//                 Manage your culinary creations.
//               </p>
//             </div>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//             >
//               <FaPlus /> Add New Recipe
//             </Link>
//           </div>

//           {formattedRecipes.length === 0 ? (
//             <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80">
//               <div className="text-4xl mb-3">🍽️</div>
//               <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//                 You haven't posted any recipes yet.
//               </p>
//               <Link
//                 href="/dashboard/users/addrecipe"
//                 className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//               >
//                 Create Your First Recipe
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {formattedRecipes.map((recipe) => (
//                 <div
//                   key={recipe._id}
//                   className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800/80"
//                 >
//                   <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative">
//                     <img
//                       src={recipe.image}
//                       alt={recipe.name}
//                       className="w-full h-full object-cover"
//                     />
//                     <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
//                       recipe.status === 'approved' 
//                         ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
//                         : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
//                     }`}>
//                       {recipe.status || 'pending'}
//                     </span>
//                   </div>
//                   <div className="p-5">
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
//                       {recipe.name}
//                     </h3>
//                     <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
//                       {recipe.instructions}
//                     </p>
//                     <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 border-slate-100 dark:border-slate-800">
//                       <span>Category: {recipe.category}</span>
//                       <span>Price: ${recipe.price}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } finally {
//     await client.close();
//   }
// }


// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { headers } from 'next/headers';

// export default async function MyRecipesPage() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center py-20 bg-white dark:bg-slate-900 rounded-2xl">
//           <h2 className="text-2xl font-bold mb-4">Please Login</h2>
//           <Link href="/login" className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl">
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userId = session.user.id;

//   console.log(userId ,"new user");

//   const userEmail = session.user.email; // ইমেইল ব্যাকআপের জন্য

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('Please add your Mongo URI to .env.local');

//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('recipes');

//     // String ও ObjectId উভয় ফরম্যাটের জন্য প্রস্তুতি
//     let userObjectId = null;
//     try {
//       userObjectId = new ObjectId(userId);
//     } catch (e) {}

//     // Flexible Query: String, ObjectId অথবা Email দিয়ে ফিল্টার করবে
//     const recipes = await db.collection('recipes')
//       .find({
//         $or: [
//           { userId: userId },
//           { userId: userObjectId },
//           { userEmail: userEmail }
//         ]
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     const formattedRecipes = recipes.map(recipe => ({
//       ...recipe,
//       _id: recipe._id.toString()
//     }));

//     return (
//       <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//             <div>
//               <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//                 {formattedRecipes.length} My Recipes
//               </h1>
//               <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//                 Manage your culinary creations.
//               </p>
//             </div>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//             >
//               <FaPlus /> Add New Recipe
//             </Link>
//           </div>

//           {formattedRecipes.length === 0 ? (
//             <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80">
//               <div className="text-4xl mb-3">🍽️</div>
//               <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//                 You haven't posted any recipes yet.
//               </p>
//               <Link
//                 href="/dashboard/users/addrecipe"
//                 className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//               >
//                 Create Your First Recipe
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {formattedRecipes.map((recipe) => (
//                 <div
//                   key={recipe._id}
//                   className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800/80"
//                 >
//                   <div className="w-full h-48 bg-slate-100 dark:bg-slate-800">
//                     <img
//                       src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
//                       alt={recipe.name || "Recipe"}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-5">
//                     <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
//                       {recipe.name}
//                     </h3>
//                     <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
//                       {recipe.description || "No description available"}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">
//                         {recipe.category || 'General'}
//                       </span>
//                       <Link
//                         href={`/dashboard/users/recipes/${recipe._id}`}
//                         className="text-orange-600 hover:text-orange-700 text-sm font-medium"
//                       >
//                         View →
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   } finally {
//     await client.close();
//   }
// }








// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSpinner,
//   FaUtensils,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { myRecipes } from "@/lib/actions/recipes";

// const MyRecipesPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes using getRecipes()
//   const fetchMyRecipes = async () => {
//     try {
//       const response = await myRecipes();
//       // const response = await myRecipes();

//       let list = [];
//       if (Array.isArray(response)) {
//         list = response;
//       } else if (Array.isArray(response?.data)) {
//         list = response.data;
//       } else if (Array.isArray(response?.recipes)) {
//         list = response.recipes;
//       }

//       setRecipes(list);
//     } catch (error) {
//       console.error("Failed to load recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         price: Number(selectedRecipe.price) || 0,
//         image: selectedRecipe.image,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients?.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions?.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               {recipes.length} My Recipes
//             </h1>
//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage, update, or remove your published culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Main Content Area */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <FaUtensils className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           /* Spaced Table Layout */
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-separate border-spacing-y-3">
//               <thead>
//                 <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
//                   <th className="pb-3 px-8">Image</th>
//                   <th className="pb-3 px-6">Recipe Name</th>
//                   <th className="pb-3 px-6">Price</th>
//                   <th className="pb-3 px-8 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm">
//                 <AnimatePresence>
//                   {recipes.map((recipe) => (
//                     <motion.tr
//                       key={recipe._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all rounded-2xl"
//                     >
//                       {/* Image Column */}
//                       <td className="py-4 px-8 rounded-l-2xl border-y border-l border-slate-200/80 dark:border-slate-800/80">
//                         <img
//                           src={
//                             recipe.image ||
//                             "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
//                           }
//                           alt={recipe.name || "Recipe"}
//                           className="w-16 h-16 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
//                         />
//                       </td>

//                       {/* Name Column */}
//                       <td className="py-4 px-6 border-y border-slate-200/80 dark:border-slate-800/80 font-semibold text-slate-900 dark:text-slate-100 align-middle">
//                         {recipe.name}
//                       </td>

//                       {/* Price Column */}
//                       <td className="py-4 px-6 border-y border-slate-200/80 dark:border-slate-800/80 font-bold text-orange-600 dark:text-orange-500 whitespace-nowrap align-middle">
//                         ${Number(recipe.price || 0).toFixed(2)}
//                       </td>

//                       {/* Action Column */}
//                       <td className="py-4 px-8 rounded-r-2xl border-y border-r border-slate-200/80 dark:border-slate-800/80 text-center align-middle">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() =>
//                               setSelectedRecipe({
//                                 ...recipe,
//                                 ingredients: Array.isArray(recipe.ingredients)
//                                   ? recipe.ingredients.join(", ")
//                                   : recipe.ingredients || "",
//                                 instructions: Array.isArray(recipe.instructions)
//                                   ? recipe.instructions.join("\n")
//                                   : recipe.instructions || "",
//                               })
//                             }
//                             className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
//                           >
//                             <FaEdit /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(recipe._id)}
//                             disabled={deletingId === recipe._id}
//                             className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium transition disabled:opacity-50"
//                           >
//                             {deletingId === recipe._id ? (
//                               <FaSpinner className="animate-spin" />
//                             ) : (
//                               <>
//                                 <FaTrash /> Delete
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* --- UPDATE MODAL --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                   Update Recipe
//                 </h2>
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               {/* Modal Form */}
//               <form
//                 onSubmit={handleUpdateSubmit}
//                 className="p-6 space-y-4 overflow-y-auto"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Recipe Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         name: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={selectedRecipe.category || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           category: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Cuisine
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedRecipe.cuisine || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           cuisine: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Prep Time (mins)
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           prepTime: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedRecipe.price ?? ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           price: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={selectedRecipe.image || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         image: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Ingredients (comma separated)
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={selectedRecipe.ingredients || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         ingredients: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save
//                     Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;












// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSpinner,
//   FaUtensils,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { getRecipes } from "@/lib/actions/recipes";

// const MyRecipesPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes using getRecipes()
//   const fetchMyRecipes = async () => {
//     try {
//       const response = await getRecipes();

//       let list = [];
//       if (Array.isArray(response)) {
//         list = response;
//       } else if (Array.isArray(response?.data)) {
//         list = response.data;
//       } else if (Array.isArray(response?.recipes)) {
//         list = response.recipes;
//       }

//       setRecipes(list);
//     } catch (error) {
//       console.error("Failed to load recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         price: Number(selectedRecipe.price) || 0,
//         image: selectedRecipe.image,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients?.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions?.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               My Recipes
//             </h1>
//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage, update, or remove your published culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Main Content Area */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <FaUtensils className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           /* Table View */
//           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
//                     <th className="py-4 px-6">Image</th>
//                     <th className="py-4 px-6">Recipe Name</th>
//                     <th className="py-4 px-6">Price</th>
//                     <th className="py-4 px-6 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm ">
//                   <AnimatePresence>
//                     {recipes.map((recipe) => (
//                       <motion.tr
//                         key={recipe._id}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition "
//                       >
//                         {/* Image Column */}
//                         <td className="py-4 px-6">
//                           <img
//                             src={
//                               recipe.image ||
//                               "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
//                             }
//                             alt={recipe.name || "Recipe"}
//                             className="w-16 h-16 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
//                           />
//                         </td>

//                         {/* Name Column */}
//                         <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
//                           {recipe.name}
//                         </td>

//                         {/* Price Column */}
//                         <td className="py-4 px-6 font-bold text-orange-600 dark:text-orange-500 whitespace-nowrap">
//                           ${Number(recipe.price || 0).toFixed(2)}
//                         </td>

//                         {/* Action Column */}
//                         <td className="py-4 px-6 text-center">
//                           <div className="flex items-center justify-center gap-3">
//                             <button
//                               onClick={() =>
//                                 setSelectedRecipe({
//                                   ...recipe,
//                                   ingredients: Array.isArray(recipe.ingredients)
//                                     ? recipe.ingredients.join(", ")
//                                     : recipe.ingredients || "",
//                                   instructions: Array.isArray(
//                                     recipe.instructions
//                                   )
//                                     ? recipe.instructions.join("\n")
//                                     : recipe.instructions || "",
//                                 })
//                               }
//                               className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
//                             >
//                               <FaEdit /> Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(recipe._id)}
//                               disabled={deletingId === recipe._id}
//                               className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-medium transition disabled:opacity-50"
//                             >
//                               {deletingId === recipe._id ? (
//                                 <FaSpinner className="animate-spin" />
//                               ) : (
//                                 <>
//                                   <FaTrash /> Delete
//                                 </>
//                               )}
//                             </button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* --- UPDATE MODAL --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                   Update Recipe
//                 </h2>
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               {/* Modal Form */}
//               <form
//                 onSubmit={handleUpdateSubmit}
//                 className="p-6 space-y-4 overflow-y-auto"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Recipe Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         name: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={selectedRecipe.category || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           category: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Cuisine
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedRecipe.cuisine || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           cuisine: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Prep Time (mins)
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           prepTime: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedRecipe.price ?? ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           price: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={selectedRecipe.image || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         image: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Ingredients (comma separated)
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={selectedRecipe.ingredients || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         ingredients: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save
//                     Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;










// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSpinner,
//   FaUtensils,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { getRecipes } from "@/lib/actions/recipes";

// const MyRecipesPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes using getRecipes()
//   const fetchMyRecipes = async () => {
//     try {
//       const response = await getRecipes();

//       let list = [];
//       if (Array.isArray(response)) {
//         list = response;
//       } else if (Array.isArray(response?.data)) {
//         list = response.data;
//       } else if (Array.isArray(response?.recipes)) {
//         list = response.recipes;
//       }

//       setRecipes(list);
//     } catch (error) {
//       console.error("Failed to load recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         price: Number(selectedRecipe.price) || 0,
//         image: selectedRecipe.image,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients?.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions?.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               My Recipes
//             </h1>
//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage, update, or remove your published culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Main Content Area */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <FaUtensils className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           /* Recipes Grid Overview (Name, Price & Image Only) */
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             <AnimatePresence>
//               {recipes.map((recipe, index) => (
//                 <motion.div
//                   key={recipe._id}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
//                 >
//                   <div>
//                     {/* Image */}
//                     <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
//                       <img
//                         src={
//                           recipe.image ||
//                           "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
//                         }
//                         alt={recipe.name || "Recipe"}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>

//                     {/* Name & Price */}
//                     <div className="p-5 flex items-start justify-between gap-3">
//                       <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
//                         {recipe.name}
//                       </h3>
//                       <span className="text-lg font-extrabold text-orange-600 dark:text-orange-500 whitespace-nowrap">
//                         ${Number(recipe.price || 0).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Buttons (Edit & Delete) */}
//                   <div className="p-5 pt-0 flex items-center gap-3">
//                     <button
//                       onClick={() =>
//                         setSelectedRecipe({
//                           ...recipe,
//                           ingredients: Array.isArray(recipe.ingredients)
//                             ? recipe.ingredients.join(", ")
//                             : recipe.ingredients || "",
//                           instructions: Array.isArray(recipe.instructions)
//                             ? recipe.instructions.join("\n")
//                             : recipe.instructions || "",
//                         })
//                       }
//                       className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2 rounded-xl transition"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(recipe._id)}
//                       disabled={deletingId === recipe._id}
//                       className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium py-2 rounded-xl transition disabled:opacity-50"
//                     >
//                       {deletingId === recipe._id ? (
//                         <FaSpinner className="animate-spin" />
//                       ) : (
//                         <>
//                           <FaTrash /> Delete
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* --- UPDATE MODAL --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                   Update Recipe
//                 </h2>
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               {/* Modal Form */}
//               <form
//                 onSubmit={handleUpdateSubmit}
//                 className="p-6 space-y-4 overflow-y-auto"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Recipe Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={selectedRecipe.category || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, category: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Cuisine
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedRecipe.cuisine || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, cuisine: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Prep Time (mins)
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, prepTime: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedRecipe.price ?? ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           price: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={selectedRecipe.image || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, image: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Ingredients (comma separated)
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={selectedRecipe.ingredients || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         ingredients: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save
//                     Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;




















// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSpinner,
//   FaUtensils,
//   FaGlobe,
//   FaClock,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { getRecipes } from "@/lib/actions/recipes";

// // Server Action / Async Function Import


// const MyRecipesPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes using getRecipes()
//   // const fetchMyRecipes = async () => {
//   //   try {
//   //     const data = await getRecipes();
//   //     setRecipes(data.recipes || []);
//   //   } catch (error) {
//   //     console.error("Failed to load recipes:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // Fetch User's Recipes using getRecipes()
// const fetchMyRecipes = async () => {
//   try {
//     const response = await getRecipes();
//     console.log("Fetched response:", response); // কনসোলে ডাটা ফরম্যাট দেখার জন্য

//     // response সরাসরি Array হতে পারে, অথবা response.data অ্যারে হতে পারে
//     let list = [];
//     if (Array.isArray(response)) {
//       list = response;
//     } else if (Array.isArray(response?.data)) {
//       list = response.data;
//     } else if (Array.isArray(response?.recipes)) {
//       list = response.recipes;
//     }

//     setRecipes(list);
//   } catch (error) {
//     console.error("Failed to load recipes:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         price: Number(selectedRecipe.price) || 0,
//         image: selectedRecipe.image,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients?.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions?.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               My Recipes
//             </h1>
//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage, update, or remove your published culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Main Content Area */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <FaUtensils className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           /* Recipes Grid */
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             <AnimatePresence>
//               {recipes.map((recipe, index) => (
//                 <motion.div
//                   key={recipe._id}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
//                 >
//                   <div>
//                     {/* Image & Price */}
//                     <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
//                       <img
//                         src={
//                           recipe.image ||
//                           "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
//                         }
//                         alt={recipe.name}
//                         className="w-full h-full object-cover"
//                       />
//                       {recipe.price > 0 && (
//                         <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
//                           ${recipe.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* Body Content */}
//                     <div className="p-6">
//                       <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-1">
//                         {recipe.name}
//                       </h3>

//                       <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
//                         <div className="flex items-center gap-2">
//                           <FaUtensils className="text-orange-500" />
//                           <span>
//                             <strong>Category:</strong> {recipe.category}
//                           </span>
//                         </div>
//                         {recipe.cuisine && (
//                           <div className="flex items-center gap-2">
//                             <FaGlobe className="text-orange-500" />
//                             <span>
//                               <strong>Cuisine:</strong> {recipe.cuisine}
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-2">
//                           <FaClock className="text-orange-500" />
//                           <span>
//                             <strong>Prep Time:</strong> {recipe.prepTime} mins
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons (Edit & Delete) */}
//                   <div className="p-6 pt-0 flex items-center gap-3">
//                     <button
//                       onClick={() =>
//                         setSelectedRecipe({
//                           ...recipe,
//                           ingredients: Array.isArray(recipe.ingredients)
//                             ? recipe.ingredients.join(", ")
//                             : recipe.ingredients || "",
//                           instructions: Array.isArray(recipe.instructions)
//                             ? recipe.instructions.join("\n")
//                             : recipe.instructions || "",
//                         })
//                       }
//                       className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2 rounded-xl transition"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(recipe._id)}
//                       disabled={deletingId === recipe._id}
//                       className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium py-2 rounded-xl transition disabled:opacity-50"
//                     >
//                       {deletingId === recipe._id ? (
//                         <FaSpinner className="animate-spin" />
//                       ) : (
//                         <>
//                           <FaTrash /> Delete
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* --- UPDATE MODAL --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                   Update Recipe
//                 </h2>
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               {/* Modal Form */}
//               <form
//                 onSubmit={handleUpdateSubmit}
//                 className="p-6 space-y-4 overflow-y-auto"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Recipe Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={selectedRecipe.category || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, category: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Cuisine
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedRecipe.cuisine || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, cuisine: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Prep Time (mins)
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, prepTime: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedRecipe.price || 0}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           price: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={selectedRecipe.image || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, image: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Ingredients (comma separated)
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={selectedRecipe.ingredients || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         ingredients: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save
//                     Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;














// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaSpinner,
//   FaUtensils,
//   FaGlobe,
//   FaClock,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const MyRecipesPage = () => {




//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes
//   const fetchMyRecipes = async () => {
//     try {
//       const res = await axios.get("/recipes/my-recipes");
//       setRecipes(res.data.recipes || []);
//     } catch (error) {
//       console.error("Failed to load recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         price: Number(selectedRecipe.price) || 0,
//         image: selectedRecipe.image,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients?.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions?.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-12 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">
//               My Recipes
//             </h1>
//             <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
//               Manage, update, or remove your published culinary creations.
//             </p>
//           </div>
//           <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link>
//         </div>

//         {/* Main Content Area */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
//             <FaUtensils className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
//             <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
//               You haven't posted any recipes yet.
//             </p>
//             <Link
//               href="/dashboard/users/addrecipe"
//               className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
//             >
//               Create Your First Recipe
//             </Link>
//           </div>
//         ) : (
//           /* Recipes Grid */
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             <AnimatePresence>
//               {recipes.map((recipe, index) => (
//                 <motion.div
//                   key={recipe._id}
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
//                 >
//                   <div>
//                     {/* Image & Price */}
//                     <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
//                       <img
//                         src={
//                           recipe.image ||
//                           "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
//                         }
//                         alt={recipe.name}
//                         className="w-full h-full object-cover"
//                       />
//                       {recipe.price > 0 && (
//                         <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
//                           ${recipe.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* Body Content */}
//                     <div className="p-6">
//                       <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-1">
//                         {recipe.name}
//                       </h3>

//                       <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
//                         <div className="flex items-center gap-2">
//                           <FaUtensils className="text-orange-500" />
//                           <span>
//                             <strong>Category:</strong> {recipe.category}
//                           </span>
//                         </div>
//                         {recipe.cuisine && (
//                           <div className="flex items-center gap-2">
//                             <FaGlobe className="text-orange-500" />
//                             <span>
//                               <strong>Cuisine:</strong> {recipe.cuisine}
//                             </span>
//                           </div>
//                         )}
//                         <div className="flex items-center gap-2">
//                           <FaClock className="text-orange-500" />
//                           <span>
//                             <strong>Prep Time:</strong> {recipe.prepTime} mins
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons (Edit & Delete) */}
//                   <div className="p-6 pt-0 flex items-center gap-3">
//                     <button
//                       onClick={() =>
//                         setSelectedRecipe({
//                           ...recipe,
//                           ingredients: Array.isArray(recipe.ingredients)
//                             ? recipe.ingredients.join(", ")
//                             : recipe.ingredients || "",
//                           instructions: Array.isArray(recipe.instructions)
//                             ? recipe.instructions.join("\n")
//                             : recipe.instructions || "",
//                         })
//                       }
//                       className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-2 rounded-xl transition"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(recipe._id)}
//                       disabled={deletingId === recipe._id}
//                       className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium py-2 rounded-xl transition disabled:opacity-50"
//                     >
//                       {deletingId === recipe._id ? (
//                         <FaSpinner className="animate-spin" />
//                       ) : (
//                         <>
//                           <FaTrash /> Delete
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* --- UPDATE MODAL --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
//                 <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
//                   Update Recipe
//                 </h2>
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               {/* Modal Form */}
//               <form
//                 onSubmit={handleUpdateSubmit}
//                 className="p-6 space-y-4 overflow-y-auto"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Recipe Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={selectedRecipe.category || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, category: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Cuisine
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedRecipe.cuisine || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, cuisine: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Prep Time (mins)
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime || ""}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, prepTime: e.target.value })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedRecipe.price || 0}
//                       onChange={(e) =>
//                         setSelectedRecipe({
//                           ...selectedRecipe,
//                           price: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={selectedRecipe.image || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, image: e.target.value })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                     Ingredients (comma separated)
//                   </label>
//                   <textarea
//                     rows={2}
//                     value={selectedRecipe.ingredients || ""}
//                     onChange={(e) =>
//                       setSelectedRecipe({
//                         ...selectedRecipe,
//                         ingredients: e.target.value,
//                       })
//                     }
//                     className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save
//                     Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;
















// "use client";

// import React, { useEffect, useState } from "react";
// import { FaList, FaEdit, FaTrash, FaSpinner, FaUtensils, FaTimes } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const MyRecipesPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);

//   // Edit Modal State
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch User's Recipes
//   const fetchMyRecipes = async () => {
//     try {
//       const res = await axios.get("/api/recipes/my-recipes");
//       setRecipes(res.data.recipes || []);
//     } catch (error) {
//       console.error("Failed to load recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyRecipes();
//   }, []);

//   // Delete Handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this recipe?")) return;

//     setDeletingId(id);
//     try {
//       const res = await axios.delete("/api/recipes/my-recipes", {
//         data: { recipeId: id },
//       });

//       if (res.status === 200) {
//         setRecipes((prev) => prev.filter((item) => item._id !== id));
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete recipe.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Update Recipe Submit Handler
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const payload = {
//         recipeId: selectedRecipe._id,
//         name: selectedRecipe.name,
//         category: selectedRecipe.category,
//         prepTime: Number(selectedRecipe.prepTime),
//         cuisine: selectedRecipe.cuisine,
//         difficulty: selectedRecipe.difficulty,
//         ingredients: Array.isArray(selectedRecipe.ingredients)
//           ? selectedRecipe.ingredients
//           : selectedRecipe.ingredients.split(",").map((i) => i.trim()),
//         instructions: Array.isArray(selectedRecipe.instructions)
//           ? selectedRecipe.instructions
//           : selectedRecipe.instructions.split("\n").map((i) => i.trim()),
//       };

//       const res = await axios.put("/api/recipes/my-recipes", payload);

//       if (res.status === 200) {
//         alert("Recipe updated successfully!");
//         setSelectedRecipe(null);
//         fetchMyRecipes();
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to update recipe.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
//       >
//         <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
//           <FaList className="text-orange-500" /> My Published Recipes
//         </h2>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <FaSpinner className="animate-spin text-2xl text-orange-500" />
//           </div>
//         ) : recipes.length === 0 ? (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400 space-y-2">
//             <FaUtensils className="mx-auto text-3xl text-gray-300 dark:text-gray-700" />
//             <p className="text-sm font-medium">You haven't published any recipes yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
//               <thead className="text-[10px] uppercase font-mono bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
//                 <tr>
//                   <th className="p-3">Recipe</th>
//                   <th className="p-3">Category</th>
//                   <th className="p-3">Prep Time</th>
//                   <th className="p-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
//                 <AnimatePresence>
//                   {recipes.map((recipe) => (
//                     <motion.tr
//                       key={recipe._id}
//                       layout
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
//                     >
//                       <td className="p-3 flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
//                           <img
//                             src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
//                             alt={recipe.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
//                           {recipe.name}
//                         </span>
//                       </td>
//                       <td className="p-3">
//                         <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-medium">
//                           {recipe.category}
//                         </span>
//                       </td>
//                       <td className="p-3">{recipe.prepTime} mins</td>
//                       <td className="p-3 text-right space-x-2">
//                         <button
//                           title="Edit Recipe"
//                           onClick={() =>
//                             setSelectedRecipe({
//                               ...recipe,
//                               ingredients: Array.isArray(recipe.ingredients)
//                                 ? recipe.ingredients.join(", ")
//                                 : recipe.ingredients,
//                               instructions: Array.isArray(recipe.instructions)
//                                 ? recipe.instructions.join("\n")
//                                 : recipe.instructions,
//                             })
//                           }
//                           className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition"
//                         >
//                           <FaEdit size={12} />
//                         </button>
//                         <button
//                           title="Delete Recipe"
//                           onClick={() => handleDelete(recipe._id)}
//                           disabled={deletingId === recipe._id}
//                           className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition"
//                         >
//                           {deletingId === recipe._id ? (
//                             <FaSpinner className="animate-spin" size={12} />
//                           ) : (
//                             <FaTrash size={12} />
//                           )}
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>
//         )}
//       </motion.div>

//       {/* --- Edit Recipe Modal --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
//             >
//               <button
//                 onClick={() => setSelectedRecipe(null)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
//               >
//                 <FaTimes size={16} />
//               </button>

//               <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
//                 Edit Recipe
//               </h3>

//               <form onSubmit={handleUpdateSubmit} className="space-y-4">
//                 <div>
//                   <label className="text-xs font-mono uppercase text-gray-400">Recipe Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={selectedRecipe.name}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, name: e.target.value })
//                     }
//                     className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-xs font-mono uppercase text-gray-400">Category</label>
//                     <select
//                       value={selectedRecipe.category}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, category: e.target.value })
//                       }
//                       className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
//                     >
//                       <option value="Breakfast">Breakfast</option>
//                       <option value="Lunch">Lunch</option>
//                       <option value="Dinner">Dinner</option>
//                       <option value="Dessert">Dessert</option>
//                       <option value="Snacks">Snacks</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-xs font-mono uppercase text-gray-400">Prep Time (mins)</label>
//                     <input
//                       type="number"
//                       required
//                       value={selectedRecipe.prepTime}
//                       onChange={(e) =>
//                         setSelectedRecipe({ ...selectedRecipe, prepTime: e.target.value })
//                       }
//                       className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-xs font-mono uppercase text-gray-400">Ingredients (comma separated)</label>
//                   <textarea
//                     rows={3}
//                     required
//                     value={selectedRecipe.ingredients}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, ingredients: e.target.value })
//                     }
//                     className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs font-mono uppercase text-gray-400">Instructions (one per line)</label>
//                   <textarea
//                     rows={4}
//                     required
//                     value={selectedRecipe.instructions}
//                     onChange={(e) =>
//                       setSelectedRecipe({ ...selectedRecipe, instructions: e.target.value })
//                     }
//                     className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedRecipe(null)}
//                     className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
//                   >
//                     {isUpdating && <FaSpinner className="animate-spin" />} Save Changes
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyRecipesPage;