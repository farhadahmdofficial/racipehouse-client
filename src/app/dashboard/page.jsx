'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';

const Overview = () => {
   const { data: session } = authClient.useSession();
    const user = session?.user;
  
    console.log(user);
  const adminStats= [
    { title: 'Total Users', count: 1250, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
    { title: 'Total Recipes', count: 840, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
    { title: 'Premium Members', count: 195, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
    { title: 'Total Reports', count: 14, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
  ];
  const userStats = [
    { title: 'Total Recipes', count: 6, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
    { title: 'Total Favorites', count: 3, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
    { title: 'Likes Received', count: 5, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
    
  ];

  const stats = user?.role === 'admin' ? adminStats : userStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white"> {user?.role} Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System metrics and manage user activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
                <Icon />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;