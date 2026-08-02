'use client';

import React, { useState } from 'react';
import { FaTrash, FaEdit, FaStar, FaRegStar } from 'react-icons/fa';

const initialRecipes = [
  { _id: '1', name: 'Creamy Tuscan Garlic Chicken', author: 'Chef Giovanni', category: 'Dinner', isFeatured: true },
  { _id: '2', name: 'Spicy Thai Basil Beef', author: 'Sarah Smith', category: 'Lunch', isFeatured: false },
  { _id: '3', name: 'Classic Berry Pancakes', author: 'Mark Wilson', category: 'Breakfast', isFeatured: false },
];

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState(initialRecipes);

  const toggleFeatured = (recipeId) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === recipeId ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const handleDelete = (recipeId) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage All Recipes</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase font-semibold">
              <th className="py-4 px-6">Recipe Name</th>
              <th className="py-4 px-6">Author</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Featured</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {recipes.map((recipe) => (
              <tr key={recipe._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{recipe.name}</td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{recipe.author}</td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{recipe.category}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => toggleFeatured(recipe._id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                      recipe.isFeatured
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {recipe.isFeatured ? <FaStar className="text-amber-500" /> : <FaRegStar />}
                    <span>{recipe.isFeatured ? 'Featured' : 'Make Featured'}</span>
                  </button>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => alert(`Edit Modal for ${recipe.name}`)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRecipes;
