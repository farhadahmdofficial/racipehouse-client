
"use server";


const SIRVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;








export const addrecipe = async (data) => {

    const res = await fetch(`${SIRVER_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  }
