"use client";

import { useState } from "react";
import { FaPlusCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const AddRecipe = () => {
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    category: "Breakfast",
    cuisine: "",
    difficulty: "Easy",
    prepTime: "",
    image: "",
    ingredients: "",
    instructions: "",
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ImgBB Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );

      if (res.data?.data?.url) {
        setRecipeForm((prev) => ({ ...prev, image: res.data.data.url }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please check your ImgBB API Key.");
    } finally {
      setUploading(false);
    }
  };

  // Form Submission Handler
  const handleRecipeSubmit = async (e) => {
    e.preventDefault();

    if (!recipeForm.image) {
      alert("Please upload a recipe image before submitting!");
      return;
    }

    setSubmitting(true);

    try {
      // Ingredients এবং Instructions-কে Array-তে রূপান্তর
      const payload = {
        ...recipeForm,
        prepTime: Number(recipeForm.prepTime),
        ingredients: recipeForm.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        instructions: recipeForm.instructions
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const res = await axios.post("/api/recipes", payload);

      if (res.status === 201) {
        alert("Recipe published successfully!");
        // Reset form
        setRecipeForm({
          name: "",
          category: "Breakfast",
          cuisine: "",
          difficulty: "Easy",
          prepTime: "",
          image: "",
          ingredients: "",
          instructions: "",
        });
      }
    } catch (error) {
      console.error("Failed to submit recipe:", error);
      alert(error.response?.data?.message || "Failed to publish recipe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaPlusCircle className="text-orange-500" /> Create New Recipe
      </h2>

      <form onSubmit={handleRecipeSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-gray-400">
              Recipe Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Creamy Pasta Carbonara"
              value={recipeForm.name}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, name: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-400">
              Category
            </label>
            <select
              value={recipeForm.category}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, category: e.target.value })
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
            <label className="text-xs font-mono uppercase text-gray-400">
              Cuisine Type
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Italian, Bengali, Mexican"
              value={recipeForm.cuisine}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, cuisine: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-400">
              Difficulty Level
            </label>
            <select
              value={recipeForm.difficulty}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, difficulty: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-gray-400">
              Preparation Time (mins)
            </label>
            <input
              type="number"
              required
              placeholder="30"
              value={recipeForm.prepTime}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, prepTime: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-gray-400">
              Recipe Image (ImgBB)
            </label>
            <div className="relative mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs hover:file:bg-orange-600 cursor-pointer"
              />
              {uploading && (
                <FaSpinner className="animate-spin absolute right-3 top-3.5 text-orange-500" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-gray-400">
            Ingredients (comma separated)
          </label>
          <textarea
            rows={3}
            required
            placeholder="Pasta, Eggs, Parmesan Cheese, Pancetta, Black Pepper"
            value={recipeForm.ingredients}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, ingredients: e.target.value })
            }
            className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-gray-400">
            Cooking Instructions (one per line)
          </label>
          <textarea
            rows={4}
            required
            placeholder={"Step 1: Boil water...\nStep 2: Fry bacon..."}
            value={recipeForm.instructions}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, instructions: e.target.value })
            }
            className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || submitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin" /> Publishing...
            </>
          ) : (
            "Publish Recipe"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AddRecipe;