

// src/proxy.js
// import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request) {
    //   const token = request.cookies.get('token');

    // যদি ইউজার লগইন না থাকে, তবে লগইন পেজে পাঠাবে
    //   if (!token) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    //   }

    const session = await auth.api.getSession({
        headers: await headers()

    });

    console.log(session);




    if (!session || !session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // const userPlan = session.user.plan || 'free';
    // const isPro = session.user.plan;

    // // ২. যদি ইউজার Free Plan বা Non-Premium হয়, তবে তাকে /pricing পেজে রিডাইরেক্ট করবে
    // if (userPlan === 'free') {
    //     return NextResponse.redirect(new URL('/pricing', request.url));
    // }
   





    // const userPlan = session.user.plan || 'free';
    // if (userPlan === 'pro' || !session.user.isPremium) {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
    // if (userPlan === 'free' || !session.user.isPremium) {
    //   return NextResponse.redirect(new URL('/pricing', request.url));
    // }





    //   if (session?.user.plan == 'free') {
    //     return NextResponse.redirect(new URL('/pricing', request.url))
    // }

    return NextResponse.next();
}

// শুধুমাত্র নির্দিষ্ট এই রাউটগুলোর ক্ষেত্রে proxy.js রান করবে
export const config = {
    matcher: [
        '/dashboard/:path*',

    ],
};



