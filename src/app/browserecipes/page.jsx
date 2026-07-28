'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaGlobe, FaHeart } from 'react-icons/fa';

// ডামি ডেটা (পরে আপনার API থেকে ফেচ করবেন)
const initialRecipes = [
  {
    _id: '1',
    name: 'Creamy Tuscan Garlic Chicken',
    category: 'Dinner',
    cuisine: 'Italian',
    prepTime: '30 mins',
    likesCount: 142,
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '2',
    name: 'Spicy Thai Basil Beef',
    category: 'Lunch',
    cuisine: 'Thai',
    prepTime: '20 mins',
    likesCount: 98,
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '3',
    name: 'Classic Berry Pancakes',
    category: 'Breakfast',
    cuisine: 'American',
    prepTime: '15 mins',
    likesCount: 210,
    price: 0, // Free Recipe
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
  },
];

const BrowseRecipes = () => {
  const [recipes] = useState(initialRecipes);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Browse All Recipes
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Explore hundreds of delicious recipes created by home chefs and culinary experts.
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <FaHeart className="text-red-500" />
                    <span>{recipe.likesCount}</span>
                  </div>
                  {recipe.price > 0 && (
                    <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      ${recipe.price}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-1">
                    {recipe.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <FaUtensils className="text-orange-500" />
                      <span><strong>Category:</strong> {recipe.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-orange-500" />
                      <span><strong>Cuisine:</strong> {recipe.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-orange-500" />
                      <span><strong>Prep Time:</strong> {recipe.prepTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/recipes/${recipe._id}`}
                  className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition duration-200"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BrowseRecipes;