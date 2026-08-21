

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://racipehouse-sever.vercel.app';

export async function proxy(request) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  if (!allCookies || allCookies.length === 0) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const sessionRes = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!sessionRes.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const session = await sessionRes.json();

    if (!session || !session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = session.user?.role;
    const userPlan = session.user?.plan || 'free';

    if (role === 'admin') {
      return NextResponse.next();
    }

    const isAddingRecipe = request.nextUrl.pathname === '/dashboard/add-recipe';

    if (userPlan === 'free' && isAddingRecipe) {
      const countRes = await fetch(`${BACKEND_URL}/recipes/count?userId=${session.user.id}`, {
        headers: {
          cookie: cookieHeader,
        },
        cache: 'no-store',
      });

      if (countRes.ok) {
        const { recipeCount } = await countRes.json();
        if (recipeCount >= 2) {
          return NextResponse.redirect(new URL('/pricing', request.url));
        }
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};







// ok code 

// import { NextResponse } from 'next/server';
// import { auth } from './lib/auth';
// import { MongoClient } from 'mongodb';

// // Single DB Client Instance
// const client = new MongoClient(process.env.MONGODB_URI);

// export async function proxy(request) {
//   try {
//     // ১. কুকি থেকে সেশন নেওয়া
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     // সেশন না থাকলে /login-এ রিডাইরেক্ট
//     if (!session || !session?.user) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // ২. সরাসরি MongoDB থেকে Fresh Data রিড করা
//     await client.connect();
//     const db = client.db("recipehouse");
    
//     const dbUser = await db.collection("user").findOne({
//       $or: [
//         { id: session.user.id },
//         { email: session.user.email }
//       ]
//     });

//     // ডাটাবেজ থেকে Role এবং Plan তুলে আনা
//     const role = dbUser?.role || session.user?.role;
//     const userPlan = dbUser?.plan || session.user?.plan || 'free';

//     // 🎯 ৩. Admin হলে কোনো লিমিট থাকবে না (সরাসরি Access পাবে)
//     if (role === 'admin') {
//       return NextResponse.next();
//     }

//     // 🎯 ৪. Free ইউজারের ক্ষেত্রে রেসিপি লিমিট চেক করা
//     if (userPlan === 'free') {
//       const userId = dbUser?.id || dbUser?._id?.toString() || session.user.id;
//       const userEmail = dbUser?.email || session.user.email;

//       // ইউজার কয়টি রেসিপি তৈরি করেছে তা কাউন্ট করা
//       const recipeCount = await db.collection("recipes").countDocuments({
//         $or: [
//           { userId: userId },
//           { userEmail: userEmail },
//           { "author.email": userEmail }
//         ]
//       });

//       console.log(`Free User ${userEmail} total recipes:`, recipeCount);

//       // ২টির বেশি রেসিপি থাকলেই /pricing পেজে রিডাইরেক্ট
//       if (recipeCount >= 2) {
//         return NextResponse.redirect(new URL('/pricing', request.url));
//       }
//     }

//     // 🎯 ৫. Pro ইউজার অথবা লিমিটের মধ্যে থাকা (<= 2) Free ইউজারের প্রবেশ
//     return NextResponse.next();

//   } catch (error) {
//     console.error("Proxy Middleware Error:", error?.message || error);
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     '/dashboard/add-recipe', // রেসিপি ক্রিয়েট পেজ
//     '/dashboard/:path*', 
//   ],
// };





// ok code 

// import { NextResponse } from 'next/server';
// import { auth } from './lib/auth';
// import { MongoClient } from 'mongodb';

// // Single DB Client Instance
// const client = new MongoClient(process.env.MONGODB_URI);

// export async function proxy(request) {
//   try {
//     // ১. কুকি থেকে সেশন নেওয়া
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     // সেশন না থাকলে /login-এ রিডাইরেক্ট
//     if (!session || !session?.user) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // ২. সরাসরি MongoDB থেকে Fresh Data রিড করা
//     await client.connect();
//     const db = client.db("recipehouse");
    
//     const dbUser = await db.collection("user").findOne({
//       $or: [
//         { id: session.user.id },
//         { email: session.user.email }
//       ]
//     });

//     // ডাটাবেজ থেকে Role এবং Plan তুলে আনা
//     const role = dbUser?.role || session.user?.role;
//     const userPlan = dbUser?.plan || session.user?.plan || 'free';

//     console.log("Proxy User Info -> Role:", role, "| Plan:", userPlan);

//     // 🎯 ৩. Admin হলে সরাসরি ড্যাশবোর্ডে প্রবেশের অনুমতি পাবে (Pricing চেক স্কিপ হবে)
//     if (role === 'admin') {
//       return NextResponse.next();
//     }

//     // 🎯 ৪. Admin না হয়ে শুধুমাত্র Free ইউজার হলে /pricing-এ রিডাইরেক্ট করবে
//     if (userPlan === 'free') {
//       return NextResponse.redirect(new URL('/pricing', request.url));
//     }

//     // 🎯 ৫. Pro বা অন্যান্য পেইড ইউজারদের প্রবেশ করতে দেওয়া
//     return NextResponse.next();

//   } catch (error) {
//     console.error("Proxy Middleware Error:", error?.message || error);
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*', // /dashboard এবং এর অধীনস্থ সব সাব-রাউটে প্রক্সি কাজ করবে
//   ],
// };







// ok code 


// import { NextResponse } from 'next/server';
// import { auth } from './lib/auth';
// import { MongoClient } from 'mongodb';

// // export const runtime = 'nodejs'; 

// // Single DB Client Instance
// const client = new MongoClient(process.env.MONGODB_URI);

// export async function proxy(request) {
//   try {
//     // ১. কুকি থেকে সেশন নেওয়া
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     // সেশন না থাকলে /login-এ রিডাইরেক্ট
//     if (!session || !session?.user) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // 🎯 ২. সেশন কুকি না মেনে সরাসরি MongoDB থেকে Fresh Data রিড করা
//     await client.connect();
//     const db = client.db("recipehouse");
    
//     const dbUser = await db.collection("user").findOne({
//       $or: [
//         { id: session.user.id },
//         { email: session.user.email }
//       ]
//     });

//     // ডাটাবেজের লেটেস্ট প্ল্যান রিড করা (Fallback হিসেবে session.user.plan)
//     const userPlan = dbUser?.plan || session.user.plan || 'free';

//     console.log("Proxy:", userPlan);



//     // ৩. Free ইউজার হলে /pricing-এ রিডাইরেক্ট
//     if (userPlan === 'free') {
//       return NextResponse.redirect(new URL('/pricing', request.url));
//     }

//     // 🎯 ৪. Pro ইউজার হলে ড্যাশবোর্ডে প্রবেশ করতে দেওয়া (মিসিং ছিল)
//     return NextResponse.next();

//   } catch (error) {
//     console.error("Proxy Middleware Error:", error?.message || error);
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     '/dashboard', // /dashboard এবং এর অধীনস্থ সব সাব-রাউটে প্রক্সি কাজ করবে
//   ],
// };






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



