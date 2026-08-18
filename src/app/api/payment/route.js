

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

    // ১. ইউজার সেশন চেক
    const userSession = await auth.api.getSession({
      headers: headersList,
    });

    const user = userSession?.user;

    // ২. ফর্ম ডাটা এক্সট্র্যাক্ট করা
    const formData = await request.formData();

    const price = formData.get('price');
    const name = formData.get('name');
    const recipeId = formData.get('recipeId');
    const userId = user?.id || '';

    if (!price || !name || !recipeId) {
      return NextResponse.json(
        { error: 'Missing required recipe details' },
        { status: 400 }
      );
    }

    // ৩. Stripe Checkout Session তৈরি করা
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd", // ❌ used থেকে 'usd' ফিক্স করা হয়েছে
            product_data: {  // ❌ recipe_data থেকে 'product_data' ফিক্স করা হয়েছে
              name: name,
            },
            unit_amount: Math.round(Number(price) * 100), // সেন্টে কনভার্ট করার জন্য Math.round নিরাপদ
          },
          quantity: 1,
        },
      ],
      metadata: {
        recipeId: String(recipeId),
        userId: String(userId),
        name: String(name),
        price: String(price),
      },
      mode: 'payment',
      success_url: `${origin}/pricing/success-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/recipes/${recipeId}`, // পেমেন্ট ক্যানসেল করলে ফিরিয়ে আনার রাউট
    });

    // ৪. Stripe Checkout Page-এ রিডাইরেক্ট করা
    return NextResponse.redirect(session.url, 303);

  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}












// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'
// import { stripe } from '@/lib/stripe';
// import { auth } from '@/lib/auth';



// export async function POST(request) {
//   try {
//     const headersList = await headers()
//     const origin = headersList.get('origin')




//      const userSession = await auth.api.getSession({
//       headers: await headers()
//     });

//     const user =userSession?.user

//    const fromData= await request.formData();

//    const price = fromData.get('price');
//    const name = fromData.get('name');
//    const recipeId = fromData.get('recipeId');
//    const userId=user?.id


    
//     const session = await stripe.checkout.sessions.create({
//         customer_email: user?.email,
//       line_items: [
//         {
//             price_data:{
//                 currency : "used",
//                 recipe_data :{
//                     name:name

//                 },
//                 unit_amount: Number(price)*100

//             },
       
//           quantity: 1,
//         },
//       ],

//       metadata:{
//         recipeId,
//         userId,
//         name,
//         price

//       },
//       mode: 'payment',
//       success_url: `${origin}/pricing/success-payment?session_id={CHECKOUT_SESSION_ID}`,
//       // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
//       integration_identifier: '{{INTEGRATION_ID}}',
//     });
//     return NextResponse.redirect(session.url, 303)
//   } catch (err) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: err.statusCode || 500 }
//     )
//   }
// }
