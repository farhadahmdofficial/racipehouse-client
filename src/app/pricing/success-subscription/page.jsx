

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight, FaReceipt } from "react-icons/fa";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { subscription } from "@/lib/actions/payment";

export default async function SuccessSubscriptionPage({ searchParams }) {
  const params = await searchParams;
  const session_id = params?.session_id;

  const authsession = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = authsession?.user;

  // session_id না থাকলে সরাসরি রিডাইরেক্ট
  if (!session_id) {
    redirect("/pricing");
  }

  let session;

  try {
    // Stripe থেকে Session ডাটা রিট্রিভ করা
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    session = null;
  }

  // Stripe API ফেল করলে /pricing পেজে রিডাইরেক্ট
  if (!session) {
    redirect("/pricing");
  }

  const status = session?.status;
  const customerEmail = session?.customer_details?.email;

  // পেমেন্ট অসম্পূর্ণ থাকলে হোমপেজে রিডাইরেক্ট
  if (status === "open") {
    redirect("/");
  }

  // 🎯 পেমেন্ট সম্পূর্ণ হলে MongoDB-তে ডাটা আপডেট করা
  if (status === "complete") {
    const result = await subscription({ user: currentUser, session_id });
    console.log(result, "result from subscription function");

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 ring-8 ring-emerald-50 dark:ring-emerald-950/30 animate-bounce">
            <FaCheckCircle size={42} />
          </div>

          {/* Header Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Welcome to <strong>RecipeHouse Pro</strong>. Your subscription is now active!
            </p>
          </div>

          {/* Receipt Summary Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1.5 font-medium text-gray-500">
                <FaReceipt /> Confirmation Email:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                {customerEmail || "N/A"}
              </span>
            </div>
            <p className="pt-1 text-[11px] text-gray-500 dark:text-gray-400">
              A payment confirmation receipt has been sent to your email address.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-3">
            {/* 🎯 Link-এর পরিবর্তে <a> ট্যাগ ব্যবহার করা হলো যাতে /dashboard-এ যাওয়ার সময় পুরো পেজ হার্ড-রিফ্রেশ হয়ে নতুন সেশন কুকি রিড করে */}
            <a
              href="/dashboard"
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-95 cursor-pointer block"
            >
              Go to Dashboard <FaArrowRight size={12} />
            </a>

            <p className="text-[11px] text-gray-400">
              Need help with your subscription?{" "}
              <a
                href="mailto:support@recipehouse.com"
                className="text-orange-500 hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // সব শর্তের বাইরে সেফটি রিডাইরেক্ট
  redirect("/pricing");
}











// import { stripe } from "@/lib/stripe";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { FaCheckCircle, FaArrowRight, FaReceipt } from "react-icons/fa";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { subscription } from "@/lib/actions/payment";
// import { authClient } from "@/lib/auth-client";

// export default async function SuccessSubscriptionPage({ searchParams }) {
//   const params = await searchParams;
//   const session_id = params?.session_id;

//   const authsession =await auth.api.getSession({
//           headers:await headers()
  
//       });

//       const currentUser = authsession?.user;

//   // session_id না থাকলে সরাসরি রিডাইরেক্ট
//   if (!session_id) {
//     redirect("/pricing");
//   }

//   let session;

//   try {
//     // Stripe থেকে Session ডাটা রিট্রিভ করা
//     session = await stripe.checkout.sessions.retrieve(session_id, {
//       expand: ["line_items", "payment_intent"],
//     });
//   } catch (error) {
//     console.error("Error retrieving checkout session:", error);
//     // try/catch এর ভেতর redirect না দিয়ে বাইরে দেওয়ার জন্য ফ্ল্যাগ হিসেবে ব্যবহার
//     session = null;
//   }

//   // Stripe API ফেল করলে /pricing পেজে রিডাইরেক্ট
//   if (!session) {
//     redirect("/pricing");
//   }

//   const status = session?.status;
//   const customerEmail = session?.customer_details?.email;

//   // পেমেন্ট অসম্পূর্ণ থাকলে হোমপেজে রিডাইরেক্ট
//   if (status === "open") {

//     redirect("/");
//   }

//   if (status === "complete") {
//     const result = await subscription({ user: currentUser, session_id });

//   // if (result?.success) {
//   //   // 🎯 ২. সেশনটি ক্লায়েন্ট থেকে ফোর্স রিফ্রেশ করানো (যাতে নতুন JWT/Cookie তৈরি হয়)
//   //   await authClient.getSession({
//   //     fetchOptions: {
//   //       headers: {
//   //         "cache-control": "no-cache",
//   //       },
//   //     },
//   //   });

//   //   // 🎯 ৩. হার্ড রিফ্রেশ সহ রিডাইরেক্ট
//   //   window.location.href = "/dashboard";
//   }




// //     const result = await subscription({ 
// //     user: currentUser, // 👈 currentUser কে user কি (key) তে ম্যাপ করা হলো
// //     session_id 
// //   });


//     console.log(result,"result from subscription function");


//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//         <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          
//           {/* Success Icon */}
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 ring-8 ring-emerald-50 dark:ring-emerald-950/30 animate-bounce">
//             <FaCheckCircle size={42} />
//           </div>

//           {/* Header Title */}
//           <div className="space-y-2">
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
//               Payment Successful!
//             </h1>
//             <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//               Welcome to <strong>RecipeHouse Pro</strong>. Your subscription is now active!
//             </p>
//           </div>

//           {/* Receipt Summary Card */}
//           <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
//             <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
//               <span className="flex items-center gap-1.5 font-medium text-gray-500">
//                 <FaReceipt /> Confirmation Email:
//               </span>
//               <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
//                 {customerEmail || "N/A"}
//               </span>
//             </div>
//             <p className="pt-1 text-[11px] text-gray-500 dark:text-gray-400">
//               A payment confirmation receipt has been sent to your email address.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="pt-2 space-y-3">
//             <Link
//               href="/dashboard"
//               className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-95"
//             >
//               Go to Dashboard <FaArrowRight size={12} />
//             </Link>

//             <p className="text-[11px] text-gray-400">
//               Need help with your subscription?{" "}
//               <a
//                 href="mailto:support@recipehouse.com"
//                 className="text-orange-500 hover:underline font-medium"
//               >
//                 Contact Support
//               </a>
//             </p>
//           </div>

//         </div>
//       </div>
//     );
//   }

//   // সব শর্তের বাইরে সেফটি রিডাইরেক্ট
//   redirect("/pricing");
// }










// import { stripe } from "@/lib/stripe";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { FaCheckCircle, FaArrowRight, FaReceipt } from "react-icons/fa";

// export default async function SuccessSubscriptionPage({ searchParams }) {
//   // Next.js 15+ async searchParams হ্যান্ডেল করা
//   const params = await searchParams;
//   const session_id = params?.session_id;

//   if (!session_id) {
//     redirect("/pricing");
//   }

//   try {
//     // Stripe থেকে Session ডাটা রিট্রিভ করা
//     const session = await stripe.checkout.sessions.retrieve(session_id, {
//       expand: ["line_items", "payment_intent"],
//     });

//     const status = session?.status;
//     const customerEmail = session?.customer_details?.email;

//     // যদি পেমেন্ট অসম্পূর্ণ থাকে তবে হোমপেজে রিডাইরেক্ট করা
//     if (status === "open") {
//       redirect("/");
//     }

//     if (status === "complete") {
//       return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//           <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            
//             {/* Success Icon */}
//             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 ring-8 ring-emerald-50 dark:ring-emerald-950/30 animate-bounce">
//               <FaCheckCircle size={42} />
//             </div>

//             {/* Header Title */}
//             <div className="space-y-2">
//               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
//                 Payment Successful!
//               </h1>
//               <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//                 Welcome to <strong>RecipeHouse Pro</strong>. Your subscription is now active!
//               </p>
//             </div>

//             {/* Receipt Summary Card */}
//             <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
//               <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
//                 <span className="flex items-center gap-1.5 font-medium text-gray-500">
//                   <FaReceipt /> Confirmation Email:
//                 </span>
//                 <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
//                   {customerEmail || "N/A"}
//                 </span>
//               </div>
//               <p className="pt-1 text-[11px] text-gray-500 dark:text-gray-400">
//                 A payment confirmation receipt has been sent to your email address.
//               </p>
//             </div>

//             {/* Actions */}
//             <div className="pt-2 space-y-3">
//               <Link
//                 href="/dashboard"
//                 className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition active:scale-95"
//               >
//                 Go to Dashboard <FaArrowRight size={12} />
//               </Link>

//               <p className="text-[11px] text-gray-400">
//                 Need help with your subscription?{" "}
//                 <a
//                   href="mailto:support@recipehouse.com"
//                   className="text-orange-500 hover:underline font-medium"
//                 >
//                   Contact Support
//                 </a>
//               </p>
//             </div>

//           </div>
//         </div>
//       );
//     }
//   } catch (error) {
//     console.error("Error retrieving checkout session:", error);
//     redirect("/pricing");
//   }
// }













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