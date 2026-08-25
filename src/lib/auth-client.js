

// import { jwtClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   // 💡 প্রডাকশনে ক্লায়েন্টের নিজের ডোমেইনই হবে Base URL
//   baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  
//   fetchOptions: {
//     credentials: "include",
//   },
  
//   plugins: [jwtClient()],
// });











import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 💡 প্রডাকশন ব্যাকএন্ড URL Fallback ফিক্স
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "https://racipehouse-sever.vercel.app",
  
  // 🎯 Cross-Domain Cookie আদান-প্রদানের জন্য এটি বাধ্যতামূলক
  fetchOptions: {
    credentials: "include",
  },
  
  plugins: [jwtClient()],
});









// import { createAuthClient } from "better-auth/react";
// import { jwtClient } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
//   plugins: [jwtClient()],
// });







// import { jwtClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";

// // fallback URL সহ নিরাপদ baseURL সেটআপ
// const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// export const authClient = createAuthClient({
//   baseURL: serverUrl,
//   plugins: [jwtClient()]
// });





// ok cdoe 

// import { jwtClient } from "better-auth/client/plugins";
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   // 💡 অবশ্যই এক্সপ্রেস সার্ভারের পোর্ট (5000) দিতে হবে!
//   baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
//   plugins :[jwtClient()]

// });





// ok code
// import { createAuthClient } from "better-auth/react";
// import { inferAdditionalFields } from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//   // 💡 অবশ্যই এক্সপ্রেস সার্ভারের পোর্ট (5000) দিতে হবে!
//   baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
  
//   // 🎯 আসল ফিক্স: ফ্রন্টএন্ড SDK-কে কাস্টম ফিল্ডগুলোর কথা জানিয়ে দেওয়া
//   plugins: [
//     inferAdditionalFields({
//       user: {
//         role: {
//           type: "string",
//         },
//         plan: {
//           type: "string",
//         },
//       },
//     }),
//   ],
// });



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