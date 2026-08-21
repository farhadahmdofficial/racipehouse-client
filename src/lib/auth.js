

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

// MongoClient Instance
const client = new MongoClient(process.env.MONGODB_URI);

// Database Object (RecipeHouse Database)
const db = client.db("recipehouse");

export const auth = betterAuth({
  // 🎯 appName ফিক্স করায় কুকির নাম এখন racipehouse ডোমেইনের সাথে মিলবে
  appName: "racipehouse",

  database: mongodbAdapter(db, {
    client: client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // 🎯 Cross-Domain Origins Allowed List
  trustedOrigins: [
    "https://racipehouse-client-theta.vercel.app",
    "http://localhost:3000",
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: true,
      },
      image: {
        type: "string",
        required: false,
        input: true,
      },
      isPremium: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      totalRecipes: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      totalFavorites: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      totalLikesReceived: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  // 🎯 Cross-Origin Secure Cookie Configuration
  advanced: {
  useSecureCookies: true,
  defaultCookieAttributes: {
    sameSite: "lax", // 💡 'none' এর বদলে 'lax' দিন
    secure: true,
  },
},
  // advanced: {
  //   useSecureCookies: true,
  //   defaultCookieAttributes: {
  //     sameSite: "none",
  //     secure: true,
  //   },
  // },

  plugins: [jwt()],

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "https://racipehouse-sever.vercel.app",
});











// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { jwt } from "better-auth/plugins";

// // MongoClient Instance
// const client = new MongoClient(process.env.MONGODB_URI);

// // Database Object (RecipeHouse Database)
// const db = client.db("recipehouse");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client: client,
//   }),

//   emailAndPassword: {
//     enabled: true,
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//   },

//   user: {
//   additionalFields: {
//    role: {
//       type: "string",        // 💡 টাইপ অবশ্যই বলে দিতে হবে
//       required: false,
//       defaultValue: "user",
//       input: true,           // 💡 ক্লায়েন্ট থেকে ডাটা অ্যাকসেপ্ট করার জন্য true
//     },
//     plan: {
//       type: "string",        // 💡 টাইপ অবশ্যই বলে দিতে হবে
//       required: false,
//       defaultValue: "free",
//       input: true,
//     },
//     image: {
//       type: "string",
//       required: false,
//       input: true,
//     },
//     isPremium: {
//       type: "boolean",
//       required: false,
//       defaultValue: false,
//       input: true,           // 💡 প্রয়োজন অনুযায়ী true বা false রাখতে পারেন
//     },
//     totalRecipes: {
//       type: "number",
//       required: false,
//       defaultValue: 0,
//       input: false,          // এটি ব্যাকএন্ড থেকে হ্যান্ডেল করা নিরাপদ
//     },
//     totalFavorites: {
//       type: "number",
//       required: false,
//       defaultValue: 0,
//       input: false,
//     },
//     totalLikesReceived: {
//       type: "number",
//       required: false,
//       defaultValue: 0,
//       input: false,
//     },
//   },
// },

//   // 💡 কাস্টম ইউজার ফিল্ডস (ড্যাশবোর্ড ও প্রোফাইলের জন্য)
//   // user: {
//   //   additionalFields: {
//   //     role:{
//   //       defaultValue:"user"
//   //     },
//   //     plan:{
//   //       defaultValue:"free"
//   //     },
//   //     image: {
//   //       type: "string",
//   //       required: false,
//   //       input: true,
//   //     },
//   //     isPremium: {
//   //       type: "boolean",
//   //       required: false,
//   //       defaultValue: false,
//   //     },
//   //     totalRecipes: {
//   //       type: "number",
//   //       required: false,
//   //       defaultValue: 0,
//   //     },
//   //     totalFavorites: {
//   //       type: "number",
//   //       required: false,
//   //       defaultValue: 0,
//   //     },
//   //     totalLikesReceived: {
//   //       type: "number",
//   //       required: false,
//   //       defaultValue: 0,
//   //     },
//   //   },
//   // },

//   // 💡 Session & JWT Cookie Cache Configuration
 
//   session: {
//     cookieCache: {
//       enabled: true,
//       strategy: "jwt",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     },
//   },

//   // 💡 JWT Plugin Integration
//   plugins: [jwt()],

//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
// });






// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";

// // MongoClient Instance
// const client = new MongoClient(process.env.MONGODB_URI);

// // Database Object
// const db = client.db("recipehouse");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client: client,
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//    socialProviders: {
//         google: { 
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET 
//         }
//     },
//   user: {
//     additionalFields: {
//       image: {
//         type: "string",
//         required: false,
//         input: true, // 💡 client থেকে image ফিল্ড রিসিভ করার জন্য অনুমতি দেওয়া হলো
//       },
//     },
//   },
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
// });











// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";

// // MongoClient instance তৈরি
// const client = new MongoClient(process.env.MONGODB_URI);

// // Database সংযোগ
// const db = client.db("recipehouse");

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client: client,
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   // 💡 অতিরিক্ত ইউজার ফিল্ড যেমন image বা custom data allow করার জন্য:
//   user: {
//     additionalFields: {
//       image: {
//         type: "string",
//         required: false,
//       },
//     },
//   },
//   // 💡 Secret এবং URL নিশ্চিত করুন
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
// });








// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// // const client = new MongoClient("mongodb://localhost:27017/database");
// const client = new MongoClient(process.env.MONGODB_URI);

// const db = client.db("recipehouse"); // Replace with your database name

// export const auth = betterAuth({


//   database: mongodbAdapter(db, {
//         client: client
//     }),

//      emailAndPassword: {    
//         enabled: true
//     },




    
//     // socialProviders: {
//     //     google: { 
//     //         clientId: process.env.GOOGLE_CLIENT_ID,
//     //         clientSecret: process.env.GOOGLE_CLIENT_SECRET  
//     //     }
//     // },
    


//     // session



//     // session: {

//     //     cookieCache: {
//     //         enabled: true,
//     //         strategy :"jwt",
//     //         maxAge: 60 * 60 * 24 * 7, // 7 days
//     //     }
//     // },





//     // plag

//     //  plugins: [
//     //     jwt()
//     // ]



  
// });