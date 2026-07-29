
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});



// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000" // ব্যাকএন্ড বা Next.js URL
// });

// import { createAuthClient } from "better-auth/react"
// import { jwtClient } from "better-auth/client/plugins"
// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: process.env.BETTER_AUTH_URL,

//     // baseURL: "http://localhost:3000",

//      plugins: [
//     jwtClient() 
//   ]
// })

// export const { signIn, signUp, signOut, useSession } = createAuthClient()