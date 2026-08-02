






"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCrown,
  FaRocket,
  FaShieldAlt,
  FaQuestionCircle,
  FaGem,
  FaSpinner,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const PricingPage = () => {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Basic (Free)",
      tagline: "For casual cooking enthusiasts & beginners",
      price: "$0",
      period: "/ month",
      isPopular: false,
      features: [
        { name: "Browse all recipes & listings", included: true },
        { name: "Upload up to 2 recipes only", included: true },
        { name: "View public profiles", included: true },
        { name: "Unlimited recipe uploads", included: false },
        { name: "Analytics & priority reach", included: false },
        { name: "Verified Pro Badge", included: false },
        { name: "Dedicated Account Manager", included: false },
      ],
      buttonText: "Current Plan",
      buttonStyle:
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
      actionType: "redirect",
      target: "/dashboard",
    },
    {
      id: "pro-monthly",
      name: "Pro Monthly",
      tagline: "Unlocks full access to add & manage recipes",
      price: "$15",
      period: "/ month",
      isPopular: true,
      features: [
        { name: "Browse all recipes & listings", included: true },
        { name: "Unlimited recipe uploads", included: true },
        { name: "View public profiles", included: true },
        { name: "Create & publish recipes", included: true },
        { name: "Analytics & priority reach", included: true },
        { name: "Verified Pro Badge", included: true },
        { name: "Dedicated Account Manager", included: false },
      ],
      buttonText: "Upgrade to Pro Monthly",
      buttonStyle:
        "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
      actionType: "api",
      target: "/api/subscription",
    },
    {
      id: "pro-yearly",
      name: "Pro Yearly",
      tagline: "Best value with yearly savings included",
      price: "$120",
      period: "/ year",
      savings: "Save 30%+",
      isPopular: false,
      features: [
        { name: "Everything in Pro Monthly Plan", included: true },
        { name: "Unlimited recipe uploads", included: true },
        { name: "Featured Homepage Promotion", included: true },
        { name: "Advanced Audience Insights", included: true },
        { name: "Custom Branding on Listings", included: true },
        { name: "Verified Pro Badge", included: true },
        { name: "Dedicated Account Manager", included: false },
      ],
      buttonText: "Get Yearly Access",
      buttonStyle:
        "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
      actionType: "api",
      target: "/api/subscription",
    },
  ];

  // Handle Payment / Navigation Click
  const handlePlanSelect = async (plan) => {
    if (plan.actionType === "redirect") {
      router.push(plan.target);
      return;
    }

    try {
      setLoadingPlan(plan.id);

      // Backend API Call to trigger checkout session
      const res = await fetch(plan.target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();

      if (data?.url) {
        // Redirect directly to Stripe Checkout URL
        window.location.href = data.url;
      } else {
        // Fallback checkout route if no URL is returned
        router.push(`/checkout?plan=${plan.id}`);
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
          >
            <FaCrown size={12} /> Flexible Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            Choose the plan that fits your culinary journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
          >
            Start free with up to 2 recipes, or upgrade to Pro for unlimited recipe uploads.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
                plan.isPopular
                  ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
                    {plan.name}
                    {plan.isPopular ? (
                      <FaCrown className="text-amber-500" size={18} />
                    ) : idx === 2 ? (
                      <FaGem className="text-purple-500" size={16} />
                    ) : null}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </span>
                  {plan.savings && (
                    <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <ul className="space-y-3.5">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs">
                      {feature.included ? (
                        <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          <FaCheck size={10} />
                        </span>
                      ) : (
                        <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
                          <FaTimes size={10} />
                        </span>
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-gray-700 dark:text-gray-200 font-medium"
                            : "text-gray-400 dark:text-gray-600 line-through"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                    plan.buttonStyle
                  } ${loadingPlan === plan.id ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {loadingPlan === plan.id ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <>
                      {plan.isPopular && <FaRocket size={12} />}
                      {plan.buttonText}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
          <div className="p-4 space-y-2">
            <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Encrypted SSL transactions via Stripe & trusted gateways.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <FaCrown className="mx-auto text-orange-500 text-xl" />
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              No long term lock-in. Switch or stop subscription anytime.
            </p>
          </div>
          <div className="p-4 space-y-2">
            <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Our support team is online 24/7 to resolve your queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;















// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaCheck,
//   FaTimes,
//   FaCrown,
//   FaRocket,
//   FaShieldAlt,
//   FaQuestionCircle,
//   FaGem,
//   FaSpinner,
// } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const PricingPage = () => {
//   const router = useRouter();
//   const [loadingPlan, setLoadingPlan] = useState(null);

//   const plans = [
//     {
//       id: "free",
//       name: "Basic (Free)",
//       tagline: "For casual cooking enthusiasts & beginners",
//       price: "$0",
//       period: "/ month",
//       isPopular: false,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Upload up to 2 recipes only", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Unlimited recipe uploads", included: false },
//         { name: "Analytics & priority reach", included: false },
//         { name: "Verified Pro Badge", included: false },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Current Plan",
//       buttonStyle:
//         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
//       actionType: "redirect",
//       target: "/dashboard",
//     },
//     {
//       id: "pro-monthly",
//       name: "Pro Monthly",
//       tagline: "Unlocks full access to add & manage recipes",
//       price: "$15",
//       period: "/ month",
//       isPopular: true,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Unlimited recipe uploads", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: true },
//         { name: "Analytics & priority reach", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Upgrade to Pro Monthly",
//       buttonStyle:
//         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
//       actionType: "api",
//       target: "/api/subscription",
//     },
//     {
//       id: "pro-yearly",
//       name: "Pro Yearly",
//       tagline: "Best value with yearly savings included",
//       price: "$120",
//       period: "/ year",
//       savings: "Save 30%+",
//       isPopular: false,
//       features: [
//         { name: "Everything in Pro Monthly Plan", included: true },
//         { name: "Unlimited recipe uploads", included: true },
//         { name: "Featured Homepage Promotion", included: true },
//         { name: "Advanced Audience Insights", included: true },
//         { name: "Custom Branding on Listings", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Get Yearly Access",
//       buttonStyle:
//         "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
//       actionType: "api",
//       target: "/api/subscription",
//     },
//   ];

//   // Handle Payment / Navigation Click
//   const handlePlanSelect = async (plan) => {
//     if (plan.actionType === "redirect") {
//       router.push(plan.target);
//       return;
//     }

//     try {
//       setLoadingPlan(plan.id);

//       // Backend API Call to trigger checkout session
//       const res = await fetch(plan.target, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ planId: plan.id }),
//       });

//       const data = await res.json();

//       if (data?.url) {
//         // Redirect to Stripe/Payment Gateway
//         window.location.href = data.url;
//       } else {
//         // Fallback checkout route
//         router.push(`/checkout?plan=${plan.id}`);
//       }
//     } catch (error) {
//       console.error("Subscription error:", error);
//     } finally {
//       setLoadingPlan(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center space-y-4 max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
//           >
//             <FaCrown size={12} /> Flexible Pricing
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
//           >
//             Choose the plan that fits your culinary journey
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
//           >
//             Start free with up to 2 recipes, or upgrade to Pro for unlimited recipe uploads.
//           </motion.p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
//           {plans.map((plan, idx) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
//                 plan.isPopular
//                   ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
//                   : "border-gray-200 dark:border-gray-800"
//               }`}
//             >
//               {plan.isPopular && (
//                 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
//                   Most Popular
//                 </div>
//               )}

//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
//                     {plan.name}
//                     {plan.isPopular ? (
//                       <FaCrown className="text-amber-500" size={18} />
//                     ) : idx === 2 ? (
//                       <FaGem className="text-purple-500" size={16} />
//                     ) : null}
//                   </h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
//                     {plan.tagline}
//                   </p>
//                 </div>

//                 <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
//                   <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
//                     {plan.price}
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {plan.period}
//                   </span>
//                   {plan.savings && (
//                     <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
//                       {plan.savings}
//                     </span>
//                   )}
//                 </div>

//                 <ul className="space-y-3.5">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex items-center gap-3 text-xs">
//                       {feature.included ? (
//                         <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
//                           <FaCheck size={10} />
//                         </span>
//                       ) : (
//                         <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
//                           <FaTimes size={10} />
//                         </span>
//                       )}
//                       <span
//                         className={
//                           feature.included
//                             ? "text-gray-700 dark:text-gray-200 font-medium"
//                             : "text-gray-400 dark:text-gray-600 line-through"
//                         }
//                       >
//                         {feature.name}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Action Button */}
//               <div className="pt-8">
//               <form action={api/subscription} method="POST">
//                 <input type="hidden" name="planId" value={plan.id} />
//                 <button
//                   type="submit"
//                   disabled={loadingPlan === plan.id}
//                   className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
//                     plan.buttonStyle
//                   } ${loadingPlan === plan.id ? "opacity-75 cursor-not-allowed" : ""}`}
//                 >
//                   {loadingPlan === plan.id ? (
//                     <FaSpinner className="animate-spin text-sm" />
//                   ) : (
//                     <>
//                       {plan.isPopular && <FaRocket size={12} />}
//                       {plan.buttonText}
//                     </>
//                   )}
//                 </button>
//               </form>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Guarantees */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
//           <div className="p-4 space-y-2">
//             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Encrypted SSL transactions via Stripe & trusted gateways.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaCrown className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               No long term lock-in. Switch or stop subscription anytime.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Our support team is online 24/7 to resolve your queries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;









// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaCheck,
//   FaTimes,
//   FaCrown,
//   FaRocket,
//   FaShieldAlt,
//   FaQuestionCircle,
//   FaGem,
//   FaSpinner,
// } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const PricingPage = () => {
//   const router = Router();
//   const [loadingPlan, setLoadingPlan] = useState(null);

//   const plans = [
//     {
//       id: "free",
//       name: "Basic (Free)",
//       tagline: "For casual cooking enthusiasts & beginners",
//       price: "$0",
//       period: "/ month",
//       isPopular: false,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Upload up to 2 recipes only", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Unlimited recipe uploads", included: false },
//         { name: "Analytics & priority reach", included: false },
//         { name: "Verified Pro Badge", included: false },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Current Plan",
//       buttonStyle:
//         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
//       actionType: "redirect",
//       target: "/dashboard",
//     },
//     {
//       id: "pro-monthly",
//       name: "Pro Monthly",
//       tagline: "Unlocks full access to add & manage recipes",
//       price: "$15",
//       period: "/ month",
//       isPopular: true,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Unlimited recipe uploads", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: true },
//         { name: "Analytics & priority reach", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Upgrade to Pro Monthly",
//       buttonStyle:
//         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
//       actionType: "api",
//       target: "/api/subscription",
//     },
//     {
//       id: "pro-yearly",
//       name: "Pro Yearly",
//       tagline: "Best value with yearly savings included",
//       price: "$120",
//       period: "/ year",
//       savings: "Save 30%+",
//       isPopular: false,
//       features: [
//         { name: "Everything in Pro Monthly Plan", included: true },
//         { name: "Unlimited recipe uploads", included: true },
//         { name: "Featured Homepage Promotion", included: true },
//         { name: "Advanced Audience Insights", included: true },
//         { name: "Custom Branding on Listings", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Get Yearly Access",
//       buttonStyle:
//         "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
//       actionType: "api",
//       target: "/api/subscription",
//     },
//   ];

//   // 🔴 Handle Payment / Navigation Click
//   const handlePlanSelect = async (plan) => {
//     if (plan.actionType === "redirect") {
//       router.push(plan.target);
//       return;
//     }

//     try {
//       setLoadingPlan(plan.id);

//       // Backend API Call to trigger checkout session (Stripe / SSLCommerz / custom API)
//       const res = await fetch(plan.target, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ planId: plan.id }),
//       });

//       const data = await res.json();

//       if (data?.url) {
//         // Redirect to external Checkout payment page (e.g., Stripe Checkout)
//         window.location.href = data.url;
//       } else {
//         // Fallback checkout redirect inside app
//         router.push(`/checkout?plan=${plan.id}`);
//       }
//     } catch (error) {
//       console.error("Subscription error:", error);
//     } finally {
//       setLoadingPlan(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center space-y-4 max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
//           >
//             <FaCrown size={12} /> Flexible Pricing
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
//           >
//             Choose the plan that fits your culinary journey
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
//           >
//             Start free with up to 2 recipes, or upgrade to Pro for unlimited recipe uploads.
//           </motion.p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
//           {plans.map((plan, idx) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
//                 plan.isPopular
//                   ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
//                   : "border-gray-200 dark:border-gray-800"
//               }`}
//             >
//               {plan.isPopular && (
//                 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
//                   Most Popular
//                 </div>
//               )}

//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
//                     {plan.name}
//                     {plan.isPopular ? (
//                       <FaCrown className="text-amber-500" size={18} />
//                     ) : idx === 2 ? (
//                       <FaGem className="text-purple-500" size={16} />
//                     ) : null}
//                   </h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
//                     {plan.tagline}
//                   </p>
//                 </div>

//                 <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
//                   <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
//                     {plan.price}
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {plan.period}
//                   </span>
//                   {plan.savings && (
//                     <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
//                       {plan.savings}
//                     </span>
//                   )}
//                 </div>

//                 <ul className="space-y-3.5">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex items-center gap-3 text-xs">
//                       {feature.included ? (
//                         <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
//                           <FaCheck size={10} />
//                         </span>
//                       ) : (
//                         <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
//                           <FaTimes size={10} />
//                         </span>
//                       )}
//                       <span
//                         className={
//                           feature.included
//                             ? "text-gray-700 dark:text-gray-200 font-medium"
//                             : "text-gray-400 dark:text-gray-600 line-through"
//                         }
//                       >
//                         {feature.name}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Action Button */}
//               <div className="pt-8">
//                 <button
//                   onClick={() => handlePlanSelect(plan)}
//                   disabled={loadingPlan === plan.id}
//                   className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
//                     plan.buttonStyle
//                   } ${loadingPlan === plan.id ? "opacity-75 cursor-not-allowed" : ""}`}
//                 >
//                   {loadingPlan === plan.id ? (
//                     <FaSpinner className="animate-spin text-sm" />
//                   ) : (
//                     <>
//                       {plan.isPopular && <FaRocket size={12} />}
//                       {plan.buttonText}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Guarantees */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
//           <div className="p-4 space-y-2">
//             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Encrypted SSL transactions via Stripe & trusted gateways.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaCrown className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               No long term lock-in. Switch or stop subscription anytime.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Our support team is online 24/7 to resolve your queries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;





// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaCheck,
//   FaTimes,
//   FaCrown,
//   FaRocket,
//   FaShieldAlt,
//   FaQuestionCircle,
//   FaGem,
// } from "react-icons/fa";
// import Link from "next/link";

// const PricingPage = () => {
//   const plans = [
//     {
//       name: "Basic (Free)",
//       tagline: "For casual cooking enthusiasts & beginners",
//       price: "$0",
//       period: "/ month",
//       isPopular: false,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Upload up to 2 recipes only", included: true }, // 👈 Free user limit
//         { name: "View public profiles", included: true },
//         { name: "Unlimited recipe uploads", included: false },
//         { name: "Analytics & priority reach", included: false },
//         { name: "Verified Pro Badge", included: false },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Current Plan",
//       buttonStyle:
//         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
//       link: "/dashboard",
//     },
//     {
//       name: "Pro Monthly",
//       tagline: "Unlocks full access to add & manage recipes",
//       price: "$15",
//       period: "/ month",
//       isPopular: true,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Unlimited recipe uploads", included: true }, // 👈 Pro unlimited
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: true },
//         { name: "Analytics & priority reach", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Upgrade to Pro Monthly",
//       buttonStyle:
//         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
//       link: "/api/subscription",
//     },
//     {
//       name: "Pro Yearly",
//       tagline: "Best value with yearly savings included",
//       price: "$120",
//       period: "/ year",
//       savings: "Save 30%+",
//       isPopular: false,
//       features: [
//         { name: "Everything in Pro Monthly Plan", included: true },
//         { name: "Unlimited recipe uploads", included: true }, // 👈 Pro unlimited
//         { name: "Featured Homepage Promotion", included: true },
//         { name: "Advanced Audience Insights", included: true },
//         { name: "Custom Branding on Listings", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Get Yearly Access",
//       buttonStyle:
//         "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
//       link: "/checkout?plan=pro-yearly",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center space-y-4 max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
//           >
//             <FaCrown size={12} /> Flexible Pricing
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
//           >
//             Choose the plan that fits your culinary journey
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
//           >
//             Start free with up to 2 recipes, or upgrade to Pro for unlimited recipe uploads and exclusive community features.
//           </motion.p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
//           {plans.map((plan, idx) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
//                 plan.isPopular
//                   ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
//                   : "border-gray-200 dark:border-gray-800"
//               }`}
//             >
//               {plan.isPopular && (
//                 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
//                   Most Popular
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {/* Title & Tagline */}
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
//                     {plan.name}
//                     {plan.isPopular ? (
//                       <FaCrown className="text-amber-500" size={18} />
//                     ) : idx === 2 ? (
//                       <FaGem className="text-purple-500" size={16} />
//                     ) : null}
//                   </h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
//                     {plan.tagline}
//                   </p>
//                 </div>

//                 {/* Price */}
//                 <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
//                   <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
//                     {plan.price}
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {plan.period}
//                   </span>
//                   {plan.savings && (
//                     <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
//                       {plan.savings}
//                     </span>
//                   )}
//                 </div>

//                 {/* Features List */}
//                 <ul className="space-y-3.5">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex items-center gap-3 text-xs">
//                       {feature.included ? (
//                         <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
//                           <FaCheck size={10} />
//                         </span>
//                       ) : (
//                         <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
//                           <FaTimes size={10} />
//                         </span>
//                       )}
//                       <span
//                         className={
//                           feature.included
//                             ? "text-gray-700 dark:text-gray-200 font-medium"
//                             : "text-gray-400 dark:text-gray-600 line-through"
//                         }
//                       >
//                         {feature.name}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* CTA Button */}
//               <div className="pt-8">
//                 <Link href={plan.link} className="block w-full">
//                   <button
//                     className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${plan.buttonStyle}`}
//                   >
//                     {plan.isPopular && <FaRocket size={12} />}
//                     {plan.buttonText}
//                   </button>
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Guarantees */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
//           <div className="p-4 space-y-2">
//             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Encrypted SSL transactions via Stripe & trusted gateways.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaCrown className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               No long term lock-in. Switch or stop subscription anytime.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Our support team is online 24/7 to resolve your queries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;


































// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaCheck,
//   FaTimes,
//   FaCrown,
//   FaRocket,
//   FaShieldAlt,
//   FaQuestionCircle,
//   FaGem,
// } from "react-icons/fa";
// import Link from "next/link";

// const PricingPage = () => {
//   const plans = [
//     {
//       name: "Basic (Free)",
//       tagline: "For casual enthusiasts and visitors",
//       price: "$0",
//       period: "/ month",
//       isPopular: false,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Save up to 5 favorites", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: false },
//         { name: "Analytics & priority reach", included: false },
//         { name: "Verified Pro Badge", included: false },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Current Plan",
//       buttonStyle:
//         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
//       link: "/dashboard",
//     },
//     {
//       name: "Pro Monthly",
//       tagline: "Unlocks full access to add & manage listings",
//       price: "$15",
//       period: "/ month",
//       isPopular: true,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Unlimited favorites & history", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: true },
//         { name: "Analytics & priority reach", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Upgrade to Pro Monthly",
//       buttonStyle:
//         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
//       link: "/checkout?plan=pro-monthly",
//     },
//     {
//       name: "Pro Yearly",
//       tagline: "Best value with yearly savings included",
//       price: "$120",
//       period: "/ year",
//       savings: "Save 30%+",
//       isPopular: false,
//       features: [
//         { name: "Everything in Pro Monthly Plan", included: true },
//         { name: "Featured Homepage Promotion", included: true },
//         { name: "Unlimited Recipe Uploads", included: true },
//         { name: "Advanced Audience Insights", included: true },
//         { name: "Custom Branding on Listings", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Get Yearly Access",
//       buttonStyle:
//         "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
//       link: "/checkout?plan=pro-yearly",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center space-y-4 max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
//           >
//             <FaCrown size={12} /> Flexible Pricing
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
//           >
//             Choose the plan that fits your culinary journey
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
//           >
//             Unlock recipe posting, unlimited bookmarks, and exclusive community features with our subscription tiers.
//           </motion.p>
//         </div>

//         {/* Pricing Cards (3 Column Grid) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
//           {plans.map((plan, idx) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.1 }}
//               className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
//                 plan.isPopular
//                   ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
//                   : "border-gray-200 dark:border-gray-800"
//               }`}
//             >
//               {plan.isPopular && (
//                 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
//                   Most Popular
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {/* Title & Tagline */}
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
//                     {plan.name}
//                     {plan.isPopular ? (
//                       <FaCrown className="text-amber-500" size={18} />
//                     ) : idx === 2 ? (
//                       <FaGem className="text-purple-500" size={16} />
//                     ) : null}
//                   </h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
//                     {plan.tagline}
//                   </p>
//                 </div>

//                 {/* Price */}
//                 <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
//                   <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
//                     {plan.price}
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {plan.period}
//                   </span>
//                   {plan.savings && (
//                     <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
//                       {plan.savings}
//                     </span>
//                   )}
//                 </div>

//                 {/* Features List */}
//                 <ul className="space-y-3.5">
//                   {plan.features.map((feature, fIdx) => (
//                     <li key={fIdx} className="flex items-center gap-3 text-xs">
//                       {feature.included ? (
//                         <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
//                           <FaCheck size={10} />
//                         </span>
//                       ) : (
//                         <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
//                           <FaTimes size={10} />
//                         </span>
//                       )}
//                       <span
//                         className={
//                           feature.included
//                             ? "text-gray-700 dark:text-gray-200 font-medium"
//                             : "text-gray-400 dark:text-gray-600 line-through"
//                         }
//                       >
//                         {feature.name}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* CTA Button */}
//               <div className="pt-8">
//                 <Link href={plan.link} className="block w-full">
//                   <button
//                     className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${plan.buttonStyle}`}
//                   >
//                     {plan.isPopular && <FaRocket size={12} />}
//                     {plan.buttonText}
//                   </button>
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Feature Guarantees */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
//           <div className="p-4 space-y-2">
//             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Encrypted SSL transactions via Stripe & trusted gateways.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaCrown className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               No long term lock-in. Switch or stop subscription anytime.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Our support team is online 24/7 to resolve your queries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;











// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaCheck,
//   FaTimes,
//   FaCrown,
//   FaRocket,
//   FaShieldAlt,
//   FaQuestionCircle,
//   FaBuilding,
// } from "react-icons/fa";
// import Link from "next/link";

// const PricingPage = () => {
//   const [isYearly, setIsYearly] = useState(false);

//   const plans = [
//     {
//       name: "Basic",
//       tagline: "For casual enthusiasts and visitors",
//       price: { monthly: 0, yearly: 0 },
//       isPopular: false,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Save up to 5 favorites", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: false },
//         { name: "Analytics & priority reach", included: false },
//         { name: "Verified Pro Badge", included: false },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Current Plan",
//       buttonStyle:
//         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
//       link: "/dashboard",
//     },
//     {
//       name: "Pro Chef & Host",
//       tagline: "Unlocks full access to add & manage listings",
//       price: { monthly: 15, yearly: 120 }, // $10/mo billed yearly
//       isPopular: true,
//       features: [
//         { name: "Browse all recipes & listings", included: true },
//         { name: "Unlimited favorites & history", included: true },
//         { name: "View public profiles", included: true },
//         { name: "Create & publish recipes", included: true },
//         { name: "Analytics & priority reach", included: true },
//         { name: "Verified Pro Badge", included: true },
//         { name: "Dedicated Account Manager", included: false },
//       ],
//       buttonText: "Upgrade to Pro",
//       buttonStyle:
//         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
//       link: "/checkout?plan=pro",
//     },
//     {
//       name: "Enterprise & Business",
//       tagline: "For commercial kitchens, brands & restaurants",
//       price: { monthly: 49, yearly: 420 }, // $35/mo billed yearly
//       isPopular: false,
//       features: [
//         { name: "Everything in Pro Chef Plan", included: true },
//         { name: "Featured Homepage Promotion", included: true },
//         { name: "Unlimited Recipe Uploads", included: true },
//         { name: "Advanced Audience Insights", included: true },
//         { name: "Custom Branding on Listings", included: true },
//         { name: "Verified Gold Business Badge", included: true },
//         { name: "Dedicated Account Manager", included: true },
//       ],
//       buttonText: "Get Enterprise Access",
//       buttonStyle:
//         "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md",
//       link: "/checkout?plan=enterprise",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto space-y-12">
//         {/* Header */}
//         <div className="text-center space-y-4 max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
//           >
//             <FaCrown size={12} /> Flexible Pricing
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
//           >
//             Choose the plan that fits your culinary journey
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
//           >
//             Unlock recipe posting, unlimited bookmarks, and exclusive community features with our subscription tiers.
//           </motion.p>

//           {/* Billing Toggle (Monthly / Yearly) */}
//           <div className="pt-4 flex items-center justify-center gap-3">
//             <span
//               className={`text-xs font-medium ${
//                 !isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
//               }`}
//             >
//               Monthly
//             </span>
//             <button
//               onClick={() => setIsYearly(!isYearly)}
//               className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors p-1 focus:outline-none cursor-pointer"
//             >
//               <motion.div
//                 layout
//                 className="w-4 h-4 rounded-full bg-orange-500"
//                 animate={{ x: isYearly ? 24 : 0 }}
//                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
//               />
//             </button>
//             <span
//               className={`text-xs font-medium flex items-center gap-1.5 ${
//                 isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
//               }`}
//             >
//               Yearly
//               <span className="text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
//                 Save 30%+
//               </span>
//             </span>
//           </div>
//         </div>

//         {/* Pricing Cards (3 Column Grid) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
//           {plans.map((plan, idx) => {
//             const currentPrice = isYearly
//               ? Math.round(plan.price.yearly / 12)
//               : plan.price.monthly;

//             return (
//               <motion.div
//                 key={plan.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
//                   plan.isPopular
//                     ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
//                     : "border-gray-200 dark:border-gray-800"
//                 }`}
//               >
//                 {plan.isPopular && (
//                   <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
//                     Most Popular
//                   </div>
//                 )}

//                 <div className="space-y-6">
//                   {/* Title & Tagline */}
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between">
//                       {plan.name}
//                       {plan.isPopular ? (
//                         <FaCrown className="text-amber-500" size={18} />
//                       ) : idx === 2 ? (
//                         <FaBuilding className="text-gray-400" size={16} />
//                       ) : null}
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 min-h-[32px]">
//                       {plan.tagline}
//                     </p>
//                   </div>

//                   {/* Price */}
//                   <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
//                     <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
//                       ${currentPrice}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       / month {isYearly && plan.price.yearly > 0 && "(billed annually)"}
//                     </span>
//                   </div>

//                   {/* Features List */}
//                   <ul className="space-y-3.5">
//                     {plan.features.map((feature, fIdx) => (
//                       <li key={fIdx} className="flex items-center gap-3 text-xs">
//                         {feature.included ? (
//                           <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
//                             <FaCheck size={10} />
//                           </span>
//                         ) : (
//                           <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
//                             <FaTimes size={10} />
//                           </span>
//                         )}
//                         <span
//                           className={
//                             feature.included
//                               ? "text-gray-700 dark:text-gray-200 font-medium"
//                               : "text-gray-400 dark:text-gray-600 line-through"
//                           }
//                         >
//                           {feature.name}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* CTA Button */}
//                 <div className="pt-8">
//                   <Link href={plan.link} className="block w-full">
//                     <button
//                       className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${plan.buttonStyle}`}
//                     >
//                       {plan.isPopular && <FaRocket size={12} />}
//                       {plan.buttonText}
//                     </button>
//                   </Link>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Feature Guarantees */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center max-w-4xl mx-auto">
//           <div className="p-4 space-y-2">
//             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Encrypted SSL transactions via Stripe & trusted gateways.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaCrown className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               No long term lock-in. Switch or stop subscription anytime.
//             </p>
//           </div>
//           <div className="p-4 space-y-2">
//             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
//             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
//             <p className="text-[11px] text-gray-500 dark:text-gray-400">
//               Our support team is online 24/7 to resolve your queries.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;











// // "use client";

// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import {
// //   FaCheck,
// //   FaTimes,
// //   FaCrown,
// //   FaRocket,
// //   FaShieldAlt,
// //   FaQuestionCircle,
// // } from "react-icons/fa";
// // import Link from "next/link";

// // const PricingPage = () => {
// //   const [isYearly, setIsYearly] = useState(false);

// //   const plans = [
// //     {
// //       name: "Basic",
// //       tagline: "For casual enthusiasts and visitors",
// //       price: { monthly: 0, yearly: 0 },
// //       isPopular: false,
// //       features: [
// //         { name: "Browse all recipes & listings", included: true },
// //         { name: "Save up to 5 favorites", included: true },
// //         { name: "View public profiles", included: true },
// //         { name: "Create & publish recipes/cars", included: false },
// //         { name: "Analytics & priority reach", included: false },
// //         { name: "Verified Pro Badge", included: false },
// //         { name: "24/7 Priority Support", included: false },
// //       ],
// //       buttonText: "Current Plan",
// //       buttonStyle:
// //         "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
// //       link: "/dashboard",
// //     },
// //     {
// //       name: "Pro Chef & Host",
// //       tagline: "Unlocks full access to add and manage listings",
// //       price: { monthly: 15, yearly: 120 }, // $10/mo when billed yearly
// //       isPopular: true,
// //       features: [
// //         { name: "Browse all recipes & listings", included: true },
// //         { name: "Unlimited favorites & history", included: true },
// //         { name: "View public profiles", included: true },
// //         { name: "Create & publish recipes/cars", included: true },
// //         { name: "Analytics & priority reach", included: true },
// //         { name: "Verified Pro Badge", included: true },
// //         { name: "24/7 Priority Support", included: true },
// //       ],
// //       buttonText: "Upgrade to Pro",
// //       buttonStyle:
// //         "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
// //       link: "/checkout?plan=pro",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
// //       <div className="max-w-5xl mx-auto space-y-12">
// //         {/* Header */}
// //         <div className="text-center space-y-4 max-w-2xl mx-auto">
// //           <motion.div
// //             initial={{ opacity: 0, y: -10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider"
// //           >
// //             <FaCrown size={12} /> Flexible Pricing
// //           </motion.div>
// //           <motion.h1
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
// //           >
// //             Choose the plan that fits your culinary journey
// //           </motion.h1>
// //           <motion.p
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
// //           >
// //             Unlock recipe posting, unlimited bookmarks, and exclusive community features with our Pro subscription.
// //           </motion.p>

// //           {/* Billing Toggle (Monthly / Yearly) */}
// //           <div className="pt-4 flex items-center justify-center gap-3">
// //             <span
// //               className={`text-xs font-medium ${
// //                 !isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
// //               }`}
// //             >
// //               Monthly
// //             </span>
// //             <button
// //               onClick={() => setIsYearly(!isYearly)}
// //               className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors p-1 focus:outline-none cursor-pointer"
// //             >
// //               <motion.div
// //                 layout
// //                 className="w-4 h-4 rounded-full bg-orange-500"
// //                 animate={{ x: isYearly ? 24 : 0 }}
// //                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
// //               />
// //             </button>
// //             <span
// //               className={`text-xs font-medium flex items-center gap-1.5 ${
// //                 isYearly ? "text-gray-900 dark:text-white font-bold" : "text-gray-500"
// //               }`}
// //             >
// //               Yearly
// //               <span className="text-[10px] bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
// //                 Save 33%
// //               </span>
// //             </span>
// //           </div>
// //         </div>

// //         {/* Pricing Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
// //           {plans.map((plan, idx) => {
// //             const currentPrice = isYearly
// //               ? Math.round(plan.price.yearly / 12)
// //               : plan.price.monthly;

// //             return (
// //               <motion.div
// //                 key={plan.name}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: idx * 0.1 }}
// //                 className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-gray-900 border transition-all ${
// //                   plan.isPopular
// //                     ? "border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20"
// //                     : "border-gray-200 dark:border-gray-800"
// //                 }`}
// //               >
// //                 {plan.isPopular && (
// //                   <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
// //                     Most Popular
// //                   </div>
// //                 )}

// //                 <div className="space-y-6">
// //                   {/* Title & Tagline */}
// //                   <div>
// //                     <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
// //                       {plan.name}
// //                       {plan.isPopular && <FaCrown className="text-amber-500" size={18} />}
// //                     </h3>
// //                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
// //                       {plan.tagline}
// //                     </p>
// //                   </div>

// //                   {/* Price */}
// //                   <div className="flex items-baseline gap-1 border-b border-gray-100 dark:border-gray-800 pb-6">
// //                     <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
// //                       ${currentPrice}
// //                     </span>
// //                     <span className="text-xs text-gray-500 dark:text-gray-400">
// //                       / month {isYearly && plan.price.yearly > 0 && "(billed annually)"}
// //                     </span>
// //                   </div>

// //                   {/* Features List */}
// //                   <ul className="space-y-3.5">
// //                     {plan.features.map((feature, fIdx) => (
// //                       <li key={fIdx} className="flex items-center gap-3 text-xs">
// //                         {feature.included ? (
// //                           <span className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
// //                             <FaCheck size={10} />
// //                           </span>
// //                         ) : (
// //                           <span className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex-shrink-0">
// //                             <FaTimes size={10} />
// //                           </span>
// //                         )}
// //                         <span
// //                           className={
// //                             feature.included
// //                               ? "text-gray-700 dark:text-gray-200 font-medium"
// //                               : "text-gray-400 dark:text-gray-600 line-through"
// //                           }
// //                         >
// //                           {feature.name}
// //                         </span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>

// //                 {/* CTA Button */}
// //                 <div className="pt-8">
// //                   <Link href={plan.link} className="block w-full">
// //                     <button
// //                       className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${plan.buttonStyle}`}
// //                     >
// //                       {plan.isPopular && <FaRocket size={12} />}
// //                       {plan.buttonText}
// //                     </button>
// //                   </Link>
// //                 </div>
// //               </motion.div>
// //             );
// //           })}
// //         </div>

// //         {/* Feature Guarantees */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
// //           <div className="p-4 space-y-2">
// //             <FaShieldAlt className="mx-auto text-orange-500 text-xl" />
// //             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Secure Payments</h4>
// //             <p className="text-[11px] text-gray-500 dark:text-gray-400">
// //               Encrypted SSL transactions via Stripe & trusted gateways.
// //             </p>
// //           </div>
// //           <div className="p-4 space-y-2">
// //             <FaCrown className="mx-auto text-orange-500 text-xl" />
// //             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Cancel Anytime</h4>
// //             <p className="text-[11px] text-gray-500 dark:text-gray-400">
// //               No long term lock-in. Switch or stop subscription anytime.
// //             </p>
// //           </div>
// //           <div className="p-4 space-y-2">
// //             <FaQuestionCircle className="mx-auto text-orange-500 text-xl" />
// //             <h4 className="text-xs font-bold text-gray-900 dark:text-white">Need Help?</h4>
// //             <p className="text-[11px] text-gray-500 dark:text-gray-400">
// //               Our support team is online 24/7 to resolve your queries.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PricingPage;



