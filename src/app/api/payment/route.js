


import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';



export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')




     const userSession = await auth.api.getSession({
      headers: await headers()
    });

   const fromData= await request.formData();

   const price = fromData.get('price');
   const title = fromData.get('title');
   const recipeId = fromData.get('recipeId');








    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        //   price: '{{PRICE_ID}}',
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/pricing/success-subscription?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: '{{INTEGRATION_ID}}',
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
