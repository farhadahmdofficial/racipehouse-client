




"use client";

import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaEye,
  FaTrashAlt,
  FaSpinner,
  FaTimes,
  FaClock,
  FaListUl,
  FaBookOpen,
  FaUtensils,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch all favorite recipes
  const fetchFavorites = async () => {
    try {
      const res = await axios.get("/api/recipes/favorites");
      setFavorites(res.data.favorites || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };


  // const fetchFavorites = async () => {
  //   try {
  //     const res = await axios.get("/api/recipes/favorites");
  //     setFavorites(res.data.favorites || []);
  //     } catch (error) {
  //   console.error("Failed to load favorites:", error);
  // } font-semibold {
  //   setLoading(false);
  // }



  //   // } catch (error) {
  //   //   console.error("Failed to load favorites:", error);
  //   // } font-semibold {
  //   //   setLoading(false);
  //   // }
  // };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Handle Remove Recipe from Favorites
  const handleRemoveFavorite = async (favoriteId) => {
    setRemovingId(favoriteId);
    try {
      const res = await axios.delete("/api/recipes/favorites", {
        data: { favoriteId },
      });

      if (res.status === 200) {
        setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <FaHeart className="text-red-500" /> Favorite Recipes
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
            Total: {favorites.length}
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="animate-spin text-3xl text-orange-500" />
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 space-y-3">
            <FaHeart className="mx-auto text-4xl text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-medium">You haven't saved any recipes to favorites yet.</p>
          </div>
        ) : (
          <>
            {/* 1. TABLE FORMAT (Desktop View: md & larger) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-950 text-xs font-mono uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">Recipe</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Prep Time</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  <AnimatePresence>
                    {favorites.map((item) => {
                      const recipe = item.recipe;
                      if (!recipe) return null;

                      return (
                        <motion.tr
                          key={item._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                              alt={recipe.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{recipe.name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-medium">
                              {recipe.category || "General"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs">
                            {recipe.prepTime ? `${recipe.prepTime} mins` : "N/A"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Details Button */}
                              <button
                                onClick={() => setSelectedRecipe(recipe)}
                                className="flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
                              >
                                <FaEye size={12} /> View Details
                              </button>
                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveFavorite(item._id)}
                                disabled={removingId === item._id}
                                title="Remove from Favorites"
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50 cursor-pointer"
                              >
                                {removingId === item._id ? (
                                  <FaSpinner className="animate-spin" size={12} />
                                ) : (
                                  <FaTrashAlt size={12} />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* 2. CARD FORMAT (Mobile View: smaller than md) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              <AnimatePresence>
                {favorites.map((item) => {
                  const recipe = item.recipe;
                  if (!recipe) return null;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 bg-gray-50/50 dark:bg-gray-950/50"
                    >
                      <img
                        src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={recipe.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                              {recipe.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-medium flex-shrink-0">
                              {recipe.category || "General"}
                            </span>
                          </div>
                          {recipe.prepTime && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                              <FaClock size={10} className="text-orange-500" /> {recipe.prepTime} mins
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setSelectedRecipe(recipe)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
                          >
                            <FaEye size={12} /> View Details
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(item._id)}
                            disabled={removingId === item._id}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50 cursor-pointer"
                          >
                            {removingId === item._id ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : (
                              <FaTrashAlt size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>

      {/* --- View Details Modal --- */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
            >
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-1 bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer"
              >
                <FaTimes size={14} />
              </button>

              <div className="flex gap-4 items-start pr-6">
                <img
                  src={selectedRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={selectedRecipe.name}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-[10px] font-semibold uppercase tracking-wider">
                    {selectedRecipe.category || "General"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedRecipe.name}
                  </h3>
                  {selectedRecipe.prepTime && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <FaClock size={11} className="text-orange-500" /> Prep Time: {selectedRecipe.prepTime} mins
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Ingredients List */}
              {selectedRecipe.ingredients && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono uppercase text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FaListUl className="text-orange-500" /> Ingredients
                  </h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-1 bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    {Array.isArray(selectedRecipe.ingredients)
                      ? selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
                      : selectedRecipe.ingredients.split(",").map((ing, idx) => <li key={idx}>{ing.trim()}</li>)}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {selectedRecipe.instructions && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono uppercase text-gray-900 dark:text-white flex items-center gap-1.5">
                    <FaBookOpen className="text-orange-500" /> Cooking Instructions
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 leading-relaxed whitespace-pre-line">
                    {Array.isArray(selectedRecipe.instructions)
                      ? selectedRecipe.instructions.map((step, idx) => (
                          <p key={idx}>
                            <span className="font-bold text-orange-500">{idx + 1}.</span> {step}
                          </p>
                        ))
                      : selectedRecipe.instructions}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesPage;