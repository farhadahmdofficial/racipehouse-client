"use client";

import React, { useEffect, useState } from "react";
import { FaList, FaEdit, FaTrash, FaSpinner, FaUtensils, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Edit Modal State
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch User's Recipes
  const fetchMyRecipes = async () => {
    try {
      const res = await axios.get("/api/recipes/my-recipes");
      setRecipes(res.data.recipes || []);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setDeletingId(id);
    try {
      const res = await axios.delete("/api/recipes/my-recipes", {
        data: { recipeId: id },
      });

      if (res.status === 200) {
        setRecipes((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete recipe.");
    } finally {
      setDeletingId(null);
    }
  };

  // Update Recipe Submit Handler
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {
        recipeId: selectedRecipe._id,
        name: selectedRecipe.name,
        category: selectedRecipe.category,
        prepTime: Number(selectedRecipe.prepTime),
        cuisine: selectedRecipe.cuisine,
        difficulty: selectedRecipe.difficulty,
        ingredients: Array.isArray(selectedRecipe.ingredients)
          ? selectedRecipe.ingredients
          : selectedRecipe.ingredients.split(",").map((i) => i.trim()),
        instructions: Array.isArray(selectedRecipe.instructions)
          ? selectedRecipe.instructions
          : selectedRecipe.instructions.split("\n").map((i) => i.trim()),
      };

      const res = await axios.put("/api/recipes/my-recipes", payload);

      if (res.status === 200) {
        alert("Recipe updated successfully!");
        setSelectedRecipe(null);
        fetchMyRecipes();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update recipe.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
      >
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <FaList className="text-orange-500" /> My Published Recipes
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-orange-500" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 space-y-2">
            <FaUtensils className="mx-auto text-3xl text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-medium">You haven't published any recipes yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
              <thead className="text-[10px] uppercase font-mono bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-3">Recipe</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Prep Time</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {recipes.map((recipe) => (
                    <motion.tr
                      key={recipe._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                    >
                      <td className="p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                          <img
                            src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {recipe.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-medium">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="p-3">{recipe.prepTime} mins</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          title="Edit Recipe"
                          onClick={() =>
                            setSelectedRecipe({
                              ...recipe,
                              ingredients: Array.isArray(recipe.ingredients)
                                ? recipe.ingredients.join(", ")
                                : recipe.ingredients,
                              instructions: Array.isArray(recipe.instructions)
                                ? recipe.instructions.join("\n")
                                : recipe.instructions,
                            })
                          }
                          className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          title="Delete Recipe"
                          onClick={() => handleDelete(recipe._id)}
                          disabled={deletingId === recipe._id}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition"
                        >
                          {deletingId === recipe._id ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : (
                            <FaTrash size={12} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* --- Edit Recipe Modal --- */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <FaTimes size={16} />
              </button>

              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Edit Recipe
              </h3>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Recipe Name</label>
                  <input
                    type="text"
                    required
                    value={selectedRecipe.name}
                    onChange={(e) =>
                      setSelectedRecipe({ ...selectedRecipe, name: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Category</label>
                    <select
                      value={selectedRecipe.category}
                      onChange={(e) =>
                        setSelectedRecipe({ ...selectedRecipe, category: e.target.value })
                      }
                      className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Prep Time (mins)</label>
                    <input
                      type="number"
                      required
                      value={selectedRecipe.prepTime}
                      onChange={(e) =>
                        setSelectedRecipe({ ...selectedRecipe, prepTime: e.target.value })
                      }
                      className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Ingredients (comma separated)</label>
                  <textarea
                    rows={3}
                    required
                    value={selectedRecipe.ingredients}
                    onChange={(e) =>
                      setSelectedRecipe({ ...selectedRecipe, ingredients: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-400">Instructions (one per line)</label>
                  <textarea
                    rows={4}
                    required
                    value={selectedRecipe.instructions}
                    onChange={(e) =>
                      setSelectedRecipe({ ...selectedRecipe, instructions: e.target.value })
                    }
                    className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                  >
                    {isUpdating && <FaSpinner className="animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRecipesPage;