


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaTag, FaArrowRight } from 'react-icons/fa';

const RunningBanner = () => {
//     const pathname = usePathname();

// // /dashboard দিয়ে শুরু হওয়া সমস্ত রাউটের জন্য নেভবার বন্ধ থাকবে
// if (pathname.startsWith("/dashboard")) {
//   return null;
// }


// pathme
     const pathname = usePathname();
      console.log(pathname);
      if(pathname==="/dashboard" || pathname==="/dashboard/users/favorites" || pathname==="/dashboard/users/myrecipes" || pathname==="/dashboard/users/mypurchased" || pathname==="/dashboard/users/addrecipe" || pathname==="/dashboard/profile"   ){
        return null; // যদি ইউজার ড্যাশবোর্ড পেজে থাকি, তাহলে নেভবার রেন্ডার হবে না
      }
  return (<div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white text-xs md:text-sm py-2 overflow-hidden relative z-50 border-b border-orange-500/30">
  
  {/* 💡 ইনলাইন CSS এনিমেশন - এটি টেক্সট রান করার নিশ্চয়তা দেয় */}
  <style>{`
    @keyframes marqueeScroll {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      width: max-content;
      animation: marqueeScroll 25s linear infinite;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
  `}</style>

  <div className="marquee-track space-x-8">
    {/* Banner Content Item 1 */}
    <div className="inline-flex items-center space-x-2 font-medium">
      <FaTag className="text-yellow-300 animate-bounce" />
      <span>🎉 SPECIAL OFFER: Get <strong>10% DISCOUNT</strong> on all premium recipes!</span>
      <Link
        href="/browserecipes"
        className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
      >
        <span>Claim Offer</span>
        <FaArrowRight className="text-[10px]" />
      </Link>
    </div>

    {/* Banner Content Item 2 (To keep seamless loop) */}
    <div className="inline-flex items-center space-x-2 font-medium">
      <FaTag className="text-yellow-300 animate-bounce" />
      <span>🔥 Limited Time Deal: Use Code <span className="bg-black/20 px-1.5 py-0.5 rounded font-mono font-bold text-yellow-300">RECIPE10</span> for 10% Off!</span>
      <Link
        href="/browserecipes"
        className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
      >
        <span>Browse Now</span>
        <FaArrowRight className="text-[10px]" />
      </Link>
    </div>

    {/* Banner Content Item 3 */}
    <div className="inline-flex items-center space-x-2 font-medium">
      <FaTag className="text-yellow-300 animate-bounce" />
      <span>🎉 SPECIAL OFFER: Get <strong>10% DISCOUNT</strong> on all premium recipes!</span>
      <Link
        href="/browserecipes"
        className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
      >
        <span>Claim Offer</span>
        <FaArrowRight className="text-[10px]" />
      </Link>
    </div>

    {/* Banner Content Item 4 (লুপ স্মুথ রাখার জন্য) */}
    <div className="inline-flex items-center space-x-2 font-medium">
      <FaTag className="text-yellow-300 animate-bounce" />
      <span>🔥 Limited Time Deal: Use Code <span className="bg-black/20 px-1.5 py-0.5 rounded font-mono font-bold text-yellow-300">RECIPE10</span> for 10% Off!</span>
      <Link
        href="/browserecipes"
        className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
      >
        <span>Browse Now</span>
        <FaArrowRight className="text-[10px]" />
      </Link>
    </div>
  </div>
</div>


    // <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white text-xs md:text-sm py-2 overflow-hidden relative z-50 border-b border-orange-500/30">
    //   <div className="flex whitespace-nowrap animate-marquee items-center space-x-8">
        
    //     {/* Banner Content Item 1 */}
    //     <div className="inline-flex items-center space-x-2 font-medium">
    //       <FaTag className="text-yellow-300 animate-bounce" />
    //       <span>🎉 SPECIAL OFFER: Get <strong>10% DISCOUNT</strong> on all premium recipes!</span>
    //       <Link
    //         href="/browserecipes"
    //         className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
    //       >
    //         <span>Claim Offer</span>
    //         <FaArrowRight className="text-[10px]" />
    //       </Link>
    //     </div>

    //     {/* Banner Content Item 2 (To keep seamless loop) */}
    //     <div className="inline-flex items-center space-x-2 font-medium">
    //       <FaTag className="text-yellow-300 animate-bounce" />
    //       <span>🔥 Limited Time Deal: Use Code <span className="bg-black/20 px-1.5 py-0.5 rounded font-mono font-bold text-yellow-300">RECIPE10</span> for 10% Off!</span>
    //       <Link
    //         href="/browserecipes"
    //         className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
    //       >
    //         <span>Browse Now</span>
    //         <FaArrowRight className="text-[10px]" />
    //       </Link>
    //     </div>

    //     {/* Banner Content Item 3 */}
    //     <div className="inline-flex items-center space-x-2 font-medium">
    //       <FaTag className="text-yellow-300 animate-bounce" />
    //       <span>🎉 SPECIAL OFFER: Get <strong>10% DISCOUNT</strong> on all premium recipes!</span>
    //       <Link
    //         href="/browserecipes"
    //         className="inline-flex items-center space-x-1 underline hover:text-yellow-200 transition ml-2 font-bold"
    //       >
    //         <span>Claim Offer</span>
    //         <FaArrowRight className="text-[10px]" />
    //       </Link>
    //     </div>

    //   </div>
    // </div>
  );
};

export default RunningBanner;