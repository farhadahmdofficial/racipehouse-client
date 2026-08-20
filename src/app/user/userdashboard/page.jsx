

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUtensils, 
  FaHeart, 
  FaBookmark, 
  FaCrown, 
  FaHome, 
  FaPlusCircle, 
  FaList, 
  FaShoppingBag,
  FaEdit,
  FaTrash,
  FaEye,
  FaCloudUploadAlt,
  FaSpinner
} from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const UserDashboard = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user 
  const role = user?.role || 'user'; // ডিফল্টভাবে 'user' ধরে নেওয়া হবে যদি role না থাকে
  // console.log(role);

  // 📌 1. Active Tab State Management
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'add' | 'my-recipes' | 'purchased'
  const [uploading, setUploading] = useState(false);

  // 📌 2. Form States for Add Recipe
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    image: '',
    category: 'Breakfast',
    cuisine: 'Bengali',
    difficulty: 'Easy',
    prepTime: '',
    ingredients: '',
    instructions: '',
  });

  // 💡 ImgBB Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    // ⚠️ REPLACE WITH YOUR IMGBB API KEY
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'; 

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setRecipeForm((prev) => ({ ...prev, image: data.data.url }));
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRecipeSubmit = (e) => {
    e.preventDefault();
    // 💡 Add your MongoDB / Database POST API logic here
    console.log('Submitting Recipe to "recipes" Collection:', recipeForm);
  };

  // ⏳ Loading State
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // 🔒 Protected Route Warning
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You must be logged in to view your dashboard.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest shadow-md"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest"
            >
              <FaHome size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPremium = user?.isPremium || false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-600 font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{user?.name || 'Chef Member'}</h1>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <FaCrown size={10} /> Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-mono font-medium transition"
          >
            <FaHome size={12} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Layout Grid: Sidebar Navigation + Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* 📍 SIDEBAR NAVIGATION */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 h-fit">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 px-3 py-2">Menu</p>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FaUtensils /> Overview
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'add'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FaPlusCircle /> Add Recipe
            </button>

            <button
              onClick={() => setActiveTab('my-recipes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'my-recipes'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FaList /> My Recipes
            </button>

            <button
              onClick={() => setActiveTab('purchased')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === 'purchased'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FaShoppingBag /> Purchased Recipes
            </button>
          </div>

          {/* 📍 TAB CONTENTS */}
          <div className="lg:col-span-3 space-y-6">

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/60 rounded-xl flex items-center justify-center text-orange-600 text-xl">
                      <FaUtensils />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-400">Total Recipes</p>
                      <h3 className="text-2xl font-black mt-0.5">{user?.totalRecipes || 0}</h3>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-600 text-xl">
                      <FaBookmark />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-400">Total Favorites</p>
                      <h3 className="text-2xl font-black mt-0.5">{user?.totalFavorites || 0}</h3>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 rounded-xl flex items-center justify-center text-red-600 text-xl">
                      <FaHeart />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-400">Likes Received</p>
                      <h3 className="text-2xl font-black mt-0.5">{user?.totalLikesReceived || 0}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ADD RECIPE */}
            {activeTab === 'add' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaPlusCircle className="text-orange-500" /> Create New Recipe
                </h2>

                <form onSubmit={handleRecipeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-gray-400">Recipe Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Creamy Pasta Carbonara"
                        value={recipeForm.name}
                        onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                        className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-gray-400">Category</label>
                      <select
                        value={recipeForm.category}
                        onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })}
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
                      <label className="text-xs font-mono uppercase text-gray-400">Cuisine Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Italian, Bengali, Mexican"
                        value={recipeForm.cuisine}
                        onChange={(e) => setRecipeForm({ ...recipeForm, cuisine: e.target.value })}
                        className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-gray-400">Difficulty Level</label>
                      <select
                        value={recipeForm.difficulty}
                        onChange={(e) => setRecipeForm({ ...recipeForm, difficulty: e.target.value })}
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
                      <label className="text-xs font-mono uppercase text-gray-400">Preparation Time (mins)</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={recipeForm.prepTime}
                        onChange={(e) => setRecipeForm({ ...recipeForm, prepTime: e.target.value })}
                        className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-gray-400">Recipe Image (ImgBB)</label>
                      <div className="relative mt-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs hover:file:bg-orange-600 cursor-pointer"
                        />
                        {uploading && <FaSpinner className="animate-spin absolute right-3 top-3.5 text-orange-500" />}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Ingredients (comma separated)</label>
                    <textarea
                      rows={3}
                      placeholder="Pasta, Eggs, Parmesan Cheese, Pancetta, Black Pepper"
                      value={recipeForm.ingredients}
                      onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                      className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-gray-400">Cooking Instructions</label>
                    <textarea
                      rows={4}
                      placeholder="Step 1: Boil water... Step 2: Fry bacon..."
                      value={recipeForm.instructions}
                      onChange={(e) => setRecipeForm({ ...recipeForm, instructions: e.target.value })}
                      className="w-full mt-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest"
                  >
                    Publish Recipe
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 3: MY RECIPES */}
            {activeTab === 'my-recipes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaList className="text-orange-500" /> My Published Recipes
                </h2>

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
                      {/* Sample Row */}
                      <tr>
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" alt="Recipe" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">Sample Healthy Bowl</span>
                        </td>
                        <td className="p-3">Lunch</td>
                        <td className="p-3">20 mins</td>
                        <td className="p-3 text-right space-x-2">
                          <button className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"><FaEdit size={12} /></button>
                          <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"><FaTrash size={12} /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 4: MY PURCHASED RECIPES */}
            {activeTab === 'purchased' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaShoppingBag className="text-orange-500" /> Purchased Recipes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Purchased Card Example */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 bg-gray-50 dark:bg-gray-950">
                    <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1" alt="Purchased Recipe" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Grilled Gourmet Steak</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Purchased on: Aug 01, 2026</p>
                      </div>
                      <button className="w-fit flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1.5 rounded-lg transition">
                        <FaEye size={12} /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;










// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaUtensils, FaHeart, FaBookmark, FaCrown, FaHome, FaArrowLeft } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import Link from 'next/link';

// const UserDashboard = () => {
//   // Better Auth থেকে কারেন্ট সেশন রিড করা
//   const { data: session, isPending } = authClient.useSession();
//   const user = session?.user;

//   // ১. লোডিং স্টেট
//   if (isPending) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ২. ইউজার লগইন না থাকলে প্রোটেক্টেড মেসেজ
//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
//           <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
//             🔒
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             You must be logged in to view your dashboard.
//           </p>
//           <div className="space-y-3">
//             <Link
//               href="/login"
//               className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest shadow-md"
//             >
//               Go to Login
//             </Link>
//             <Link
//               href="/"
//               className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest"
//             >
//               <FaHome size={14} />
//               <span>Back to Home</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ডাইনামিক ইউজার ডাটা এবং পেমেন্ট/কাস্টম প্রপার্টি
//   const isPremium = user?.isPremium || false; 

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
//         {/* Navigation / Action Bar */}
//         <div className="flex items-center justify-between">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium text-xs font-mono transition-all shadow-sm hover:shadow-md"
//           >
//             <FaArrowLeft size={12} />
//             <span>Back to Home</span>
//           </Link>
//         </div>

//         {/* User Profile Overview */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
//         >
//           <div className="flex items-center gap-5">
//             {/* ডাইনামিক প্রোফাইল ইমেজ অথবা নেম অবতার */}
//             {user?.image ? (
//               <img
//                 src={user.image}
//                 alt={user.name || 'User'}
//                 className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-2xl shadow-md">
//                 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//             )}

//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {user?.name || 'Chef Member'}
//                 </h1>
                
//                 {/* Premium Badge Based on Payment */}
//                 {isPremium && (
//                   <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
//                     <FaCrown className="text-amber-500" />
//                     <span>Premium Member</span>
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 w-full sm:w-auto">
//             {!isPremium && (
//               <button className="flex-1 sm:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm">
//                 <FaCrown />
//                 <span>Upgrade to Premium</span>
//               </button>
//             )}
//           </div>
//         </motion.div>

//         {/* Dashboard Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
//           {/* Total Recipes */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl">
//               <FaUtensils />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Recipes
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalRecipes || 0}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Favorites */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
//               <FaBookmark />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Favorites
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalFavorites || 0}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Likes Received */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
//               <FaHeart />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Likes Received
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalLikesReceived || 0}
//               </h3>
//             </div>
//           </motion.div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;












// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaUtensils, FaHeart, FaBookmark, FaCrown } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import Link from 'next/link';
// // import { usePathname } from 'next/navigation';

// const UserDashboard = () => {
//   // Better Auth থেকে কারেন্ট সেশন রিড করা
//   const { data: session, isPending } = authClient.useSession();
//   const user = session?.user;
//   // const pathname= usePathname();
//   // console.log(pathname,"pathname");

//   // ১. লোডিং স্টেট (ডাটা ফেচ হওয়ার সময় দেখাবে)
//   if (isPending) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-3">
//           <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ২. ইউজার লগইন না থাকলে প্রোটেক্টেড মেসেজ
//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
//           <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
//             🔒
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             You must be logged in to view your dashboard.
//           </p>
//           <Link
//             href="/login"
//             className="inline-block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition text-xs font-mono uppercase tracking-widest"
//           >
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ডাইনামিক ইউজার ডাটা এবং পেমেন্ট/কাস্টম প্রপার্টি
//   const isPremium = user?.isPremium || false; 

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
//         {/* User Profile Overview */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
//         >
//           <div className="flex items-center gap-5">
//             {/* ডাইনামিক প্রোফাইল ইমেজ অথবা নেম অবতার */}
//             {user?.image ? (
//               <img
//                 src={user.image}
//                 alt={user.name || 'User'}
//                 className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-2xl shadow-md">
//                 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//             )}

//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {user?.name || 'Chef Member'}
//                 </h1>
                
//                 {/* Premium Badge Based on Payment */}
//                 {isPremium && (
//                   <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
//                     <FaCrown className="text-amber-500" />
//                     <span>Premium Member</span>
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
//             </div>
//           </div>

//           {!isPremium && (
//             <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm">
//               <FaCrown />
//               <span>Upgrade to Premium</span>
//             </button>
//           )}
//         </motion.div>

//         {/* Dashboard Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
//           {/* Total Recipes */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl">
//               <FaUtensils />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Recipes
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalRecipes || 0}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Favorites */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
//               <FaBookmark />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Favorites
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalFavorites || 0}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Likes Received */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
//               <FaHeart />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Likes Received
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {user?.totalLikesReceived || 0}
//               </h3>
//             </div>
//           </motion.div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;


















// 'use client';

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FaUtensils, FaHeart, FaBookmark, FaCrown, FaCheckCircle } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client'; 

// const UserDashboard = () => {
//   // ডামি ইউজার ডেটা (পরে আপনার API / Auth State থেকে পাবেন)
//  const { data: session, isPending, error } = authClient.useSession();
//  const user = session.user;

//   const [userStats] = useState({
//     name: 'Alex Ri',
//     email: 'alex@recipehouse.com',
//     image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
//     isPremium: true, // Stripe Payment সফল হলে true হবে
//     totalRecipes: 12,
//     totalFavorites: 8,
//     totalLikesReceived: 340,
//   });
//   // const [userStats] = useState({
//   //   name: 'Alex Rivera',
//   //   email: 'alex@recipehouse.com',
//   //   image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
//   //   isPremium: true, // Stripe Payment সফল হলে true হবে
//   //   totalRecipes: 12,
//   //   totalFavorites: 8,
//   //   totalLikesReceived: 340,
//   // });

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
//         {/* User Profile Overview */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
//         >
//           <div className="flex items-center gap-5">
//             <img
//               src={userStats.image}
//               alt={userStats.name}
//               className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
//             />
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {userStats.name}
//                 </h1>
//                 {/* Premium Badge Based on Payment */}
//                 {userStats.isPremium && (
//                   <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
//                     <FaCrown className="text-amber-500" />
//                     <span>Premium Member</span>
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{userStats.email}</p>
//             </div>
//           </div>

//           {!userStats.isPremium && (
//             <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm">
//               <FaCrown />
//               <span>Upgrade to Premium</span>
//             </button>
//           )}
//         </motion.div>

//         {/* Dashboard Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
//           {/* Total Recipes */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/60 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl">
//               <FaUtensils />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Recipes
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalRecipes}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Favorites */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
//               <FaBookmark />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Total Favorites
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalFavorites}
//               </h3>
//             </div>
//           </motion.div>

//           {/* Total Likes Received */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//           >
//             <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
//               <FaHeart />
//             </div>
//             <div>
//               <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
//                 Likes Received
//               </p>
//               <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
//                 {userStats.totalLikesReceived}
//               </h3>
//             </div>
//           </motion.div>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;