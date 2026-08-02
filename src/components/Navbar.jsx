




'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 💡 ১. usePathname ইম্পোর্ট করা হলো
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


      const pathname = usePathname();
  
  // /dashboard দিয়ে শুরু হওয়া সমস্ত রাউটের জন্য নেভবার বন্ধ থাকবে
  if (pathname.startsWith("/dashboard")) {
    return null;
  }





  
  // 💡 ২. বর্তমান পাথ বের করার জন্য
  // const pathname = usePathname();
  // console.log(pathname);
  // if(pathname=="/user/userdashboard"|| pathname=="/admin" || pathname=="/dashboard" ){
  //   return null; // যদি ইউজার ড্যাশবোর্ড পেজে থাকি, তাহলে নেভবার রেন্ডার হবে না
  // }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/login';
        },
      },
    });
  };

  // 💡 ৩. ডায়নামিক ক্লাস তৈরির হেলপার ফাংশন
  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "text-orange-600 dark:text-orange-500 font-bold  pb-1 transition"
      : "text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition";
      // ? "text-orange-600 dark:text-orange-500 font-bold border-b-2 border-orange-600 dark:border-orange-500 pb-1 transition"
      // : "text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition";
  };

  const getMobileLinkClass = (path) => {
    const isActive = pathname === path;
    return isActive
      ? "block text-orange-600 dark:text-orange-500 font-bold pl-2 "
      : "block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium";
      // ? "block text-orange-600 dark:text-orange-500 font-bold pl-2 border-l-4 border-orange-600"
      // : "block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ১. লোগো (Logo) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500">
              Recipe<span className="text-gray-900 dark:text-white">House</span>
            </Link>
          </div>

          {/* ২. পাবলিক ও প্রাইভেট রুটস (Desktop Navigation) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={getLinkClass('/')}>
              Home
            </Link>

            <Link href="/browserecipes" className={getLinkClass('/browserecipes')}>
              Browse Recipes
            </Link>

            {/* ইউজার লগইন থাকলে প্রাইভেট লিংকসমূহ দেখাবে */}
            {session && (
              <>
                <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                  Dashboard
                </Link>

                {/* <Link href="/profile" className={getLinkClass('/profile')}>
                  Profile
                </Link> */}
              </>
            )}
          </div>

          {/* ৩. রাইট সাইড - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isPending ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            ) : !session ? (
              <>
                <Link href="/login" className={getLinkClass('/login')}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full border border-orange-500 object-cover"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {session.user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition text-xs"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* ৪. মোবাইল মেনু বাটন */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-orange-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ৫. মোবাইল ডিভাইসের জন্য মেনু ভিউ */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-3">
          <Link href="/" className={getMobileLinkClass('/')}>
            Home
          </Link>
          <Link href="/browserecipes" className={getMobileLinkClass('/browserecipes')}>
            Browse Recipes
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className={getMobileLinkClass('/dashboard')}>
                Dashboard
              </Link>
              {/* <Link href="/profile" className={getMobileLinkClass('/profile')}>
                Profile
              </Link> */}
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 font-medium pt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
              <Link href="/login" className={getMobileLinkClass('/login')}>
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-orange-600 text-white text-center py-2 rounded-lg font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

















// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { authClient } from '@/lib/auth-client'; // আপনার authClient-এর সঠিক পাথ দিন

// const Navbar = () => {
//   // Better Auth থেকে সেশন ও ইউজার ডাটা রিড করা
//   const { data: session, isPending } = authClient.useSession();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           window.location.href = '/login'; // সাইন-আউট শেষে লগইন পেজে রিডাইরেক্ট
//         },
//       },
//     });
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* ১. লোগো (Logo) */}
//           <div className="flex-shrink-0 flex items-center">
//             <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500">
//               Recipe<span className="text-gray-900 dark:text-white">House</span>
//             </Link>
//           </div>

//           {/* ২. পাবলিক ও প্রাইভেট রুটস (Desktop Navigation) */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link
//               href="/"
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//             >
//               Home
//             </Link>

//             <Link
//               href="/browserecipes"
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//             >
//               Browse Recipes
//             </Link>

//             {/* ইউজার লগইন থাকলে প্রাইভেট লিংকসমূহ দেখাবে */}
//             {session && (
//               <>
//                 <Link
//                   href="/user/userdashboard"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//                 >
//                   Dashboard
//                 </Link>

//                 <Link
//                   href="/profile"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//                 >
//                   Profile
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* ৩. রাইট সাইড - Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {isPending ? (
//               // লোডিং স্টেট
//               <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
//             ) : !session ? (
//               // 💡 ইউজার লগইন না থাকলে: Login এবং Register দেখাবে
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium px-3 py-2 transition"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition"
//                 >
//                   Register
//                 </Link>
//               </>
//             ) : (
//               // 💡 ইউজার লগইন থাকলে: প্রোফাইল ইনফো ও Logout বাটন দেখাবে (Register লুকানো থাকবে)
//               <div className="flex items-center space-x-3">
//                 {session.user?.image && (
//                   <img
//                     src={session.user.image}
//                     alt={session.user.name || 'User'}
//                     className="w-8 h-8 rounded-full border border-orange-500 object-cover"
//                   />
//                 )}
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                   {session.user?.name}
//                 </span>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition text-xs"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* ৪. মোবাইল মেনু বাটন (Responsive Hamburger Menu) */}
//           <div className="flex md:hidden items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 focus:outline-none"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 {isMobileMenuOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ৫. মোবাইল ডিভাইসের জন্য মেনু ভিউ */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-3">
//           <Link
//             href="/"
//             className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//           >
//             Home
//           </Link>
//           <Link
//             href="/browserecipes"
//             className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//           >
//             Browse Recipes
//           </Link>

//           {session ? (
//             <>
//               <Link
//                 href="/user/userdashboard"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 href="/profile"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left text-red-600 font-medium pt-2"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
//               <Link
//                 href="/login"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 className="block bg-orange-600 text-white text-center py-2 rounded-lg font-medium"
//               >
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;




// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link'; // React Router ব্যবহার করলে 'react-router-dom' থেকে Link আনবেন

// const Navbar = () => {
//   // উদাহরণ হিসেবে loggedIn ধরে নেওয়া হয়েছে। 
//   // আপনার Auth State (যেমন: Firebase / Better-Auth / Context) দিয়ে এটি রিপ্লেস করবেন।
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleLogin = () => {
//     setIsLoggedIn(!isLoggedIn); // ডেমো টেস্ট করার জন্য
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
          
//           {/* ১. লোগো (Logo) */}
//           <div className="flex-shrink-0 flex items-center">
//             <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500">
//               Recipe<span className="text-gray-900 dark:text-white">House</span>
//             </Link>
//           </div>

//           {/* ২. পাবলিক ও প্রাইভেট রুটস (Desktop Navigation) */}
//           <div className="hidden md:flex items-center space-x-6">
//             {/* Public Routes */}
//             <Link
//               href="/"
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//             >
//               Home
//             </Link>

//             <Link
//               href="/browserecipes"
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//             >
//               Browse Recipes
//             </Link>

//             {/* Authenticated / Protected Routes (শুধু লগইন থাকলে দেখাবে) */}
//             {isLoggedIn && (
//               <>
//                 <Link
//                   href="/dashboard"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//                 >
//                   Dashboard
//                 </Link>

//                 <Link
//                   href="/profile"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium transition"
//                 >
//                   Profile
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* ৩. রাইট সাইড - Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {!isLoggedIn ? (
//               <>
//                 <Link
//                   href="/login"
//                   className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-500 font-medium px-3 py-2 transition"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition"
//                 >
//                   Register
//                 </Link>
//               </>
//             ) : (
//               <button
//                 onClick={toggleLogin}
//                 className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition"
//               >
//                 Logout
//               </button>
//             )}

//             {/* টেস্ট করার জন্য ডেমো টগল বাটন (পরে মুছে ফেলবেন) */}
//             <button 
//               onClick={toggleLogin} 
//               className="text-xs text-gray-400 underline ml-2"
//             >
//               ({isLoggedIn ? 'Simulate Logout' : 'Simulate Login'})
//             </button>
//           </div>

//           {/* ৪. মোবাইল মেনু বাটন (Responsive Hamburger Menu) */}
//           <div className="flex md:hidden items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-gray-700 dark:text-gray-200 hover:text-orange-600 focus:outline-none"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 {isMobileMenuOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ৫. মোবাইল ডিভাইসের জন্য মেনু ভিউ */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-3">
//           <Link
//             href="/"
//             className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//           >
//             Home
//           </Link>
//           <Link
//             href="/recipes"
//             className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//           >
//             Browse Recipes
//           </Link>

//           {isLoggedIn ? (
//             <>
//               <Link
//                 href="/dashboard"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 href="/profile"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Profile
//               </Link>
//               <button
//                 onClick={toggleLogin}
//                 className="w-full text-left text-red-600 font-medium pt-2"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
//               <Link
//                 href="/login"
//                 className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-medium"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/register"
//                 className="block bg-orange-600 text-white text-center py-2 rounded-lg font-medium"
//               >
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;