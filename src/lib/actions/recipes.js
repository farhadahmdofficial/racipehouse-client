
"use server";

import { getTokenSever } from "./getTokenSever";
import { auth } from '@/lib/auth'; 
import { headers } from 'next/headers';




const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://racipehouse-sever.vercel.app";




export const addrecipe = async (data) => {
  try {
    const Token = await getTokenSever();

    if (!Token) {
      return { success: false, message: "Unauthorized. Token not found." };
    }

    // ১. সেশন থেকে বর্তমান ইউজারের তথ্য নিন
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session || !session.user) {
      return { success: false, message: "User session not found." };
    }

    // ২. data অবজেক্টে ইউজারের ID এবং Email যোগ করুন
    const payload = {
      ...data,
      userId: session.user.id,
      userEmail: session.user.email,
    };

    const res = await fetch(`${SERVER_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(payload), // payload পাঠাচ্ছেন
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server Response Error:", errorText);
      return { 
        success: false, 
        message: `Server Error: ${res.statusText || res.status}` 
      };
    }

    const result = await res.json();

    revalidatePath("/dashboard/users/myrecipes");
    revalidatePath("/recipes");

    return { success: true, data: result };

  } catch (error) {
    console.error("Error in addrecipe action:", error);
    return { 
      success: false, 
      message: error.message || "Something went wrong" 
    };
  }
};


// export const addrecipe = async (data) => {
//   try {
//     const Token = await getTokenSever();

//     if (!Token) {
//       return { success: false, message: "Unauthorized. Token not found." };
//     }

//     const res = await fetch(`${SERVER_URL}/recipes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${Token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     // 1. Response OK না হলে Handle করা
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("Server Response Error:", errorText);
//       return { 
//         success: false, 
//         message: `Server Error: ${res.statusText || res.status}` 
//       };
//     }

//     // 2. Response JSON Parse করা
//     const result = await res.json();

//     // 3. Next.js Cache Revalidate করা (যেন নতুন ডাটা সাথে সাথে UI-তে শো করে)
//     revalidatePath("/dashboard/users/myrecipes");
//     revalidatePath("/recipes"); // যদি পাবলিক রেসিপি পেজ থাকে

//     return { success: true, data: result };

//   } catch (error) {
//     console.error("Error in addrecipe action:", error);
//     return { 
//       success: false, 
//       message: error.message || "Something went wrong" 
//     };
//   }
// };





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



//  get  recipt  apii









// ok code 


export const getRecipes = async (
  page = 1,
  limit = 9, // ডিফল্ট লিমিট ১০ থেকে বাড়িয়ে/কমিয়ে ৯ করা হলো
  search = "",
  category = "",
  cuisine = ""
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && search.trim() !== "" && { search: search.trim() }),
      ...(category && category.trim() !== "" && { category: category.trim() }),
      ...(cuisine && cuisine.trim() !== "" && { cuisine: cuisine.trim() }),
    });

    const apiUrl = `${SERVER_URL}/recipes?${queryParams.toString()}`;

    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[GET_RECIPES_ERROR] Status: ${res.status} | ${errorText}`);
      return { success: false, recipes: [], totalPages: 1, totalCount: 0 };
    }

    const result = await res.json();

    return {
      success: true,
      recipes: result.recipes || [],
      totalPages: result.totalPages || result.pagination?.totalPages || 1,
      totalCount: result.totalCount || result.pagination?.totalCount || result.recipes?.length || 0,
    };
  } catch (error) {
    console.error("Error in getRecipes action:", error);
    return { success: false, recipes: [], totalPages: 1, totalCount: 0 };
  }
};


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






