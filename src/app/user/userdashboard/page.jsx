





'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaHeart, FaBookmark, FaCrown } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const UserDashboard = () => {
  // Better Auth থেকে কারেন্ট সেশন রিড করা
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // ১. লোডিং স্টেট (ডাটা ফেচ হওয়ার সময় দেখাবে)
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ২. ইউজার লগইন না থাকলে প্রোটেক্টেড মেসেজ
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You must be logged in to view your dashboard.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ডাইনামিক ইউজার ডাটা এবং পেমেন্ট/কাস্টম প্রপার্টি
  const isPremium = user?.isPremium || false; 

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
            {/* ডাইনামিক প্রোফাইল ইমেজ অথবা নেম অবতার */}
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-2xl shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Chef Member'}
                </h1>
                
                {/* Premium Badge Based on Payment */}
                {isPremium && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                    <FaCrown className="text-amber-500" />
                    <span>Premium Member</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
            </div>
          </div>

          {!isPremium && (
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
                {user?.totalRecipes || 0}
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
                {user?.totalFavorites || 0}
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
                {user?.totalLikesReceived || 0}
              </h3>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;


















// 'use client';

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FaUtensils, FaHeart, FaBookmark, FaCrown, FaCheckCircle } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client'; 

// const UserDashboard = () => {
//   // ডামি ইউজার ডেটা (পরে আপনার API / Auth State থেকে পাবেন)
//  const { data: session, isPending, error } = authClient.useSession();
//  const user = session.user;

//   const [userStats] = useState({
//     name: 'Alex Ri',
//     email: 'alex@recipehouse.com',
//     image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
//     isPremium: true, // Stripe Payment সফল হলে true হবে
//     totalRecipes: 12,
//     totalFavorites: 8,
//     totalLikesReceived: 340,
//   });
//   // const [userStats] = useState({
//   //   name: 'Alex Rivera',
//   //   email: 'alex@recipehouse.com',
//   //   image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
//   //   isPremium: true, // Stripe Payment সফল হলে true হবে
//   //   totalRecipes: 12,
//   //   totalFavorites: 8,
//   //   totalLikesReceived: 340,
//   // });

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
//         {/* User Profile Overview */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
//         >
//           <div className="flex items-center gap-5">
//             <img
//               src={userStats.image}
//               alt={userStats.name}
//               className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
//             />
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {userStats.name}
//                 </h1>
//                 {/* Premium Badge Based on Payment */}
//                 {userStats.isPremium && (
//                   <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
//                     <FaCrown className="text-amber-500" />
//                     <span>Premium Member</span>
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{userStats.email}</p>
//             </div>
//           </div>

//           {!userStats.isPremium && (
//             <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm">
//               <FaCrown />
//               <span>Upgrade to Premium</span>
//             </button>
//           )}
//         </motion.div>

//         {/* Dashboard Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
//           {/* Total Recipes */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl">
//               <FaUtensils />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Recipes
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalRecipes}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Favorites */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
//               <FaBookmark />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Favorites
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalFavorites}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Likes Received */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
//               <FaHeart />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Likes Received
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalLikesReceived}
//               </h3>
//             </div>
//           </motion.div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;