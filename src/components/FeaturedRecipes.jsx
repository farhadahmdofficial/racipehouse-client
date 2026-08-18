

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUtensils, FaGlobe, FaSpinner } from 'react-icons/fa';
import { getRecipes } from '@/lib/actions/recipes';

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  

useEffect(() => {
  let isMounted = true;

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const result = await getRecipes();

      console.log("getRecipes response:", result);

      let data = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.recipes)) { // { recipes: [...] } কভার করবে
        data = result.recipes;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      }

      if (isMounted) {
        setRecipes(data.slice(0, 6));
      }
    } catch (error) {
      console.error("Failed to fetch featured recipes:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };



  fetchFeatured();

  return () => {
    isMounted = false;
  };
}, []);

  if (loading) {
    return (
      <div className="py-16 bg-white dark:bg-gray-900 flex justify-center items-center">
        <FaSpinner className="animate-spin text-3xl text-orange-600" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Featured Recipes
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Handpicked delicious recipes selected specially by our culinary team.
          </p>
        </div>

        {/* Recipe Cards Grid */}
        {recipes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No featured recipes available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => {
              const recipeId = recipe._id || recipe.id;

              return (
                <motion.div
                  key={recipeId || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={recipe.name || 'Recipe'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Featured
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
                        {recipe.name || 'Untitled Recipe'}
                      </h3>

                      {/* Metadata */}
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                          <FaUtensils className="text-orange-500" />
                          <span><strong>Category:</strong> {recipe.category || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaGlobe className="text-orange-500" />
                          <span><strong>Cuisine:</strong> {recipe.cuisine || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-orange-500" />
                          <span><strong>Prep Time:</strong> {recipe.prepTime ? `${recipe.prepTime} mins` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/browserecipes/${recipeId}`}
                      className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition duration-200"
                    >
                      View Recipe
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
    // add
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Featured Recipes
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Handpicked delicious recipes selected specially by our culinary team.
          </p>
        </div>

        {/* Recipe Cards Grid */}
        {recipes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No featured recipes available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => {
              const recipeId = recipe._id || recipe.id;

              return (
                <motion.div
                  key={recipeId || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={recipe.name || 'Recipe'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Featured
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
                        {recipe.name || 'Untitled Recipe'}
                      </h3>

                      {/* Metadata */}
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                          <FaUtensils className="text-orange-500" />
                          <span><strong>Category:</strong> {recipe.category || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaGlobe className="text-orange-500" />
                          <span><strong>Cuisine:</strong> {recipe.cuisine || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-orange-500" />
                          <span><strong>Prep Time:</strong> {recipe.prepTime ? `${recipe.prepTime} mins` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/browserecipes/${recipeId}`}
                      className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition duration-200"
                    >
                      View Recipe
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedRecipes;










// ok code 


// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { FaClock, FaUtensils, FaGlobe } from 'react-icons/fa';


// // ডামি ডেটা (পরে আপনার API / MongoDB থেকে ফেচ করে বসাবেন)



// const Featured = [
//   {
//     _id: '1',
//     name: 'Creamy Tuscan Garlic Chicken',
//     category: 'Dinner',
//     cuisine: 'Italian',
//     prepTime: '30 mins',
//     image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     _id: '2',
//     name: 'Spicy Thai Basil Beef',
//     category: 'Lunch',
//     cuisine: 'Thai',
//     prepTime: '20 mins',
//     image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     _id: '3',
//     name: 'Classic Berry Pancakes',
//     category: 'Breakfast',
//     cuisine: 'American',
//     prepTime: '15 mins',
//     image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
//   },
// ];







// const FeaturedRecipes =  () => {
  

//   return (
//     <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Section Header */}
//         <div className="text-center max-w-2xl mx-auto mb-12">
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
//             Featured Recipes
//           </h2>
//           <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
//             Handpicked delicious recipes selected specially by our culinary team.
//           </p>
//         </div>

//         {/* Recipe Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {Featured.map((recipe, index) => (
//             <motion.div
//               key={recipe._id}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.15 }}
//               whileHover={{ y: -8 }}
//               className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
//             >
//               {/* Image Container */}
//               <div className="relative h-48 w-full overflow-hidden">
//                 <img
//                   src={recipe.image}
//                   alt={recipe.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
//                   Featured
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="p-6 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
//                     {recipe.name}
//                   </h3>

//                   {/* Metadata */}
//                   <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
//                     <div className="flex items-center gap-2">
//                       <FaUtensils className="text-orange-500" />
//                       <span><strong>Category:</strong> {recipe.category}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FaGlobe className="text-orange-500" />
//                       <span><strong>Cuisine:</strong> {recipe.cuisine}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FaClock className="text-orange-500" />
//                       <span><strong>Prep Time:</strong> {recipe.prepTime}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <Link
//                   href={`/recipes/${recipe._id}`}
//                   className="w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition duration-200"
//                 >
//                   View Recipe
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default FeaturedRecipes;