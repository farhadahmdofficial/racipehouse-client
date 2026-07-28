'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaHeart, FaBookmark, FaCrown, FaCheckCircle } from 'react-icons/fa';

const UserDashboard = () => {
  // ডামি ইউজার ডেটা (পরে আপনার API / Auth State থেকে পাবেন)
  const [userStats] = useState({
    name: 'Alex Rivera',
    email: 'alex@recipehouse.com',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isPremium: true, // Stripe Payment সফল হলে true হবে
    totalRecipes: 12,
    totalFavorites: 8,
    totalLikesReceived: 340,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <img
              src={userStats.image}
              alt={userStats.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.name}
                </h1>
                {/* Premium Badge Based on Payment */}
                {userStats.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                    <FaCrown className="text-amber-500" />
                    <span>Premium Member</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{userStats.email}</p>
            </div>
          </div>

          {!userStats.isPremium && (
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm">
              <FaCrown />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </motion.div>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Total Recipes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl">
              <FaUtensils />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Total Recipes
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {userStats.totalRecipes}
              </h3>
            </div>
          </motion.div>

          {/* Total Favorites */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
              <FaBookmark />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Total Favorites
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {userStats.totalFavorites}
              </h3>
            </div>
          </motion.div>

          {/* Total Likes Received */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
              <FaHeart />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Likes Received
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {userStats.totalLikesReceived}
              </h3>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;