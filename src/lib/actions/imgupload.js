



export const imageupload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
   

    })

    const data= await res.json()


    

    return data.data
}
