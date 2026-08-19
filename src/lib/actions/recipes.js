
"use server";

import { getTokenSever } from "./getTokenSever";




const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://racipehouse-sever.vercel.app";


export const addrecipe = async (data) => {
  try {
    const Token = await getTokenSever();

    const res = await fetch(`${SERVER_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(data),
    });

    // ১. সার্ভার Response OK (200-299) না হলে
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server Response Error:", errorText);
      return { success: false, message: `Server error: ${res.status}` };
    }

    // ২. Response OK হলে JSON পার্স করা
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error in addrecipe action:", error);
    return { success: false, message: "Something went wrong" };
  }
};





// export const addrecipe = async (data) => {

//   const Token =await getTokenSever();

//     const res = await fetch(`${SERVER_URL}/recipes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${Token}`
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await res.json();
//     return result;
    
//   }

  // ok code 
// export const addrecipe = async (data) => {



//     const res = await fetch(`${SERVER_URL}/recipes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
       
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await res.json();
//     return result;
//   }



//  getrecipt 





// export const getRecipes = async (
//   page = 1,
//   limit = 10,
//   search = "",
//   category = "",
//   cuisine = ""
// ) => {
//   try {
//     // Query parameters dynamically build করার জন্য URLSearchParams ব্যবহার করা হয়েছে
//     const queryParams = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...(search && { search }),
//       ...(category && { category }),
//       ...(cuisine && { cuisine }),
//     });

//     const res = await fetch(`${SERVER_URL}/recipes?${queryParams.toString()}`, {
//       cache: "no-store", // সবসময় নতুন ডাটা পাওয়ার জন্য
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch recipes");
//     }

//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     return { success: false, recipes: [], totalPages: 0, totalCount: 0 };
//   }
// };

// ok code 
// export const getRecipes = async (page = 1, limit = 10) => {
//   try {
//     // URL Query Parameter হিসেবে page এবং limit পাঠানো হচ্ছে
//     const res = await fetch(`${SERVER_URL}/recipes?page=${page}&limit=${limit}`, {
//       cache: "no-store", // সবসময় নতুন ডাটা পাওয়ার জন্য
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch recipes");
//     }

//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     return { success: false, recipes: [], totalPages: 0, totalCount: 0 };
//   }
// };




export const getRecipes = async (page = 1, limit = 10, search = "") => {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // শুধুমাত্র যদি সার্চ টার্ম ফিল্ডে কিছু লেখা থাকে, তবেই URLEncode করে প্যারামিটারে যুক্ত করা হবে
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    // ব্যাকএন্ড URL নিশ্চিত করা
    const apiUrl = `${SERVER_URL}/recipes?${params.toString()}`;

    const res = await fetch(apiUrl, {
      cache: "no-store", // সবসময় নতুন ডাটা পাওয়ার জন্য
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch recipes: Status ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // খালি রেসপন্স যাতে অ্যাপ ক্র্যাশ না করে
    return { success: false, recipes: [], totalPages: 1 };
  }
};






// ok code 



// export const getRecipes = async (page = 1, limit = 10, search = "") => {
//   try {
//     const params = new URLSearchParams();

//     params.append("page", page.toString());
//     params.append("limit", limit.toString());

//     // শুধুমাত্র যদি সার্চ টার্ম ফিল্ডে কিছু লেখা থাকে, তবেই URLEncode করে প্যারামিটারে যুক্ত করা হবে
//     if (search && search.trim() !== "") {
//       params.append("search", search.trim());
//     }

//     const res = await fetch(`${SERVER_URL}/recipes?${params.toString()}`, {
//       cache: "no-store", // সবসময় সর্বশেষ আপডেটেড ডাটা পাওয়ার জন্য
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch recipes");
//     }

//     const result = await res.json();
//     return result;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     return { success: false, recipes: [], totalPages: 1 };
//   }
// };




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






