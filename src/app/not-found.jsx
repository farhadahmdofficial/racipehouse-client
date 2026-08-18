

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaUtensils, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon & 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center items-center"
        >
          <h1 className="text-9xl font-extrabold text-orange-500/20 dark:text-orange-500/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/60 rounded-full flex items-center justify-center text-orange-500 text-4xl shadow-inner">
              <FaUtensils />
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Oops! The page or recipe you are looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
          >
            <FaHome /> Back to Home
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaUtensils /> Browse Recipes
          </Link>
        </motion.div>

      </div>
    </div>
  );
}


