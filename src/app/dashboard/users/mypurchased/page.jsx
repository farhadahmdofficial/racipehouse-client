"use client";

import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaEye,
  FaSpinner,
  FaTimes,
  FaUtensils,
  FaClock,
  FaListUl,
  FaBookOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MyPurchasedPage = () => {
  const [purchasedList, setPurchasedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch Purchased Recipes
  const fetchPurchasedRecipes = async () => {
    try {
      const res = await axios.get("/api/recipes/purchased");
      setPurchasedList(res.data.purchasedRecipes || []);
    } catch (error) {
      console.error("Failed to load purchased recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedRecipes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6"
      >
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FaShoppingBag className="text-orange-500" /> Purchased Recipes
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="animate-spin text-3xl text-orange-500" />
          </div>
        ) : purchasedList.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 space-y-3">
            <FaUtensils className="mx-auto text-4xl text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-medium">You haven't purchased any recipes yet.</p>
          </div>
        ) : (
          /* Purchased Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {purchasedList.map((item) => {
                const recipe = item.recipe;
                if (!recipe) return null;

                const formattedDate = new Date(item.purchasedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 bg-gray-50 dark:bg-gray-950/60 hover:border-orange-500/50 transition-all shadow-xs"
                  >
                    <img
                      src={recipe.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"}
                      alt={recipe.name || "Purchased Recipe"}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                          {recipe.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          Purchased on: {formattedDate}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="w-fit flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer"
                      >
                        <FaEye size={12} /> View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* --- Recipe Details Modal --- */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition p-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <FaTimes size={14} />
              </button>

              {/* Header Image & Info */}
              <div className="flex gap-4 items-start pr-6">
                <img
                  src={selectedRecipe.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"}
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

              {/* Ingredients Section */}
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

              {/* Instructions Section */}
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

              {/* Close Footer Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
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

export default MyPurchasedPage;