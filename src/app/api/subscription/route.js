

import { NextResponse } from "next/server";
import Stripe from "stripe";

// .env.local ফাইলে STRIPE_SECRET_KEY সঠিকভাবে থাকা আবশ্যক
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { planId } = await req.json();

    // ১. Price ID অথবা Plan অনুযায়ী তথ্য ডায়নামিক করা
    let priceData = {
      currency: "usd",
      product_data: {
        name: "Pro Monthly Subscription",
        description: "Unlimited recipe uploads & Pro features",
      },
      unit_amount: 1500, // $15.00
    };

    if (planId === "pro-yearly") {
      priceData = {
        currency: "usd",
        product_data: {
          name: "Pro Yearly Subscription",
          description: "Unlimited recipe uploads & Pro features (Yearly)",
        },
        unit_amount: 12000, // $120.00
      };
    }

    // ২. Stripe Session তৈরি
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            ...priceData,
            recurring: {
              interval: planId === "pro-yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      // পেমেন্ট সফল বা ক্যান্সেল হলে যেখানে রিডাইরেক্ট হবে
      success_url: `${req.headers.get("origin")}/pricing/success-subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    // ৩. ক্লিয়ার JSON Response রিটার্ন
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}





// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'
// import { stripe } from '@/lib/stripe';



// export async function POST() {
//   try {
//     const headersList = await headers()
//     const origin = headersList.get('origin')
//     const PRICE_ID=price_1TzuygFHijIYwXokg4BDcSz9

//     // Create Checkout Sessions from body params.
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           // Provide the exact Price ID (for example, price_1234) of the product you want to sell
//         //   price: '{{PRICE_ID}}',
//           price: PRICE_ID,
//           quantity: 1,
//         },
//       ],
//       mode: 'subscription',
//       success_url: `${origin}/pricing/success-subscription?session_id={CHECKOUT_SESSION_ID}`,
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

