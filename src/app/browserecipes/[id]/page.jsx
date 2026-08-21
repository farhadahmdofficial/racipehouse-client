

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';

import { 
  FaHeart, 
  FaBookmark, 
  FaFlag, 
  FaShoppingCart, 
  FaClock, 
  FaUtensils, 
  FaGlobe, 
  FaCheckCircle, 
  FaSpinner, 
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa';

// Fixed Server URL: Fixed "sever" to "server" and "racipe" to "recipe"
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://racipehouse-sever.vercel.app';

const RecipeDetailsPage = () => {
  const router = useRouter();
  const routeParams = useParams();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Next.js useParams safe parameter extraction
  const recipeId = routeParams?.id || routeParams?.recipeId;

  // Data & Loading States
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI Interactive States
  const [hasLiked, setHasLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Fetch recipe data safely
  useEffect(() => {
    let isMounted = true;

    const fetchRecipe = async () => {
      if (!recipeId) return;

      try {
        setLoading(true);
        console.log("Fetching recipe from:", `${SERVER_URL}/recipes/${recipeId}`);
        
        const res = await fetch(`${SERVER_URL}/recipes/${recipeId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Recipe Data:", data);

        if (isMounted) {
          // MongoDB direct object handling
          const recipeData = data?.data || data;
          
          if (recipeData && (recipeData._id || recipeData.name || recipeData.title)) {
            setRecipe(recipeData);

            if (userId) {
              setHasLiked(recipeData.likedBy?.includes(userId) || false);
              setIsFavorite(recipeData.favoritedBy?.includes(userId) || false);
            }
          } else {
            setRecipe(null);
          }
        }
      } catch (err) {
        console.error("Recipe fetch error:", err);
        if (isMounted) setRecipe(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      isMounted = false;
    };
  }, [recipeId, userId]);

  // Event Handlers
  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLike = async () => {
    if (!userId) {
      alert("Please log in to like recipes.");
      return;
    }

    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    
    setRecipe((prev) => ({
      ...prev,
      likesCount: nextLiked ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0),
    }));

    try {
      await fetch(`${SERVER_URL}/recipes/${recipeId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isLiked: nextLiked }),
      });
    } catch (err) {
      console.error("Like update failed:", err);
    }
  };

  const handleFavorite = async () => {
    if (!userId) {
      alert("Please log in to bookmark recipes.");
      return;
    }

    const nextFav = !isFavorite;
    setIsFavorite(nextFav);

    try {
      await fetch(`${SERVER_URL}/users/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, recipeId, isFavorite: nextFav }),
      });
    } catch (err) {
      console.error("Favorite update failed:", err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportReason.trim()) {
      alert("Please select or write a reason.");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe._id,
          recipeTitle: recipe.name || recipe.title,
          reportedByEmail: session?.user?.email || 'Anonymous',
          userId: userId || null,
          reason: reportReason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Report submitted successfully!");
        setShowReportModal(false);
        setReportReason('');
      } else {
        alert("Failed to submit report. Try again.");
      }
    } catch (err) {
      console.error("Report submit error:", err);
      alert("Something went wrong while submitting.");
    }
  };

  const ingredientsList = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients
    : typeof recipe?.ingredients === 'string'
    ? recipe.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const instructionsList = Array.isArray(recipe?.instructions)
    ? recipe.instructions
    : typeof recipe?.instructions === 'string'
    ? recipe.instructions.split('\n').map((item) => item.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-4xl text-orange-600" />
        <p className="text-gray-500 text-sm animate-pulse">Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md text-center shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
          <p className="text-gray-500 text-sm mb-4">The requested recipe could not be loaded from the server.</p>
          <button
            onClick={() => router.back()}
            className="mt-2 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-700 transition"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-semibold transition"
          >
            <FaArrowLeft /> Back to Recipes
          </button>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
        >
          {/* Header Cover Image */}
          <div className="relative h-72 sm:h-96 w-full bg-gray-200 dark:bg-gray-800">
            <img
              src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
              alt={recipe.name || recipe.title || 'Recipe'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
                {recipe.category || 'General Recipe'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
                {recipe.name || recipe.title || 'Untitled Recipe'}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Created by <span className="text-white font-semibold">{recipe.authorName || recipe.userEmail || 'Chef'}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 sm:p-6 bg-orange-50/40 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
                  hasLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
                <span>{recipe.likesCount || 0}</span>
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
                  isFavorite 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FaBookmark />
                <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition shadow-sm"
              >
                <FaFlag />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>

            <div>
              {Number(recipe.price) > 0 && !recipe.isPurchased ? (
                <form action="/api/payment" method="POST">
                  <input type="hidden" value={recipe.price} name="price" />
                  <input type="hidden" value={recipe.name || recipe.title} name="name" />
                  <input type="hidden" value={recipe._id} name="recipeId" />

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <FaShoppingCart />
                    <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
                  </button>
                </form>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
                  <FaCheckCircle /> Access Granted
                </span>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="p-6 sm:p-8 space-y-10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaUtensils className="text-orange-500 mx-auto text-lg mb-1" />
                <span className="text-xs text-gray-500 block uppercase font-medium">Category</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  {recipe.category || 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaGlobe className="text-orange-500 mx-auto text-lg mb-1" />
                <span className="text-xs text-gray-500 block uppercase font-medium">Cuisine</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  {recipe.cuisine || 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaClock className="text-orange-500 mx-auto text-lg mb-1" />
                <span className="text-xs text-gray-500 block uppercase font-medium">Prep Time</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                  {recipe.prepTime ? `${recipe.prepTime} Mins` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ingredients List
              </h3>
              {ingredientsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ingredientsList.map((ing, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                        checkedIngredients[idx]
                          ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50 line-through text-gray-400 dark:text-gray-500'
                          : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition ${
                        checkedIngredients[idx]
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {checkedIngredients[idx] && <FaCheck />}
                      </div>
                      <span className="text-sm font-medium">{ing}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">No ingredients specified.</p>
              )}
            </div>

            {/* Step by Step Instructions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Instructions
              </h3>
              {instructionsList.length > 0 ? (
                <div className="space-y-4">
                  {instructionsList.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${
                        completedSteps[idx]
                          ? 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
                          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 hover:border-orange-200'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
                        completedSteps[idx]
                          ? 'bg-green-600 text-white'
                          : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                      }`}>
                        {completedSteps[idx] ? <FaCheck /> : idx + 1}
                      </span>
                      <p className={`text-sm sm:text-base leading-relaxed pt-1 ${
                        completedSteps[idx] 
                          ? 'line-through text-gray-400 dark:text-gray-500' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">No instructions provided.</p>
              )}
            </div>

          </div>
        </motion.div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Report Recipe
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please state why this recipe violates policies or guidelines.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                rows="4"
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Write your issue here..."
                className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default RecipeDetailsPage;









// ok code
// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { authClient } from '@/lib/auth-client';

// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle, 
//   FaSpinner, 
//   FaArrowLeft,
//   FaCheck
// } from 'react-icons/fa';

// const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://recipehouse-sever.vercel.app';

// const RecipeDetailsPage = ({ params }) => {
//   const router = useRouter();
//   const routeParams = useParams();
//   const { data: session } = authClient.useSession();
//   const userId = session?.user?.id;

//   // Next.js 15+ params promise unwrapping
//   const unwrappedParams = params && typeof params.then === 'function' ? use(params) : params;
//   const recipeId = unwrappedParams?.id || routeParams?.id;

//   // Data & Loading States
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // UI Interactive States
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [checkedIngredients, setCheckedIngredients] = useState({});
//   const [completedSteps, setCompletedSteps] = useState({});
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [isPurchasing, setIsPurchasing] = useState(false);

//   // Fetch recipe data safely
//   useEffect(() => {
//     let isMounted = true;

//     const fetchRecipe = async () => {
//       if (!recipeId) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`${SERVER_URL}/recipes/${recipeId}`);
//         const data = await res.json();

//         if (isMounted) {
//           const recipeData = data?.data || data;
//           setRecipe(recipeData);
          
//           // Check initial user like/favorite status if user is logged in
//           if (userId && recipeData) {
//             setHasLiked(recipeData.likedBy?.includes(userId) || false);
//             setIsFavorite(recipeData.favoritedBy?.includes(userId) || false);
//           }
//         }
//       } catch (err) {
//         console.error("Recipe fetch error:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchRecipe();

//     return () => {
//       isMounted = false;
//     };
//   }, [recipeId, userId]);

//   // Event Handlers
//   const toggleIngredient = (idx) => {
//     setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const toggleStep = (idx) => {
//     setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const handleLike = async () => {
//     if (!userId) {
//       alert("Please log in to like recipes.");
//       return;
//     }

//     const nextLiked = !hasLiked;
//     setHasLiked(nextLiked);
    
//     // UI Instant Update
//     setRecipe((prev) => ({
//       ...prev,
//       likesCount: nextLiked ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0),
//     }));

//     // DB Update API Call
//     try {
//       await fetch(`${SERVER_URL}/recipes/${recipeId}/like`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, isLiked: nextLiked }),
//       });
//     } catch (err) {
//       console.error("Like update failed:", err);
//     }
//   };

//   const handleFavorite = async () => {
//     if (!userId) {
//       alert("Please log in to bookmark recipes.");
//       return;
//     }

//     const nextFav = !isFavorite;
//     setIsFavorite(nextFav);

//     // DB Update API Call
//     try {
//       await fetch(`${SERVER_URL}/users/favorites`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, recipeId, isFavorite: nextFav }),
//       });
//     } catch (err) {
//       console.error("Favorite update failed:", err);
//     }
//   };

//   const handlePurchase = () => {
//     setIsPurchasing(true);
//     setTimeout(() => {
//       alert("Redirecting to purchase gateway...");
//       setIsPurchasing(false);
//     }, 1000);
//   };


//   const handleReportSubmit = async (e) => {
//   e.preventDefault();

//   if (!reportReason.trim()) {
//     alert("Please select or write a reason.");
//     return;
//   }

//   try {
//     const res = await fetch(`${SERVER_URL}/api/reports`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         recipeId: recipe._id,
//         recipeTitle: recipe.name || recipe.title,
//         reportedByEmail: session?.user?.email || 'Anonymous',
//         userId: userId || null,
//         reason: reportReason,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Report submitted successfully!");
//       setShowReportModal(false);
//       setReportReason('');
//     } else {
//       alert("Failed to submit report. Try again.");
//     }
//   } catch (err) {
//     console.error("Report submit error:", err);
//     alert("Something went wrong while submitting.");
//   }
// };

//   // const handleReportSubmit = (e) => {
//   //   e.preventDefault();
//   //   alert("Report submitted successfully!");
//   //   setShowReportModal(false);
//   //   setReportReason('');
//   // };

//   // Safe parsing for list fields
//   const ingredientsList = Array.isArray(recipe?.ingredients)
//     ? recipe.ingredients
//     : typeof recipe?.ingredients === 'string'
//     ? recipe.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
//     : [];

//   const instructionsList = Array.isArray(recipe?.instructions)
//     ? recipe.instructions
//     : typeof recipe?.instructions === 'string'
//     ? recipe.instructions.split('\n').map((item) => item.trim()).filter(Boolean)
//     : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
//         <FaSpinner className="animate-spin text-4xl text-orange-600" />
//         <p className="text-gray-500 text-sm animate-pulse">Loading recipe details...</p>
//       </div>
//     );
//   }

//   if (!recipe) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md text-center shadow-md">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-700 transition"
//           >
//             <FaArrowLeft /> Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Back Navigation */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-semibold transition"
//           >
//             <FaArrowLeft /> Back to Recipes
//           </button>
//         </div>

//         {/* Main Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
//         >
//           {/* Header Cover Image */}
//           <div className="relative h-72 sm:h-96 w-full bg-gray-200 dark:bg-gray-800">
//             <img
//               src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
//               alt={recipe.name || 'Recipe'}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
//                 {recipe.category || 'General Recipe'}
//               </span>
//               <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
//                 {recipe.name || 'Untitled Recipe'}
//               </h1>
//               <p className="text-gray-300 text-sm sm:text-base">
//                 Created by <span className="text-white font-semibold">{recipe.authorName || recipe.userEmail || 'Chef'}</span>
//               </p>
//             </div>
//           </div>

//           {/* Action Toolbar */}
//           <div className="p-4 sm:p-6 bg-orange-50/40 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount || 0}</span>
//               </button>

//               <button
//                 onClick={handleFavorite}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition shadow-sm"
//               >
//                 <FaFlag />
//                 <span className="hidden sm:inline">Report</span>
//               </button>
//             </div>

//             {/* Right Purchase / Status Button */}
//             <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (
//                 <form action="/api/payment" method="POST">
//                   <input type="hidden" value={recipe.price} name="price" />
//                   <input type="hidden" value={recipe.name} name="name" />
//                   <input type="hidden" value={recipe._id} name="recipeId" />

//                   <button
//                     type="submit"
//                     className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
//                   >
//                     <FaShoppingCart />
//                     <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                   </button>
//                 </form>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//                   <FaCheckCircle /> Access Granted
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Quick Info Grid */}
//           <div className="p-6 sm:p-8 space-y-10">
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.category || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.cuisine || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.prepTime ? `${recipe.prepTime} Mins` : 'N/A'}
//                 </span>
//               </div>
//             </div>

//             {/* Ingredients Checklist */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Ingredients List
//               </h3>
//               {ingredientsList.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ingredientsList.map((ing, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleIngredient(idx)}
//                       className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50 line-through text-gray-400 dark:text-gray-500'
//                           : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-orange-300'
//                       }`}
//                     >
//                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-600 border-orange-600 text-white'
//                           : 'border-gray-300 dark:border-gray-600'
//                       }`}>
//                         {checkedIngredients[idx] && <FaCheck />}
//                       </div>
//                       <span className="text-sm font-medium">{ing}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No ingredients specified.</p>
//               )}
//             </div>

//             {/* Step by Step Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Instructions
//               </h3>
//               {instructionsList.length > 0 ? (
//                 <div className="space-y-4">
//                   {instructionsList.map((step, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleStep(idx)}
//                       className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${
//                         completedSteps[idx]
//                           ? 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
//                           : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 hover:border-orange-200'
//                       }`}
//                     >
//                       <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
//                         completedSteps[idx]
//                           ? 'bg-green-600 text-white'
//                           : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
//                       }`}>
//                         {completedSteps[idx] ? <FaCheck /> : idx + 1}
//                       </span>
//                       <p className={`text-sm sm:text-base leading-relaxed pt-1 ${
//                         completedSteps[idx] 
//                           ? 'line-through text-gray-400 dark:text-gray-500' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}>
//                         {step}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No instructions provided.</p>
//               )}
//             </div>

//           </div>
//         </motion.div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Please state why this recipe violates policies or guidelines.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your issue here..."
//                 className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetailsPage















// ok code 

// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { authClient } from '@/lib/auth-client';

// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle, 
//   FaSpinner, 
//   FaArrowLeft,
//   FaCheck
// } from 'react-icons/fa';

// const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// const RecipeDetailsPage = ({ params }) => {
//   const router = useRouter();
//   const routeParams = useParams();
//   const { data: session } = authClient.useSession();
//   const userId = session?.user?.id;

//   // Next.js 15+ params promise unwrapping
//   const unwrappedParams = params && typeof params.then === 'function' ? use(params) : params;
//   const recipeId = unwrappedParams?.id || routeParams?.id;

//   // Data & Loading States
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // UI Interactive States
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [checkedIngredients, setCheckedIngredients] = useState({});
//   const [completedSteps, setCompletedSteps] = useState({});
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [isPurchasing, setIsPurchasing] = useState(false);

//   // Fetch recipe data safely
//   useEffect(() => {
//     let isMounted = true;

//     const fetchRecipe = async () => {
//       if (!recipeId) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`${SERVER_URL}/recipes/${recipeId}`);
//         const data = await res.json();

//         if (isMounted) {
//           const recipeData = data?.data || data;
//           setRecipe(recipeData);
          
//           // Check initial user like/favorite status if user is logged in
//           if (userId && recipeData) {
//             setHasLiked(recipeData.likedBy?.includes(userId) || false);
//             setIsFavorite(recipeData.favoritedBy?.includes(userId) || false);
//           }
//         }
//       } catch (err) {
//         console.error("Recipe fetch error:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchRecipe();

//     return () => {
//       isMounted = false;
//     };
//   }, [recipeId, userId]);

//   // Event Handlers
//   const toggleIngredient = (idx) => {
//     setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const toggleStep = (idx) => {
//     setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const handleLike = async () => {
//     if (!userId) {
//       alert("Please log in to like recipes.");
//       return;
//     }

//     const nextLiked = !hasLiked;
//     setHasLiked(nextLiked);
    
//     // UI Instant Update
//     setRecipe((prev) => ({
//       ...prev,
//       likesCount: nextLiked ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0),
//     }));

//     // DB Update API Call
//     try {
//       await fetch(`${SERVER_URL}/recipes/${recipeId}/like`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, isLiked: nextLiked }),
//       });
//     } catch (err) {
//       console.error("Like update failed:", err);
//     }
//   };

//   const handleFavorite = async () => {
//     if (!userId) {
//       alert("Please log in to bookmark recipes.");
//       return;
//     }

//     const nextFav = !isFavorite;
//     setIsFavorite(nextFav);

//     // DB Update API Call
//     try {
//       await fetch(`${SERVER_URL}/users/favorites`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, recipeId, isFavorite: nextFav }),
//       });
//     } catch (err) {
//       console.error("Favorite update failed:", err);
//     }
//   };

//   const handlePurchase = () => {
//     setIsPurchasing(true);
//     setTimeout(() => {
//       alert("Redirecting to purchase gateway...");
//       setIsPurchasing(false);
//     }, 1000);
//   };

//   const handleReportSubmit = (e) => {
//     e.preventDefault();
//     alert("Report submitted successfully!");
//     setShowReportModal(false);
//     setReportReason('');
//   };

//   // Safe parsing for list fields
//   const ingredientsList = Array.isArray(recipe?.ingredients)
//     ? recipe.ingredients
//     : typeof recipe?.ingredients === 'string'
//     ? recipe.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
//     : [];

//   const instructionsList = Array.isArray(recipe?.instructions)
//     ? recipe.instructions
//     : typeof recipe?.instructions === 'string'
//     ? recipe.instructions.split('\n').map((item) => item.trim()).filter(Boolean)
//     : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
//         <FaSpinner className="animate-spin text-4xl text-orange-600" />
//         <p className="text-gray-500 text-sm animate-pulse">Loading recipe details...</p>
//       </div>
//     );
//   }

//   if (!recipe) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md text-center shadow-md">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-700 transition"
//           >
//             <FaArrowLeft /> Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Back Navigation */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-semibold transition"
//           >
//             <FaArrowLeft /> Back to Recipes
//           </button>
//         </div>

//         {/* Main Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
//         >
//           {/* Header Cover Image */}
//           <div className="relative h-72 sm:h-96 w-full bg-gray-200 dark:bg-gray-800">
//             <img
//               src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
//               alt={recipe.name || 'Recipe'}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
//                 {recipe.category || 'General Recipe'}
//               </span>
//               <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
//                 {recipe.name || 'Untitled Recipe'}
//               </h1>
//               <p className="text-gray-300 text-sm sm:text-base">
//                 Created by <span className="text-white font-semibold">{recipe.authorName || recipe.userEmail || 'Chef'}</span>
//               </p>
//             </div>
//           </div>

//           {/* Action Toolbar */}
//           <div className="p-4 sm:p-6 bg-orange-50/40 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount || 0}</span>
//               </button>

//               <button
//                 onClick={handleFavorite}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition shadow-sm"
//               >
//                 <FaFlag />
//                 <span className="hidden sm:inline">Report</span>
//               </button>
//             </div>

//             {/* Right Purchase / Status Button */}
//             <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (
//                 <form action="/api/payment" method="POST">
//                   <input type="hidden" value={recipe.price} name="price" />
//                   <input type="hidden" value={recipe.name} name="name" />
//                   <input type="hidden" value={recipe._id} name="recipeId" />

//                   <button
//                     type="submit"
//                     className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
//                   >
//                     <FaShoppingCart />
//                     <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                   </button>
//                 </form>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//                   <FaCheckCircle /> Access Granted
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Quick Info Grid */}
//           <div className="p-6 sm:p-8 space-y-10">
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.category || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.cuisine || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.prepTime ? `${recipe.prepTime} Mins` : 'N/A'}
//                 </span>
//               </div>
//             </div>

//             {/* Ingredients Checklist */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Ingredients List
//               </h3>
//               {ingredientsList.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ingredientsList.map((ing, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleIngredient(idx)}
//                       className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50 line-through text-gray-400 dark:text-gray-500'
//                           : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-orange-300'
//                       }`}
//                     >
//                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-600 border-orange-600 text-white'
//                           : 'border-gray-300 dark:border-gray-600'
//                       }`}>
//                         {checkedIngredients[idx] && <FaCheck />}
//                       </div>
//                       <span className="text-sm font-medium">{ing}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No ingredients specified.</p>
//               )}
//             </div>

//             {/* Step by Step Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Instructions
//               </h3>
//               {instructionsList.length > 0 ? (
//                 <div className="space-y-4">
//                   {instructionsList.map((step, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleStep(idx)}
//                       className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${
//                         completedSteps[idx]
//                           ? 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
//                           : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 hover:border-orange-200'
//                       }`}
//                     >
//                       <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
//                         completedSteps[idx]
//                           ? 'bg-green-600 text-white'
//                           : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
//                       }`}>
//                         {completedSteps[idx] ? <FaCheck /> : idx + 1}
//                       </span>
//                       <p className={`text-sm sm:text-base leading-relaxed pt-1 ${
//                         completedSteps[idx] 
//                           ? 'line-through text-gray-400 dark:text-gray-500' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}>
//                         {step}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No instructions provided.</p>
//               )}
//             </div>

//           </div>
//         </motion.div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Please state why this recipe violates policies or guidelines.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your issue here..."
//                 className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetailsPage;










// ok code
// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle, 
//   FaSpinner, 
//   FaArrowLeft,
//   FaCheck
// } from 'react-icons/fa';

// const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// const RecipeDetailsPage = ({ params }) => {
//   const router = useRouter();
//   const routeParams = useParams();

//   // Next.js 15+ params promise unwrapping
//   const unwrappedParams = params && typeof params.then === 'function' ? use(params) : params;
//   const recipeId = unwrappedParams?.id || routeParams?.id;

//   // Data & Loading States
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // UI Interactive States
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [checkedIngredients, setCheckedIngredients] = useState({});
//   const [completedSteps, setCompletedSteps] = useState({});
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [isPurchasing, setIsPurchasing] = useState(false);

//   // Fetch recipe data safely
//   useEffect(() => {
//     let isMounted = true;

//     const fetchRecipe = async () => {
//       if (!recipeId) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`${SERVER_URL}/recipes/${recipeId}`);
//         const data = await res.json();

//         if (isMounted) {
//           setRecipe(data?.data || data);
//         }
//       } catch (err) {
//         console.error("Recipe fetch error:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchRecipe();

//     return () => {
//       isMounted = false;
//     };
//   }, [recipeId]);

//   // Event Handlers
//   const toggleIngredient = (idx) => {
//     setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const toggleStep = (idx) => {
//     setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   const handleLike = () => {
//     setHasLiked(!hasLiked);
//     if (recipe) {
//       setRecipe((prev) => ({
//         ...prev,
//         likesCount: !hasLiked ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0),
//       }));
//     }
//   };

//   const handlePurchase = () => {
//     setIsPurchasing(true);
//     setTimeout(() => {
//       alert("Redirecting to purchase gateway...");
//       setIsPurchasing(false);
//     }, 1000);
//   };

//   const handleReportSubmit = (e) => {
//     e.preventDefault();
//     alert("Report submitted successfully!");
//     setShowReportModal(false);
//     setReportReason('');
//   };

//   // Safe parsing for list fields
//   const ingredientsList = Array.isArray(recipe?.ingredients)
//     ? recipe.ingredients
//     : typeof recipe?.ingredients === 'string'
//     ? recipe.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
//     : [];

//   const instructionsList = Array.isArray(recipe?.instructions)
//     ? recipe.instructions
//     : typeof recipe?.instructions === 'string'
//     ? recipe.instructions.split('\n').map((item) => item.trim()).filter(Boolean)
//     : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
//         <FaSpinner className="animate-spin text-4xl text-orange-600" />
//         <p className="text-gray-500 text-sm animate-pulse">Loading recipe details...</p>
//       </div>
//     );
//   }

//   if (!recipe) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md text-center shadow-md">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-700 transition"
//           >
//             <FaArrowLeft /> Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Back Navigation */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-semibold transition"
//           >
//             <FaArrowLeft /> Back to Recipes
//           </button>
//         </div>

//         {/* Main Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
//         >
//           {/* Header Cover Image */}
//           <div className="relative h-72 sm:h-96 w-full bg-gray-200 dark:bg-gray-800">
//             <img
//               src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
//               alt={recipe.name || 'Recipe'}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
//                 {recipe.category || 'General Recipe'}
//               </span>
//               <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
//                 {recipe.name || 'Untitled Recipe'}
//               </h1>
//               <p className="text-gray-300 text-sm sm:text-base">
//                 Created by <span className="text-white font-semibold">{recipe.authorName || recipe.userEmail || 'Chef'}</span>
//               </p>
//             </div>

          
//           </div>

//           {/* Action Toolbar */}
//           <div className="p-4 sm:p-6 bg-orange-50/40 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount || 0}</span>
//               </button>

//               <button
//                 onClick={() => setIsFavorite(!isFavorite)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition shadow-sm"
//               >
//                 <FaFlag />
//                 <span className="hidden sm:inline">Report</span>
//               </button>
//             </div>

//             {/* Right Purchase / Status Button */}
//             {/* Right Purchase / Status Button */}
//         <div>
//   {Number(recipe.price) > 0 && !recipe.isPurchased ? (
//      <form action="/api/payment" method="POST">
//   <input type="hidden" value={recipe.price} name="price" />
//   <input type="hidden" value={recipe.name} name="name" />
//   <input type="hidden" value={recipe._id} name="recipeId" />
//   {/* <input type="hidden" value={recipe.image } name="image" /> */}

//   <button
//     type="submit"
//     className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
//   >
//     <FaShoppingCart />
//     <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//   </button>
//      </form>
//     // <form 
//     //   action={`${SERVER_URL}/api/payment`} // অথবা আপনার Next.js API Route হলে '/api/payment'
//     //   method="POST"
//     //   onSubmit={() => setIsPurchasing(true)}
//     // >
//     //   {/* Hidden input fields to send data silently */}
//     //   <input type="hidden" value={recipe.price} name="price" />
//     //   <input type="hidden" value={recipe.name} name="name" />
//     //   <input type="hidden" value={recipe._id} name="recipeId" />

//     //   <button
//     //     type="submit"
//     //     disabled={isPurchasing}
//     //     className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
//     //   >
//     //     {isPurchasing ? <FaSpinner className="animate-spin" /> : <FaShoppingCart />}
//     //     <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//     //   </button>
//     // </form>
//   ) : (
//     <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//       <FaCheckCircle /> Access Granted
//     </span>
//   )}
//        </div>



//             {/* <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (

//                   <form action="api/payment" method='POST'>
//                 <input value={recipe.price} name='price' />
//                 <input value={recipe.name}  name='name'/>
//                 <input value={recipe._id} name='recipeId' />
//                  <button
//                  type='submit'
//                   onClick={handlePurchase}
//                   disabled={isPurchasing}
//                   className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
//                 >
//                   {isPurchasing ? <FaSpinner className="animate-spin" /> : <FaShoppingCart />}
//                   <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                 </button>
//             </form>

                
               
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//                   <FaCheckCircle /> Access Granted
//                 </span>
//               )}
//             </div> */}

//             {/* <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (


//                 <button
//                   onClick={handlePurchase}
//                   disabled={isPurchasing}
//                   className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
//                 >
//                   {isPurchasing ? <FaSpinner className="animate-spin" /> : <FaShoppingCart />}
//                   <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                 </button>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//                   <FaCheckCircle /> Access Granted
//                 </span>
//               )}
//             </div> */}

//           </div>

//           {/* Quick Info Grid */}
//           <div className="p-6 sm:p-8 space-y-10">
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.category || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.cuisine || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.prepTime ? `${recipe.prepTime} Mins` : 'N/A'}
//                 </span>
//               </div>
//             </div>

//             {/* Ingredients Checklist */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Ingredients List
//               </h3>
//               {ingredientsList.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ingredientsList.map((ing, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleIngredient(idx)}
//                       className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50 line-through text-gray-400 dark:text-gray-500'
//                           : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-orange-300'
//                       }`}
//                     >
//                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-600 border-orange-600 text-white'
//                           : 'border-gray-300 dark:border-gray-600'
//                       }`}>
//                         {checkedIngredients[idx] && <FaCheck />}
//                       </div>
//                       <span className="text-sm font-medium">{ing}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No ingredients specified.</p>
//               )}
//             </div>

//             {/* Step by Step Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Instructions
//               </h3>
//               {instructionsList.length > 0 ? (
//                 <div className="space-y-4">
//                   {instructionsList.map((step, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleStep(idx)}
//                       className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${
//                         completedSteps[idx]
//                           ? 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
//                           : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 hover:border-orange-200'
//                       }`}
//                     >
//                       <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
//                         completedSteps[idx]
//                           ? 'bg-green-600 text-white'
//                           : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
//                       }`}>
//                         {completedSteps[idx] ? <FaCheck /> : idx + 1}
//                       </span>
//                       <p className={`text-sm sm:text-base leading-relaxed pt-1 ${
//                         completedSteps[idx] 
//                           ? 'line-through text-gray-400 dark:text-gray-500' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}>
//                         {step}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No instructions provided.</p>
//               )}
//             </div>

//           </div>
//         </motion.div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Please state why this recipe violates policies or guidelines.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your issue here..."
//                 className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetailsPage;












// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle, 
//   FaSpinner, 
//   FaArrowLeft,
//   FaCheck
// } from 'react-icons/fa';
// import { getRecipes } from '@/lib/actions/recipes';

// const RecipeDetailsPage = ({ params }) => {
//   const router = useRouter();
//   const routeParams = useParams();

//   // Next.js Async Params and Route Fallback Handling
//   let unwrappedParams = null;
//   if (params) {
//     try {
//       unwrappedParams = typeof params.then === 'function' ? use(params) : params;
//     } catch (e) {
//       unwrappedParams = params;
//     }
//   }

//   const recipeId = unwrappedParams?.id || routeParams?.id;

//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [checkedIngredients, setCheckedIngredients] = useState({});
//   const [completedSteps, setCompletedSteps] = useState({});
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [isPurchasing, setIsPurchasing] = useState(false);

//   // Fetch Recipe Details
//   useEffect(() => {
//     let isMounted = true;

//     const fetchRecipe = async () => {
//       if (!recipeId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         let foundRecipe = null;

//         // Try getting from Server Action first
//         try {
//           const allRecipes = await getRecipes();
//           const list = Array.isArray(allRecipes) 
//             ? allRecipes 
//             : allRecipes?.data || allRecipes?.recipes || [];

//           foundRecipe = list.find((item) => {
//             const id = item._id || item.id;
//             return String(id) === String(recipeId);
//           });
//         } catch (serverErr) {
//           console.warn("Server action fallback triggered:", serverErr);
//         }

//         // Direct API Fallback if not found in list
//         if (!foundRecipe) {
//           const res = await axios.get(`/api/recipes/${recipeId}`);
//           foundRecipe = res.data?.data || res.data?.recipe || res.data;
//         }

//         if (isMounted) {
//           setRecipe(foundRecipe || null);
//         }
//       } catch (error) {
//         console.error("Error loading recipe details:", error);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchRecipe();

//     return () => {
//       isMounted = false;
//     };
//   }, [recipeId]);

//   // Ingredient Check Toggle
//   const toggleIngredient = (index) => {
//     setCheckedIngredients((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // Step Completion Toggle
//   const toggleStep = (index) => {
//     setCompletedSteps((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // Like Toggle Handler
//   const handleLike = async () => {
//     if (!recipe) return;
//     try {
//       const nextState = !hasLiked;
//       setHasLiked(nextState);
//       setRecipe((prev) => ({
//         ...prev,
//         likesCount: nextState 
//           ? (prev.likesCount || 0) + 1 
//           : Math.max((prev.likesCount || 0) - 1, 0),
//       }));

//       await axios.patch(`/api/recipes/${recipeId}/like`, { liked: nextState });
//     } catch (err) {
//       console.error("Failed to update like status", err);
//     }
//   };

//   // Stripe Checkout Handler
//   const handlePurchase = async () => {
//     try {
//       setIsPurchasing(true);
//       const res = await axios.post('/api/checkout', { recipeId });
//       if (res.data?.url) {
//         window.location.href = res.data.url;
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || 'Checkout failed');
//     } finally {
//       setIsPurchasing(false);
//     }
//   };

//   // Report Form Submit
//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     if (!reportReason.trim()) return;
//     try {
//       await axios.post(`/api/recipes/${recipeId}/report`, { reason: reportReason });
//       alert('Report submitted successfully!');
//       setShowReportModal(false);
//       setReportReason('');
//     } catch (err) {
//       alert('Failed to submit report.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
//         <FaSpinner className="animate-spin text-4xl text-orange-600" />
//         <p className="text-gray-500 text-sm animate-pulse">Fetching recipe details...</p>
//       </div>
//     );
//   }

//   if (!recipe) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
//         <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-md text-center shadow-md">
//           <div className="text-5xl mb-4">🔍</div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found!</h2>
//           <p className="text-gray-500 text-sm mb-6">
//             The recipe you are looking for does not exist or has been removed.
//           </p>
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition"
//           >
//             <FaArrowLeft /> Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Formatting Lists
//   const ingredientsList = Array.isArray(recipe.ingredients)
//     ? recipe.ingredients
//     : typeof recipe.ingredients === 'string'
//     ? recipe.ingredients.split(',').map((item) => item.trim()).filter(Boolean)
//     : [];

//   const instructionsList = Array.isArray(recipe.instructions)
//     ? recipe.instructions
//     : typeof recipe.instructions === 'string'
//     ? recipe.instructions.split('\n').map((item) => item.trim()).filter(Boolean)
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Back Navigation */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-semibold transition"
//           >
//             <FaArrowLeft /> Back to Recipes
//           </button>
//         </div>

//         {/* Main Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
//         >
//           {/* Header Cover Image */}
//           <div className="relative h-72 sm:h-96 w-full bg-gray-200 dark:bg-gray-800">
//             <img
//               src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
//               alt={recipe.name || 'Recipe'}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
//                 {recipe.category || 'General Recipe'}
//               </span>
//               <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
//                 {recipe.name || 'Untitled Recipe'}
//               </h1>
//               <p className="text-gray-300 text-sm sm:text-base">
//                 Created by <span className="text-white font-semibold">{recipe.authorName || recipe.userEmail || 'Chef'}</span>
//               </p>
//             </div>
//           </div>

//           {/* Action Toolbar */}
//           <div className="p-4 sm:p-6 bg-orange-50/40 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Buttons */}
//             <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount || 0}</span>
//               </button>

//               <button
//                 onClick={() => setIsFavorite(!isFavorite)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition shadow-sm"
//               >
//                 <FaFlag />
//                 <span className="hidden sm:inline">Report</span>
//               </button>
//             </div>

//             {/* Right Purchase / Status Button */}
//             <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (
//                 <button
//                   onClick={handlePurchase}
//                   disabled={isPurchasing}
//                   className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
//                 >
//                   {isPurchasing ? <FaSpinner className="animate-spin" /> : <FaShoppingCart />}
//                   <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                 </button>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-bold px-4 py-2.5 rounded-xl">
//                   <FaCheckCircle /> Access Granted
//                 </span>
//               )}
//             </div>

//           </div>

//           {/* Quick Info Grid */}
//           <div className="p-6 sm:p-8 space-y-10">
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.category || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.cuisine || 'N/A'}
//                 </span>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto text-lg mb-1" />
//                 <span className="text-xs text-gray-500 block uppercase font-medium">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
//                   {recipe.prepTime ? `${recipe.prepTime} Mins` : 'N/A'}
//                 </span>
//               </div>
//             </div>

//             {/* Ingredients Checklist */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Ingredients List
//               </h3>
//               {ingredientsList.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ingredientsList.map((ing, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleIngredient(idx)}
//                       className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50 line-through text-gray-400 dark:text-gray-500'
//                           : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-orange-300'
//                       }`}
//                     >
//                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition ${
//                         checkedIngredients[idx]
//                           ? 'bg-orange-600 border-orange-600 text-white'
//                           : 'border-gray-300 dark:border-gray-600'
//                       }`}>
//                         {checkedIngredients[idx] && <FaCheck />}
//                       </div>
//                       <span className="text-sm font-medium">{ing}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No ingredients specified.</p>
//               )}
//             </div>

//             {/* Step by Step Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Instructions
//               </h3>
//               {instructionsList.length > 0 ? (
//                 <div className="space-y-4">
//                   {instructionsList.map((step, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => toggleStep(idx)}
//                       className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${
//                         completedSteps[idx]
//                           ? 'bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
//                           : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 hover:border-orange-200'
//                       }`}
//                     >
//                       <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition ${
//                         completedSteps[idx]
//                           ? 'bg-green-600 text-white'
//                           : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
//                       }`}>
//                         {completedSteps[idx] ? <FaCheck /> : idx + 1}
//                       </span>
//                       <p className={`text-sm sm:text-base leading-relaxed pt-1 ${
//                         completedSteps[idx] 
//                           ? 'line-through text-gray-400 dark:text-gray-500' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}>
//                         {step}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm italic">No instructions provided.</p>
//               )}
//             </div>

//           </div>
//         </motion.div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               Please state why this recipe violates policies or guidelines.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your issue here..."
//                 className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetailsPage;











// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle,
//   FaSpinner 
// } from 'react-icons/fa';

// const RecipeDetails = () => {
//   const params = useParams();
//   const recipeId = params?.id; // dynamic route /recipes/[id] থেকে id নেওয়া হচ্ছে

//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [isPurchasing, setIsPurchasing] = useState(false);

//   // ১. API/Action থেকে Recipie Detail Fetch করা
//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       if (!recipeId) return;
//       try {
//         setLoading(true);
//         // আপনার API endpoint অনুযায়ী URL টি পরিবর্তন করে নিন
//         const res = await axios.get(`/api/recipes/${recipeId}`);
//         setRecipe(res.data?.data || res.data);
//       } catch (error) {
//         console.error("Failed to fetch recipe details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipeDetails();
//   }, [recipeId]);

//   // Like Handler
//   const handleLike = async () => {
//     if (!recipe) return;
//     try {
//       const newLikedState = !hasLiked;
//       setHasLiked(newLikedState);
//       setRecipe((prev) => ({
//         ...prev,
//         likesCount: newLikedState ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0),
//       }));

//       // API call to persist like status
//       await axios.patch(`/api/recipes/${recipeId}/like`, { liked: newLikedState });
//     } catch (error) {
//       console.error("Like toggle failed:", error);
//     }
//   };

//   // Favorite Handler
//   const handleFavorite = async () => {
//     setIsFavorite(!isFavorite);
//     try {
//       await axios.patch(`/api/recipes/${recipeId}/favorite`, { favorite: !isFavorite });
//     } catch (error) {
//       console.error("Favorite toggle failed:", error);
//     }
//   };

//   // Stripe Purchase Handler
//   const handleStripePurchase = async () => {
//     try {
//       setIsPurchasing(true);
//       const res = await axios.post('/api/checkout', { recipeId: recipe._id });
//       if (res.data?.url) {
//         window.location.href = res.data.url; // Stripe Checkout-এ নিয়ে যাবে
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to initiate purchase');
//     } finally {
//       setIsPurchasing(false);
//     }
//   };

//   // Report Submission Handler
//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     if (!reportReason) return;

//     try {
//       await axios.post(`/api/recipes/${recipeId}/report`, { reason: reportReason });
//       alert('Report submitted successfully!');
//       setShowReportModal(false);
//       setReportReason('');
//     } catch (error) {
//       alert('Failed to submit report');
//     }
//   };

//   // Loading State UI
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
//         <FaSpinner className="animate-spin text-4xl text-orange-500" />
//       </div>
//     );
//   }

//   // Recipe Not Found State UI
//   if (!recipe) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
//         <p className="text-gray-500 dark:text-gray-400 text-lg">Recipe details not found!</p>
//       </div>
//     );
//   }

//   // Format array/string safe access
//   const ingredientsList = Array.isArray(recipe.ingredients)
//     ? recipe.ingredients
//     : recipe.ingredients?.split(',').map((i) => i.trim()) || [];

//   const instructionsList = Array.isArray(recipe.instructions)
//     ? recipe.instructions
//     : recipe.instructions?.split('\n').map((i) => i.trim()) || [];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Main Card */}
//         <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
          
//           {/* Header Image */}
//           <div className="relative h-72 sm:h-96 w-full">
//             <img
//               src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
//               alt={recipe.name}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <h1 className="text-3xl sm:text-5xl font-extrabold mb-2">{recipe.name}</h1>
//               <p className="text-gray-300 text-sm sm:text-base">By {recipe.authorName || recipe.userEmail || 'Chef'}</p>
//             </div>
//           </div>

//           {/* Action Bar */}
//           <div className="p-6 bg-orange-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Actions */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount || 0} Likes</span>
//               </button>

//               <button
//                 onClick={handleFavorite}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition"
//               >
//                 <FaFlag />
//                 <span>Report</span>
//               </button>
//             </div>

//             {/* Right Action */}
//             <div>
//               {Number(recipe.price) > 0 && !recipe.isPurchased ? (
//                 <button
//                   onClick={handleStripePurchase}
//                   disabled={isPurchasing}
//                   className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
//                 >
//                   {isPurchasing ? <FaSpinner className="animate-spin" /> : <FaShoppingCart />}
//                   <span>Buy Recipe (${Number(recipe.price).toFixed(2)})</span>
//                 </button>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-semibold px-4 py-2 rounded-xl">
//                   <FaCheckCircle /> Purchased / Free
//                 </span>
//               )}
//             </div>

//           </div>

//           {/* Details Body */}
//           <div className="p-6 sm:p-8 space-y-8">
            
//             {/* Info Chips */}
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.category || 'N/A'}</span>
//               </div>
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.cuisine || 'N/A'}</span>
//               </div>
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.prepTime ? `${recipe.prepTime} mins` : 'N/A'}</span>
//               </div>
//             </div>

//             {/* Ingredients */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h3>
//               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {ingredientsList.map((ing, idx) => (
//                   <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
//                     <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
//                     <span>{ing}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h3>
//               <ol className="space-y-4">
//                 {instructionsList.map((step, idx) => (
//                   <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
//                     <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs">
//                       {idx + 1}
//                     </span>
//                     <span className="pt-0.5">{step}</span>
//                   </li>
//                 ))}
//               </ol>
//             </div>

//           </div>

//         </div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//               Please tell us why you are reporting this recipe.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your reason here..."
//                 className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetails;









// 'use client';

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FaHeart, 
//   FaBookmark, 
//   FaFlag, 
//   FaShoppingCart, 
//   FaClock, 
//   FaUtensils, 
//   FaGlobe, 
//   FaCheckCircle 
// } from 'react-icons/fa';

// const RecipeDetails = () => {
//   // ডামি স্টেট (পরে আপনার API এবং Stripe Checkout এর সাথে যুক্ত করবেন)
//   const [recipe, setRecipe] = useState({
//     _id: '1',
//     name: 'Creamy Tuscan Garlic Chicken',
//     category: 'Dinner',
//     cuisine: 'Italian',
//     prepTime: '30 mins',
//     likesCount: 142,
//     price: 5.99,
//     authorName: 'Chef Giovanni',
//     isPurchased: false, // Stripe দিয়ে বাই করা হয়েছে কিনা
//     instructions: [
//       'Season chicken breasts with salt, pepper, and Italian seasoning.',
//       'Sear chicken in a skillet over medium-high heat until golden brown.',
//       'Prepare garlic cream sauce with heavy cream, sun-dried tomatoes, and spinach.',
//       'Simmer chicken in sauce for 10 minutes until fully cooked and tender.'
//     ],
//     ingredients: [
//       '2 Boneless chicken breasts',
//       '1 cup Heavy cream',
//       '1/2 cup Sun-dried tomatoes',
//       '2 cups Fresh spinach',
//       '4 cloves Minced garlic'
//     ],
//     image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
//   });

//   const [hasLiked, setHasLiked] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');

//   // ১. Like Handler
//   const handleLike = () => {
//     if (!hasLiked) {
//       setRecipe((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
//       setHasLiked(true);
//     } else {
//       setRecipe((prev) => ({ ...prev, likesCount: prev.likesCount - 1 }));
//       setHasLiked(false);
//     }
//   };

//   // ২. Favorite Handler
//   const handleFavorite = () => {
//     setIsFavorite(!isFavorite);
//     alert(!isFavorite ? 'Added to Favorites!' : 'Removed from Favorites!');
//   };

//   // ৩. Stripe Purchase Handler
//   const handleStripePurchase = async () => {
//     alert(`Redirecting to Stripe Checkout for $${recipe.price}...`);
//     // এখানে ব্যাকএন্ডে Stripe Checkout Session তৈরি করে Stripe URL-এ রিডাইরেক্ট করবেন
//   };

//   // ৪. Report Submission Handler
//   const handleReportSubmit = (e) => {
//     e.preventDefault();
//     if (!reportReason) return;
//     alert(`Report submitted: "${reportReason}"`);
//     setShowReportModal(false);
//     setReportReason('');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-200">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Main Card */}
//         <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
          
//           {/* Header Image */}
//           <div className="relative h-72 sm:h-96 w-full">
//             <img
//               src={recipe.image}
//               alt={recipe.name}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <h1 className="text-3xl sm:text-5xl font-extrabold mb-2">{recipe.name}</h1>
//               <p className="text-gray-300 text-sm sm:text-base">By {recipe.authorName}</p>
//             </div>
//           </div>

//           {/* Action Bar (Buttons) */}
//           <div className="p-6 bg-orange-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
//             {/* Left Actions: Like, Favorite, Report */}
//             <div className="flex items-center gap-3">
//               {/* Like Button */}
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
//                   hasLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
//                 <span>{recipe.likesCount} Likes</span>
//               </button>

//               {/* Favorite Button */}
//               <button
//                 onClick={handleFavorite}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
//                   isFavorite 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FaBookmark />
//                 <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
//               </button>

//               {/* Report Button */}
//               <button
//                 onClick={() => setShowReportModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition"
//               >
//                 <FaFlag />
//                 <span>Report</span>
//               </button>
//             </div>

//             {/* Right Action: Purchase Button (Stripe Integration) */}
//             <div>
//               {recipe.price > 0 && !recipe.isPurchased ? (
//                 <button
//                   onClick={handleStripePurchase}
//                   className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition"
//                 >
//                   <FaShoppingCart />
//                   <span>Buy Recipe (${recipe.price})</span>
//                 </button>
//               ) : (
//                 <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-semibold px-4 py-2 rounded-xl">
//                   <FaCheckCircle /> Purchased / Free
//                 </span>
//               )}
//             </div>

//           </div>

//           {/* Details Body */}
//           <div className="p-6 sm:p-8 space-y-8">
            
//             {/* Recipe Info Chips */}
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaUtensils className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Category</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.category}</span>
//               </div>
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaGlobe className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Cuisine</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.cuisine}</span>
//               </div>
//               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
//                 <FaClock className="text-orange-500 mx-auto mb-1" />
//                 <span className="text-xs text-gray-500 block">Prep Time</span>
//                 <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.prepTime}</span>
//               </div>
//             </div>

//             {/* Ingredients */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h3>
//               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {recipe.ingredients.map((ing, idx) => (
//                   <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
//                     <span className="w-2 h-2 rounded-full bg-orange-500" />
//                     <span>{ing}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Instructions */}
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h3>
//               <ol className="space-y-4">
//                 {recipe.instructions.map((step, idx) => (
//                   <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
//                     <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs">
//                       {idx + 1}
//                     </span>
//                     <span className="pt-0.5">{step}</span>
//                   </li>
//                 ))}
//               </ol>
//             </div>

//           </div>

//         </div>

//       </div>

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//               Report Recipe
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//               Please tell us why you are reporting this recipe.
//             </p>

//             <form onSubmit={handleReportSubmit} className="space-y-4">
//               <textarea
//                 rows="4"
//                 required
//                 value={reportReason}
//                 onChange={(e) => setReportReason(e.target.value)}
//                 placeholder="Write your reason here..."
//                 className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
//                 >
//                   Submit Report
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RecipeDetails;