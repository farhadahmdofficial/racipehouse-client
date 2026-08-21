"use client";

import { useState } from "react";
import { FaPlusCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { addrecipe } from "@/lib/actions/recipes";
import { imageupload } from "@/lib/actions/imgupload";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const AddRecipe = () => {
  const router = useRouter();
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


   const { data: session} = authClient.useSession();
   const user = session?.user;

  // ImgBB Image Upload Handler
  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  //     const res = await axios.post(
  //       `https://api.imgbb.com/1/upload?key=${apiKey}`,
  //       formData
  //     );

  //     if (res.data?.data?.url) {
  //       setRecipeForm((prev) => ({ ...prev, image: res.data.data.url }));
  //     }
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     alert("Failed to upload image. Please check your ImgBB API Key.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // Form Submission Handler 








  
// const handleRecipeSubmit = async (e) => {
//   e.preventDefault();

//   if (!user?.id) {
//     toast.error("Please login first!");
//     return;
//   }

//   setSubmitting(true);

//   try {
//     const formData = new FormData(e.target);
//     const imageFile = formData.get("image");

//     // ১. ফাইল সিলেক্ট করা হয়েছে কিনা চেক
//     if (!imageFile || imageFile.size === 0) {
//       toast.error("Please select an image!");
//       setSubmitting(false);
//       return;
//     }

//     // ২. ইমেজের জন্য আলাদা FormData বানিয়ে পাঠানো
//     const imgFormData = new FormData();
//     imgFormData.append("image", imageFile);

//     const imageRes = await imageupload(imgFormData);

//     // ৩. Safe check: imageRes বা url না থাকলে এরর থ্রো করবে
//     if (!imageRes?.url) {
//       throw new Error("Image upload failed. Check API Key or Internet.");
//     }

//     const data = Object.fromEntries(formData.entries());

//     // ৪. রেসিপি সেভ করার অ্যাকশন
//     const result = await addrecipe({
//       ...data,
//       image: imageRes.url,
//       userId: user.id,
//     });

//     toast.success("Recipe added successfully!");
//     router.refresh();
//     router.push("/dashboard/users/myrecipes");
//   } catch (error) {
//     console.error("Submission error:", error);
//     toast.error(error.message || "Failed to add recipe.");
//   } finally {
//     setSubmitting(false);
//   }
// };

// ok code 

  const handleRecipeSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true); // 👈 ১. বাটন লোডিং শুরু হবে

  try {
    const fromData = new FormData(e.target);
    const data = Object.fromEntries(fromData.entries());

    const image = await imageupload(data.image);

    const resullt = await addrecipe({ ...data, image: image.url, userId: user.id });

    console.log(resullt, 'recipe result');

    toast.success("Recipe added successfully!"); // 👈 ২. আপলোড শেষে নোটিফিকেশন দেবে
    router.refresh(); 
      router.push("/dashboard/users/myrecipes");
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setSubmitting(false); // 👈 ৩. বাটন আবার আগের অবস্থায় ফিরবে
  }
}




// ok handel
//   const handleRecipeSubmit = async (e) => {
//   e.preventDefault();
//   setSubmitting(true); // 👈 ১. বাটন লোডিং শুরু হবে

//   try {
//     const fromData = new FormData(e.target);
//     const data = Object.fromEntries(fromData.entries());

//     const image = await imageupload(data.image);

//     const resullt = await addrecipe({ ...data, image: image.url, userId: user.id });

//     console.log(resullt, 'recipe result');

//     toast.success("Recipe added successfully!"); // 👈 ২. আপলোড শেষে নোটিফিকেশন দেবে
//   } catch (error) {
//     console.error("Submission error:", error);
//   } finally {
//     setSubmitting(false); // 👈 ৩. বাটন আবার আগের অবস্থায় ফিরবে
//   }
// }



  // const handleRecipeSubmit = async (e) => {
  //   e.preventDefault();
  //   const fromData = new FormData(e.target);
  //   const data = Object.fromEntries(fromData.entries());

  //   // console.log(data, 'recipe data');


  //   const image = await imageupload(data.image);
  //   // console.log(image,"image bb");





  //   const resullt = await addrecipe({ ...data, image: image.url,userId:user.id });

  //   console.log(resullt, 'recipe result');



  // }



  // const handleRecipeSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!recipeForm.image) {
  //     alert("Please upload a recipe image before submitting!");
  //     return;
  //   }

  //   setSubmitting(true);

  //   try {
  //     // Ingredients এবং Instructions-কে Array-তে রূপান্তর
  //     const payload = {
  //       ...recipeForm,
  //       prepTime: Number(recipeForm.prepTime),
  //       ingredients: recipeForm.ingredients
  //         .split(",")
  //         .map((item) => item.trim())
  //         .filter(Boolean),
  //       instructions: recipeForm.instructions
  //         .split("\n")
  //         .map((item) => item.trim())
  //         .filter(Boolean),
  //     };

  //     const res = await axios.post("/api/recipes", payload);

  //     if (res.status === 201) {
  //       alert("Recipe published successfully!");
  //       // Reset form
  //       setRecipeForm({
  //         name: "",
  //         category: "Breakfast",
  //         cuisine: "",
  //         difficulty: "Easy",
  //         prepTime: "",
  //         image: "",
  //         ingredients: "",
  //         instructions: "",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to submit recipe:", error);
  //     alert(error.response?.data?.message || "Failed to publish recipe.");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaPlusCircle className="text-orange-500" /> Create New Recipe
      </h2>

      <Toaster position="top-center" reverseOrder={false} />

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


          {/* price  */}

          <div>
            <label className="text-xs font-semibold uppercase text-orange-500">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              placeholder="12.99"
              value={recipeForm.price || ""}
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

      {/* <form onSubmit={handleRecipeSubmit} className="space-y-4">
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
              className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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
              className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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
              className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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
              className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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
              Preparation Time 
            </label>
            <input
              type="number"
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
            <label className="text-xs font-mono uppercase text-gray-400">
              Recipe Image 
            </label>
            <div className="relative mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-xs hover:file:bg-orange-600 cursor-pointer"
              />
              {uploading && (
                <FaSpinner className="animate-spin absolute right-3 top-3.5 text-orange-500" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-gray-400">
            Ingredients 
          </label>
          <textarea
            rows={3}
            required
            placeholder="Pasta, Eggs, Parmesan Cheese, Pancetta, Black Pepper"
            value={recipeForm.ingredients}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, ingredients: e.target.value })
            }
            className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-gray-400">
            Cooking Instructions 
          </label>
          <textarea
            rows={4}
            required
            placeholder={"Step 1: Boil water...\nStep 2: Fry bacon..."}
            value={recipeForm.instructions}
            onChange={(e) =>
              setRecipeForm({ ...recipeForm, instructions: e.target.value })
            }
            className="w-full mt-1 bg-gray-50  border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-500"
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
      </form> */}
    </motion.div>
  );
};

export default AddRecipe;