


"use server";

export async function imageupload(formData) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("ImgBB API Key is missing!");
      return null;
    }

    const file = formData.get("image");
    if (!file || typeof file === "string" || file.size === 0) {
      return null;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
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

    if (data?.success && data?.data) {
      return data.data; // এখানে data.url থাকবে
    }

    return null;
  } catch (error) {
    console.error("ImgBB Exception:", error);
    return null;
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
