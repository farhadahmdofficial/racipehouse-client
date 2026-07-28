'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaBookmark, 
  FaFlag, 
  FaShoppingCart, 
  FaClock, 
  FaUtensils, 
  FaGlobe, 
  FaCheckCircle 
} from 'react-icons/fa';

const RecipeDetails = () => {
  // ডামি স্টেট (পরে আপনার API এবং Stripe Checkout এর সাথে যুক্ত করবেন)
  const [recipe, setRecipe] = useState({
    _id: '1',
    name: 'Creamy Tuscan Garlic Chicken',
    category: 'Dinner',
    cuisine: 'Italian',
    prepTime: '30 mins',
    likesCount: 142,
    price: 5.99,
    authorName: 'Chef Giovanni',
    isPurchased: false, // Stripe দিয়ে বাই করা হয়েছে কিনা
    instructions: [
      'Season chicken breasts with salt, pepper, and Italian seasoning.',
      'Sear chicken in a skillet over medium-high heat until golden brown.',
      'Prepare garlic cream sauce with heavy cream, sun-dried tomatoes, and spinach.',
      'Simmer chicken in sauce for 10 minutes until fully cooked and tender.'
    ],
    ingredients: [
      '2 Boneless chicken breasts',
      '1 cup Heavy cream',
      '1/2 cup Sun-dried tomatoes',
      '2 cups Fresh spinach',
      '4 cloves Minced garlic'
    ],
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
  });

  const [hasLiked, setHasLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // ১. Like Handler
  const handleLike = () => {
    if (!hasLiked) {
      setRecipe((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
      setHasLiked(true);
    } else {
      setRecipe((prev) => ({ ...prev, likesCount: prev.likesCount - 1 }));
      setHasLiked(false);
    }
  };

  // ২. Favorite Handler
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    alert(!isFavorite ? 'Added to Favorites!' : 'Removed from Favorites!');
  };

  // ৩. Stripe Purchase Handler
  const handleStripePurchase = async () => {
    alert(`Redirecting to Stripe Checkout for $${recipe.price}...`);
    // এখানে ব্যাকএন্ডে Stripe Checkout Session তৈরি করে Stripe URL-এ রিডাইরেক্ট করবেন
  };

  // ৪. Report Submission Handler
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason) return;
    alert(`Report submitted: "${reportReason}"`);
    setShowReportModal(false);
    setReportReason('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
          
          {/* Header Image */}
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-2">{recipe.name}</h1>
              <p className="text-gray-300 text-sm sm:text-base">By {recipe.authorName}</p>
            </div>
          </div>

          {/* Action Bar (Buttons) */}
          <div className="p-6 bg-orange-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Actions: Like, Favorite, Report */}
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
                  hasLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaHeart className={hasLiked ? 'text-white' : 'text-red-500'} />
                <span>{recipe.likesCount} Likes</span>
              </button>

              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${
                  isFavorite 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBookmark />
                <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
              </button>

              {/* Report Button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:text-red-600 transition"
              >
                <FaFlag />
                <span>Report</span>
              </button>
            </div>

            {/* Right Action: Purchase Button (Stripe Integration) */}
            <div>
              {recipe.price > 0 && !recipe.isPurchased ? (
                <button
                  onClick={handleStripePurchase}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition"
                >
                  <FaShoppingCart />
                  <span>Buy Recipe (${recipe.price})</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-sm font-semibold px-4 py-2 rounded-xl">
                  <FaCheckCircle /> Purchased / Free
                </span>
              )}
            </div>

          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Recipe Info Chips */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaUtensils className="text-orange-500 mx-auto mb-1" />
                <span className="text-xs text-gray-500 block">Category</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.category}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaGlobe className="text-orange-500 mx-auto mb-1" />
                <span className="text-xs text-gray-500 block">Cuisine</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.cuisine}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <FaClock className="text-orange-500 mx-auto mb-1" />
                <span className="text-xs text-gray-500 block">Prep Time</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{recipe.prepTime}</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ingredients</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

        </div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Report Recipe
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please tell us why you are reporting this recipe.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                rows="4"
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Write your reason here..."
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
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

export default RecipeDetails;