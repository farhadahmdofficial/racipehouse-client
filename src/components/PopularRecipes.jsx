'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaUser } from 'react-icons/fa';

// ডামি ডেটা
const dummyPopular = [
  {
    _id: '101',
    name: 'Authentic Japanese Ramen',
    likesCount: 1420,
    authorName: 'Chef Kenji',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '102',
    name: 'Slow-Cooked Beef Biryani',
    likesCount: 980,
    authorName: 'Ayesha Rahman',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '103',
    name: 'Decadent Chocolate Lava Cake',
    likesCount: 850,
    authorName: 'Maria Garcia',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  },
];

const PopularRecipes = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Most Popular Recipes
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Tried, tested, and highly rated by thousands of foodies in our community.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyPopular.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Likes Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                  <FaHeart className="text-red-500" />
                  <span>{recipe.likesCount}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-1">
                  {recipe.name}
                </h3>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaUser className="text-orange-500" />
                    <span>By <strong className="text-gray-800 dark:text-gray-200">{recipe.authorName}</strong></span>
                  </div>

                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="text-sm font-semibold text-orange-600 dark:text-orange-500 hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularRecipes;