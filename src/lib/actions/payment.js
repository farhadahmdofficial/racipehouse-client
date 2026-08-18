


"use server";



const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";


export const subscription = async (data) => {
    const res = await fetch(`${serverUrl}/subscription`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json()



}
export const payment = async (data) => {
    const res = await fetch(`${serverUrl}/payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json()
}
