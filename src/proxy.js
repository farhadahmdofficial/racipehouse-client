

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

const session =await auth.api.getSession({
        headers:await headers()

    });
    // console.log(session);
    //  if (session?.user.plan == 'free') {
    //     return NextResponse.redirect(new URL('/pricing', request.url))
    // }
    


    if (!session || !session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

  return NextResponse.next();
}

// শুধুমাত্র নির্দিষ্ট এই রাউটগুলোর ক্ষেত্রে proxy.js রান করবে
export const config = {
  matcher: [
    '/dashboard/:path*',
    
  ],
};



