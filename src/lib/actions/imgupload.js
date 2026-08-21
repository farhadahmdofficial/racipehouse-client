







"use server";

export async function imageupload(formData) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("ImgBB API key is missing in .env file");
      return { url: null };
    }

    const file = formData.get("image");
    if (!file) return { url: null };

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: body,
    });

    const text = await res.text();

    // রেসপন্স ফাঁকা হলে হ্যান্ডেল করবে
    if (!text) {
      throw new Error("Empty response received from ImgBB");
    }

    const data = JSON.parse(text);

    if (data?.data?.url) {
      return { url: data.data.url };
    }

    return { url: null };
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
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
