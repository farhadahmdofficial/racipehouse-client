<form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <FaImage className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
      Password
    </label>
    <div className="relative">
      <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
      
      <input
        type={showPassword ? 'text' : 'password'} // স্টেট অনুযায়ী type পরিবর্তন হবে
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="••••••••"
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* Show / Hide Toggle Icon */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    <p className="text-[11px] text-gray-500 mt-1">
      Must contain 6+ chars, 1 uppercase & 1 lowercase letter.
    </p>
  </div>



          {/* <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Must contain 6+ chars, 1 uppercase & 1 lowercase letter.
            </p>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

























        ok 


         <form onSubmit={handleRecipeSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase text-orange-500">
              Recipe Name
            </label>
            <input
              type="text"
              name="name" // 👈 name যোগ করা হয়েছে
              required
              placeholder=" Creamy Pasta Carbonara"
              value={recipeForm.name}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, name: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-orange-500">
              Category
            </label>
            <select
              name="category" // 👈 name যোগ করা হয়েছে
              value={recipeForm.category}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, category: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-orange-500">
              Cuisine Type
            </label>
            <input
              type="text"
              name="cuisine" // 👈 name যোগ করা হয়েছে
              required
              placeholder="Italian, Bengali, Mexican"
              value={recipeForm.cuisine}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, cuisine: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold  uppercase text-orange-500">
              Difficulty Level
            </label>
            <select
              name="difficulty" // 👈 name যোগ করা হয়েছে
              value={recipeForm.difficulty}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, difficulty: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold  uppercase text-orange-500">
              Preparation Time
            </label>
            <input
              type="number"
              name="prepTime" // 👈 name যোগ করা হয়েছে
              required
              placeholder="30"
              value={recipeForm.prepTime}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, prepTime: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold  uppercase text-orange-500">
              Recipe Image
            </label>
            <div className="relative mt-1">
              <input
                type="file"
                name="image" // 👈 name যোগ করা হয়েছে
                accept="image/*"
                // onChange={handleImageUpload}
                disabled={uploading}
                className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs hover:file:bg-orange-600 cursor-pointer"
              />
              {uploading && (
                <FaSpinner className="animate-spin absolute right-3 top-3.5 text-orange-500" />
              )}
            </div>
          </div>
        </div>
        {/* price */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold  uppercase text-orange-500">
              Price
            </label>
            <input
              type="number"
              name="price" // 👈 name যোগ করা হয়েছে
              required
              placeholder="..$"
              value={recipeForm.price}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, price: e.target.value })
              }
              className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold  uppercase text-orange-500">
              Recipe Image
            </label>
            <div className="relative mt-1">
              <input
                type="file"
                name="image" // 👈 name যোগ করা হয়েছে
                accept="image/*"
                // onChange={handleImageUpload}
                disabled={uploading}
                className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs hover:file:bg-orange-600 cursor-pointer"
              />
              {uploading && (
                <FaSpinner className="animate-spin absolute right-3 top-3.5 text-orange-500" />
              )}
            </div>
          </div>
        </div> */}

        <div>
          <label className="text-xs font-semibold  uppercase text-orange-500">
            Ingredients
          </label>
          <textarea
            rows={3}
            name="ingredients" // 👈 name যোগ করা হয়েছে
            required
            placeholder="Pasta, Eggs, Parmesan Cheese, Pancetta, Black Pepper"
            value={recipeForm.ingredients}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, ingredients: e.target.value })
            }
            className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>



        <div>
          <label className="text-xs font-semibold  uppercase text-orange-500">
            Cooking Instructions
          </label>
          <textarea
            rows={4}
            name="instructions" // 👈 name যোগ করা হয়েছে
            required
            placeholder={"Step 1: Boil water...\nStep 2: Fry bacon..."}
            value={recipeForm.instructions}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, instructions: e.target.value })
            }
            className="w-full mt-1 bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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