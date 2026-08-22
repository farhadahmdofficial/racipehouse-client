

import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import Link from 'next/link';
import { headers } from 'next/headers';
import { FaShoppingBag, FaReceipt } from 'react-icons/fa';

export default async function MyPurchasedPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // Auth Guard
  if (!session) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">you are not any purchased reeipes </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please purchased recipes.</p>
          <Link
            href="/login"
            className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-orange-600/20"
          >
            Login to Your Account
          </Link>
        </div>
      </div>
    );
  }

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Please add your Mongo URI to .env.local');

  const client = new MongoClient(uri);

  let purchasedItems = [];

  try {
    await client.connect();
    const db = client.db('recipehouse');

    let userObjectId = null;
    if (userId && ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
    }

    purchasedItems = await db.collection('payment').aggregate([
      {
        $match: {
          $or: [
            { userId: userId },
            { userId: userObjectId },
            ...(userEmail ? [{ customerEmail: userEmail }] : [])
          ],
          status: 'completed'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipeId',
          foreignField: '_id',
          as: 'recipeDetails'
        }
      },
      {
        $unwind: {
          path: '$recipeDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

  } catch (error) {
    console.error('Error fetching purchased recipes:', error);
  } finally {
    await client.close();
  }

  const formattedItems = purchasedItems.map(item => ({
    _id: item._id.toString(),
    recipeId: item.recipeId?.toString() || '',
    recipeName: item.recipeName || item.recipeDetails?.name || 'Untitled Recipe',
    price: item.price || item.recipeDetails?.price || 0,
    currency: item.currency || 'usd',
    purchasedAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    image: item.recipeDetails?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    category: item.recipeDetails?.category || 'General',
    status: item.status
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaShoppingBag className="text-orange-500" />
              Purchased Recipes
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {formattedItems.length} Total
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Access all premium recipes and cooking guides you've unlocked.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {formattedItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              🍳
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Purchases Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              You haven't purchased any premium recipes yet. Explore our collection to find your favorite dishes!
            </p>
            <Link
              href="/recipes"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-md"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          /* Purchased Recipe Table View */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase text-xs tracking-wider">
                    <th className="py-4 px-6">Recipe</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {formattedItems.map((item) => (
                    <tr 
                      key={item._id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Recipe Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.recipeName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                            {item.recipeName}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-orange-600 dark:text-orange-400">
                        ${item.price}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {new Date(item.purchasedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric"
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/browserecipes/${item.recipeId}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-600 text-orange-600 dark:text-orange-400 hover:text-white dark:hover:text-white px-3.5 py-2 rounded-xl transition border border-orange-200 dark:border-orange-800/60"
                        >
                          <FaReceipt size={12} /> View Recipe
                        </Link>
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
}













// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { headers } from 'next/headers';
// import { FaShoppingBag, FaClock, FaCheckCircle, FaReceipt } from 'react-icons/fa';

// export default async function MyPurchasedPage() {
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });

//   // Auth Guard
//   if (!session) {
//     return (
//       <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
//         <div className="max-w-md w-full text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
//           <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
//             🔒
//           </div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
//           <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to access your purchased recipes.</p>
//           <Link
//             href="/login"
//             className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-orange-600/20"
//           >
//             Login to Your Account
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const userId = session?.user?.id;
//   const userEmail = session?.user?.email;

//   const uri = process.env.MONGODB_URI;
//   if (!uri) throw new Error('Please add your Mongo URI to .env.local');

//   const client = new MongoClient(uri);

//   let purchasedItems = [];

//   try {
//     await client.connect();
//     const db = client.db('recipehouse');

//     // Safe ObjectId conversion
//     let userObjectId = null;
//     if (userId && ObjectId.isValid(userId)) {
//       userObjectId = new ObjectId(userId);
//     }

//     // Pipeline using Aggregation to Join 'payment' with 'recipes' collection
//     purchasedItems = await db.collection('payment').aggregate([
//       {
//         $match: {
//           $or: [
//             { userId: userId },
//             { userId: userObjectId },
//             ...(userEmail ? [{ customerEmail: userEmail }] : [])
//           ],
//           status: 'completed'
//         }
//       },
//       {
//         $sort: { createdAt: -1 }
//       },
//       {
//         $lookup: {
//           from: 'recipes',
//           localField: 'recipeId',
//           foreignField: '_id',
//           as: 'recipeDetails'
//         }
//       },
//       {
//         $unwind: {
//           path: '$recipeDetails',
//           preserveNullAndEmptyArrays: true
//         }
//       }
//     ]).toArray();

//   } catch (error) {
//     console.error('Error fetching purchased recipes:', error);
//   } finally {
//     await client.close();
//   }

//   // Format dates and MongoDB IDs for SSR payload safety
//   const formattedItems = purchasedItems.map(item => ({
//     _id: item._id.toString(),
//     recipeId: item.recipeId?.toString() || '',
//     recipeName: item.recipeName || item.recipeDetails?.name || 'Untitled Recipe',
//     price: item.price || item.recipeDetails?.price || 0,
//     currency: item.currency || 'usd',
//     purchasedAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
//     image: item.recipeDetails?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
//     category: item.recipeDetails?.category || 'General',
//     instructions: item.recipeDetails?.instructions || item.recipeDetails?.description || 'No detailed instructions provided.',
//     status: item.status
//   }));

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
//           <div>
//             <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
//               <FaShoppingBag className="text-orange-500" />
//               Purchased Recipes
//               <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
//                 {formattedItems.length} Total
//               </span>
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               Access all premium recipes and cooking guides you've unlocked.
//             </p>
//           </div>
//         </div>

//         {/* Empty State */}
//         {formattedItems.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-4">
//             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto text-3xl">
//               🍳
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Purchases Found</h3>
//             <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
//               You haven't purchased any premium recipes yet. Explore our collection to find your favorite dishes!
//             </p>
//             <Link
//               href="/recipes"
//               className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-md"
//             >
//               Browse Recipes
//             </Link>
//           </div>
//         ) : (
//           /* Purchased Recipe Cards Grid */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {formattedItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
//               >
//                 <div>
//                   {/* Image & Badge */}
//                   <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
//                     <img
//                       src={item.image}
//                       alt={item.recipeName}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute top-3 right-3 flex gap-2">
//                       <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
//                         <FaCheckCircle size={10} /> Unlocked
//                       </span>
//                     </div>
//                     <div className="absolute bottom-3 left-3">
//                       <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg">
//                         {item.category}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-5 space-y-3">
//                     <div className="flex items-start justify-between gap-2">
//                       <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
//                         {item.recipeName}
//                       </h3>
//                       <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
//                         ${item.price}
//                       </span>
//                     </div>

//                     <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
//                       {item.instructions}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
//                   <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
//                     <FaClock size={10} className="text-orange-500" />
//                     {new Date(item.purchasedAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "2-digit",
//                       year: "numeric"
//                     })}
//                   </span>

//                   <Link
//                     href={`/recipes/${item.recipeId}`}
//                     className="flex items-center gap-1.5 text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-600 text-orange-600 dark:text-orange-400 hover:text-white dark:hover:text-white px-3.5 py-2 rounded-xl transition border border-orange-200 dark:border-orange-800/60"
//                   >
//                     <FaReceipt size={12} /> View Recipe
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }










// import { auth } from '@/lib/auth';
// import { MongoClient, ObjectId } from 'mongodb';
// import Link from 'next/link';
// import { FaPlus } from 'react-icons/fa';
// import { headers } from 'next/headers';

// export default async function MyPurchasedPage() {
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
//   // const userEmail = session?.user?.email;

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
//     const recipes = await db.collection('payment')
//       .find({
//         $or: [
//           { userId: userId },             // String matching
//           { userId: userObjectId },       // ObjectId matching
//           // { userEmail: userEmail },       // Email matching (যদি সেভ থাকে)
//           // { email: userEmail }
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
//               My Purchased  Recpes({formattedRecipes.length})
//             </h1>
           
//           </div>
//           {/* <Link
//             href="/dashboard/users/addrecipe"
//             className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             <FaPlus /> Add New Recipe
//           </Link> */}
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








// import React, { useEffect, useState } from "react";
// import {
//   FaShoppingBag,
//   FaEye,
//   FaSpinner,
//   FaTimes,
//   FaUtensils,
//   FaClock,
//   FaListUl,
//   FaBookOpen,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const MyPurchasedPage = () => {
//   const [purchasedList, setPurchasedList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);

//   // Fetch Purchased Recipes
//   const fetchPurchasedRecipes = async () => {
//     try {
//       const res = await axios.get("/api/recipes/purchased");
//       setPurchasedList(res.data.purchasedRecipes || []);
//     } catch (error) {
//       console.error("Failed to load purchased recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPurchasedRecipes();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6"
//       >
//         <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
//           <FaShoppingBag className="text-orange-500" /> Purchased Recipes
//         </h2>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center py-16">
//             <FaSpinner className="animate-spin text-3xl text-orange-500" />
//           </div>
//         ) : purchasedList.length === 0 ? (
//           /* Empty State */
//           <div className="text-center py-16 text-gray-500 dark:text-gray-400 space-y-3">
//             <FaUtensils className="mx-auto text-4xl text-gray-300 dark:text-gray-700" />
//             <p className="text-sm font-medium">You haven't purchased any recipes yet.</p>
//           </div>
//         ) : (
//           /* Purchased Cards Grid */
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <AnimatePresence>
//               {purchasedList.map((item) => {
//                 const recipe = item.recipe;
//                 if (!recipe) return null;

//                 const formattedDate = new Date(item.purchasedAt).toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "2-digit",
//                   year: "numeric",
//                 });

//                 return (
//                   <motion.div
//                     key={item._id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 bg-gray-50 dark:bg-gray-950/60 hover:border-orange-500/50 transition-all shadow-xs"
//                   >
//                     <img
//                       src={recipe.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"}
//                       alt={recipe.name || "Purchased Recipe"}
//                       className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
//                     />

//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
//                           {recipe.name}
//                         </h4>
//                         <p className="text-[10px] text-gray-400 font-mono mt-0.5">
//                           Purchased on: {formattedDate}
//                         </p>
//                       </div>

//                       <button
//                         onClick={() => setSelectedRecipe(recipe)}
//                         className="w-fit flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
//                       >
//                         <FaEye size={12} /> View Details
//                       </button>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//       </motion.div>

//       {/* --- Recipe Details Modal --- */}
//       <AnimatePresence>
//         {selectedRecipe && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={() => setSelectedRecipe(null)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-1 bg-gray-100 dark:bg-gray-800 rounded-full"
//               >
//                 <FaTimes size={14} />
//               </button>

//               {/* Header Image & Info */}
//               <div className="flex gap-4 items-start pr-6">
//                 <img
//                   src={selectedRecipe.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"}
//                   alt={selectedRecipe.name}
//                   className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
//                 />
//                 <div className="space-y-1">
//                   <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-[10px] font-semibold uppercase tracking-wider">
//                     {selectedRecipe.category || "General"}
//                   </span>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
//                     {selectedRecipe.name}
//                   </h3>
//                   {selectedRecipe.prepTime && (
//                     <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
//                       <FaClock size={11} className="text-orange-500" /> Prep Time: {selectedRecipe.prepTime} mins
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <hr className="border-gray-100 dark:border-gray-800" />

//               {/* Ingredients Section */}
//               {selectedRecipe.ingredients && (
//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold font-mono uppercase text-gray-900 dark:text-white flex items-center gap-1.5">
//                     <FaListUl className="text-orange-500" /> Ingredients
//                   </h4>
//                   <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-1 bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80">
//                     {Array.isArray(selectedRecipe.ingredients)
//                       ? selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
//                       : selectedRecipe.ingredients.split(",").map((ing, idx) => <li key={idx}>{ing.trim()}</li>)}
//                   </ul>
//                 </div>
//               )}

//               {/* Instructions Section */}
//               {selectedRecipe.instructions && (
//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold font-mono uppercase text-gray-900 dark:text-white flex items-center gap-1.5">
//                     <FaBookOpen className="text-orange-500" /> Cooking Instructions
//                   </h4>
//                   <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 leading-relaxed whitespace-pre-line">
//                     {Array.isArray(selectedRecipe.instructions)
//                       ? selectedRecipe.instructions.map((step, idx) => (
//                           <p key={idx}>
//                             <span className="font-bold text-orange-500">{idx + 1}.</span> {step}
//                           </p>
//                         ))
//                       : selectedRecipe.instructions}
//                   </div>
//                 </div>
//               )}

//               {/* Close Footer Button */}
//               <div className="flex justify-end pt-2">
//                 <button
//                   onClick={() => setSelectedRecipe(null)}
//                   className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MyPurchasedPage;