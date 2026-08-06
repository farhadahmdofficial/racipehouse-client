
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { MongoClient } from 'mongodb';

// export const runtime = 'nodejs'; 

// Single DB Client Instance
const client = new MongoClient(process.env.MONGODB_URI);

export async function proxy(request) {
  try {
    // ১. কুকি থেকে সেশন নেওয়া
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // সেশন না থাকলে /login-এ রিডাইরেক্ট
    if (!session || !session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 🎯 ২. সেশন কুকি না মেনে সরাসরি MongoDB থেকে Fresh Data রিড করা
    await client.connect();
    const db = client.db("recipehouse");
    
    const dbUser = await db.collection("user").findOne({
      $or: [
        { id: session.user.id },
        { email: session.user.email }
      ]
    });

    // ডাটাবেজের লেটেস্ট প্ল্যান রিড করা (Fallback হিসেবে session.user.plan)
    const userPlan = dbUser?.plan || session.user.plan || 'free';

    console.log("Proxy:", userPlan);

    // ৩. Free ইউজার হলে /pricing-এ রিডাইরেক্ট
    if (userPlan === 'free') {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }

    // 🎯 ৪. Pro ইউজার হলে ড্যাশবোর্ডে প্রবেশ করতে দেওয়া (মিসিং ছিল)
    return NextResponse.next();

  } catch (error) {
    console.error("Proxy Middleware Error:", error?.message || error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard', // /dashboard এবং এর অধীনস্থ সব সাব-রাউটে প্রক্সি কাজ করবে
  ],
};






// import { NextResponse } from 'next/server';
// import { auth } from './lib/auth';

// export const runtime = 'nodejs'; // MongoClient & Crypto Compatibility

// export async function proxy(request) {
//   try {
//     // 🎯 মূল ফিক্স: request.headers থেকে কুকি বা অথ হেডার পাস করা
//     const session = await auth.api.getSession({
//       headers: request.headers
//     });

//     // সেশন না থাকলে রিডাইরেক্ট
//     if (!session || !session?.user) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     console.log("user proxy ",session);

//     const userPlan = session.user.plan;

//     // Free ইউজার হলে /pricing-এ রিডাইরেক্ট
//     if (userPlan === 'free') {
//       return NextResponse.redirect(new URL('/pricing', request.url));
//     }

    

//   } catch (error) {
//     console.error("Proxy Middleware Error:", error?.message || error);
    
//     // 🎯 Invalid Base64 / Malformed Cookie থাকলে তা ক্যাচ করে লুপ বন্ধ করা
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     '/dashboard',
//   ],
// };












// import { headers } from 'next/headers';
// import { NextResponse } from 'next/server'
// import { auth } from './lib/auth'

// export async function proxy(request) {
//     //   const token = request.cookies.get('token');

//     // যদি ইউজার লগইন না থাকে, তবে লগইন পেজে পাঠাবে
//     //   if (!token) {
//     //     return NextResponse.redirect(new URL('/login', request.url));
//     //   }

//     const session = await auth.api.getSession({
//         headers: await headers()

//     });

//     console.log(session);




//     if (!session || !session?.user) {
//         return NextResponse.redirect(new URL('/login', request.url))
//     }

//     // const userPlan = session.user.plan;
//     // // const isPro = session.user.plan;

//     // console.log(userPlan);

//     // // ২. যদি ইউজার Free Plan বা Non-Premium হয়, তবে তাকে /pricing পেজে রিডাইরেক্ট করবে
//     // if (userPlan === 'free') {
//     //     return NextResponse.redirect(new URL('/pricing', request.url));
//     // }
   



//     return NextResponse.next();
// }

// // শুধুমাত্র নির্দিষ্ট এই রাউটগুলোর ক্ষেত্রে proxy.js রান করবে
// export const config = {
//     matcher: [
//         '/dashboard/:path*',

//     ],
// };



