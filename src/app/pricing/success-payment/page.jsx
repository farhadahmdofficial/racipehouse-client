
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { FaCheckCircle, FaReceipt, FaEnvelope, FaArrowRight, FaUtensils } from 'react-icons/fa';
import { payment } from '@/lib/actions/payment';

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  // Retrieve Stripe checkout session
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const { status, customer_details, metadata, amount_total, currency } = session;
  const customerEmail = customer_details?.email;
  const recipeId = metadata?.recipeId;
  const recipeName = metadata?.name || 'Recipe Access';
  console.log(metadata);

  // If the session is still open, redirect to home or checkout page
  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {

    const pay_data = await payment({...metadata, session_id});
    console.log(pay_data,"pay data ");
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          
          {/* Main Success Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-10 shadow-xl text-center relative overflow-hidden">
            
            {/* Top Success Badge */}
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              <FaCheckCircle />
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8">
              Thank you for your purchase. Your access has been granted immediately.
            </p>

            {/* Order Details Box */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 text-left space-y-3 mb-8">
              
              <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <FaUtensils className="text-orange-500" /> Item Purchased
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {recipeName}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <FaReceipt className="text-orange-500" /> Amount Paid
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${(amount_total / 100).toFixed(2)} {currency?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <FaEnvelope className="text-orange-500" /> Billed To
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                  {customerEmail}
                </span>
              </div>

            </div>

            {/* Email Notification Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              A receipt and confirmation email has been sent to{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{customerEmail}</span>.
              If you have any questions, contact{' '}
              <a href="mailto:support@example.com" className="text-orange-600 dark:text-orange-500 font-medium underline">
                support@example.com
              </a>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {recipeId ? (
                <Link
                  // href={`/recipes/${recipeId}`}
                  href={"/browserecipes"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-95 text-sm"
                >
                  <span>View Unlocked Recipe</span>
                  <FaArrowRight />
                </Link>
              ) : (
                <Link
                  href="/recipes"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-95 text-sm"
                >
                  <span>Explore Recipes</span>
                  <FaArrowRight />
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  return null;
}











// import { stripe } from '@/lib/stripe'
// import { redirect } from 'next/navigation'



// export default async function Success({ searchParams }) {
//   const { session_id } = await searchParams

//   if (!session_id)
//     throw new Error('Please provide a valid session_id (`cs_test_...`)')

//   const {
//     status,
//     customer_details: { email: customerEmail }
//   } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ['line_items', 'payment_intent']
//   })

//   if (status === 'open') {
//     return redirect('/')
//   }

//   if (status === 'complete') {
//     return (
//       <section id="success">
//         <p>
//           We appreciate your business! A confirmation email will be sent to{' '}
//           {customerEmail}. If you have any questions, please email{' '}
//           <a href="mailto:orders@example.com">orders@example.com</a>.
//         </p>
//       </section>
//     )
//   }
// }