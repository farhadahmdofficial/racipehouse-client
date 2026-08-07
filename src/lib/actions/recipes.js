
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





  export const getRecipes = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/recipes`, {
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
