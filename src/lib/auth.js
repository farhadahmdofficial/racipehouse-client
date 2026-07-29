

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoClient Instance
const client = new MongoClient(process.env.MONGODB_URI);

// Database Object
const db = client.db("recipehouse");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
        input: true, // 💡 client থেকে image ফিল্ড রিসিভ করার জন্য অনুমতি দেওয়া হলো
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});











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