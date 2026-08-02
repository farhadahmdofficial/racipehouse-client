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
    price: 0,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '4',
    name: 'Mediterranean Quinoa Bowl',
    category: 'Lunch',
    cuisine: 'Mediterranean',
    prepTime: '25 mins',
    likesCount: 85,
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '5',
    name: 'Garlic Butter Steak Bites',
    category: 'Dinner',
    cuisine: 'American',
    prepTime: '20 mins',
    likesCount: 175,
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '6',
    name: 'Mango Coconut Smoothie Bowl',
    category: 'Breakfast',
    cuisine: 'Hawaiian',
    prepTime: '10 mins',
    likesCount: 67,
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '7',
    name: 'Chicken Enchilada Soup',
    category: 'Lunch',
    cuisine: 'Mexican',
    prepTime: '35 mins',
    likesCount: 112,
    price: 0,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '8',
    name: 'Lemon Herb Salmon',
    category: 'Dinner',
    cuisine: 'French',
    prepTime: '40 mins',
    likesCount: 203,
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '9',
    name: 'Avocado Toast with Egg',
    category: 'Breakfast',
    cuisine: 'California',
    prepTime: '10 mins',
    likesCount: 156,
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '10',
    name: 'Spicy Tuna Poke Bowl',
    category: 'Lunch',
    cuisine: 'Japanese',
    prepTime: '20 mins',
    likesCount: 134,
    price: 7.25,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '11',
    name: 'Creamy Mushroom Risotto',
    category: 'Dinner',
    cuisine: 'Italian',
    prepTime: '45 mins',
    likesCount: 91,
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: '12',
    name: 'Banana Oatmeal Cookies',
    category: 'Breakfast',
    cuisine: 'American',
    prepTime: '18 mins',
    likesCount: 77,
    price: 0,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  }

  // {
  //   _id: '1',
  //   name: 'Creamy Tuscan Garlic Chicken',
  //   category: 'Dinner',
  //   cuisine: 'Italian',
  //   prepTime: '30 mins',
  //   likesCount: 142,
  //   price: 5.99,
  //   image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
  // },
  // {
  //   _id: '2',
  //   name: 'Spicy Thai Basil Beef',
  //   category: 'Lunch',
  //   cuisine: 'Thai',
  //   prepTime: '20 mins',
  //   likesCount: 98,
  //   price: 4.50,
  //   image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
  // },
  // {
  //   _id: '3',
  //   name: 'Classic Berry Pancakes',
  //   category: 'Breakfast',
  //   cuisine: 'American',
  //   prepTime: '15 mins',
  //   likesCount: 210,
  //   price: 0, // Free Recipe
  //   image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
  // },
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