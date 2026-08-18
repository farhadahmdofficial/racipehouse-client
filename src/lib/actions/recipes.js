
"use server";




const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;



export const addrecipe = async (data) => {

    const res = await fetch(`${SERVER_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  }



//  getrecipt 


export const getRecipes = async (page = 1, limit = 10) => {
  try {
    // URL Query Parameter হিসেবে page এবং limit পাঠানো হচ্ছে
    const res = await fetch(`${SERVER_URL}/recipes?page=${page}&limit=${limit}`, {
      cache: "no-store", // সবসময় নতুন ডাটা পাওয়ার জন্য
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { success: false, recipes: [], totalPages: 0, totalCount: 0 };
  }
};



// ok code 

//   export const getRecipes = async () => {
//   try {
//     const res = await fetch(`${SERVER_URL}/recipes`, {
//       cache: "no-store", // সবসময় সর্বশেষ আপডেটেড ডাটা পাওয়ার জন্য
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch recipes");
//     }

//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     return { success: false, data: [] };
//   }
// };

// my rcipe


  export const myRecipes = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/myrecipes`, {
      cache: "no-store", // সবসময় সর্বশেষ আপডেটেড ডাটা পাওয়ার জন্য
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { success: false, data: [] };
  }
};






