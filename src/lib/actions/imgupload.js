







// @/lib/actions/imgupload.js
"use server";

export async function imageupload(formData) {
  try {
    const apiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    // ১. API Key চেক
    if (!apiKey) {
      console.error("DEBUG ERROR: ImgBB API Key is undefined in Server Action!");
      return { url: null };
    }

    const file = formData.get("image");
    if (!file || file.size === 0) {
      console.error("DEBUG ERROR: No image file received!");
      return { url: null };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const bodyParams = new URLSearchParams();
    bodyParams.append("image", base64Image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    const data = await res.json();

    // ২. ImgBB Response চেক
    if (!data.success) {
      console.error("DEBUG ERROR ImgBB Response:", data);
      return { url: null };
    }

    return { url: data.data.url };
  } catch (error) {
    console.error("DEBUG ERROR Exception:", error);
    return { url: null };
  }
}









// ok code 


// export const imageupload = async (image) => {
//     const formData = new FormData();
//     formData.append("image", image);

//     const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
//     const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//         method: "POST",
//         body: formData
   

//     })

//     const data= await res.json()


    

//     return data.data
// }
