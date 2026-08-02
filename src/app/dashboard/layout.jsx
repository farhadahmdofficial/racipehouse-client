

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaChartBar, 
  FaUsers, 
  FaUtensils, 
  FaHome, 
  FaFileAlt, 
  FaShoppingBag, 
  FaPlusCircle, 
  FaThList, 
  FaHeart, 
  FaUser 
} from 'react-icons/fa';
import { authClient } from '@/lib/auth-client'; // 👈 আপনার auth-client বা সেশন হুক

const adminLinks = [
  { name: 'Overview', href: '/dashboard', icon: FaChartBar },
  { name: 'Manage Users', href: '/dashboard/admin/manageusers', icon: FaUsers },
  { name: 'Manage Recipes', href: '/dashboard/admin/managerecipes', icon: FaUtensils },
  { name: 'Review Reports', href: '/dashboard/admin/reports', icon: FaFileAlt },
  { name: 'Profile', href: '/dashboard/profile', icon: FaUser }, // 👈 Profile added
];

const userLinks = [
  { name: 'Dashboard Overview', href: '/dashboard', icon: FaHome },
  { name: 'Add Recipe', href: '/dashboard/users/addrecipe', icon: FaPlusCircle },
  { name: 'My Recipes', href: '/dashboard/users/myrecipes', icon: FaThList },
  { name: 'Purchased Recipes', href: '/dashboard/users/mypurchased', icon: FaShoppingBag },
  { name: 'Favorites', href: '/dashboard/users/favorites', icon: FaHeart },
  { name: 'Profile', href: '/dashboard/profile', icon: FaUser }, // 👈 Profile added
];

const getLinks = (user) => {
  if (user?.role === 'admin') {
    return adminLinks;
  }
  return userLinks;
};

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  
  // 1. Session থেকে user ডাটা নেওয়া
  const { data: session } = authClient.useSession();
  const user = session?.user;

  console.log(user);

  // 2. ⚠️ সংশোধন: getLinks(user) ফাংশনটি কল করা হয়েছে এবং Fallback (|| []) দেওয়া হয়েছে
  const links = getLinks(user) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-orange-600">RecipeHouse</span>
          <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
            {user?.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition"
          >
            <FaHome /> Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;






// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { FaChartBar, FaUsers, FaUtensils, FaHome, FaFileAlt, FaShoppingBag, FaPlusCircle, FaThList, FaHeart } from 'react-icons/fa';

// const DashboardLayout = ({ children }) => {
//   const pathname = usePathname();

//   // const links = [
//   //   { name: 'Overview', href: '/admin', icon: FaChartBar },
//   //   { name: 'Manage Users', href: '/admin/users', icon: FaUsers },
//   //   { name: 'Manage Recipes', href: '/admin/recipes', icon: FaUtensils },
//   //   { name: 'Review reports', href: '/admin/reports', icon: FaFileAlt },
    
//   // ];

//    const adminLinks = [
//   { name: 'Overview', href: '/admin', icon: FaChartBar },
//   { name: 'Manage Users', href: '/admin/users', icon: FaUsers },
//   { name: 'Manage Recipes', href: '/admin/recipes', icon: FaUtensils },
//   { name: 'Review Reports', href: '/admin/reports', icon: FaFileAlt },
// ];



//  const userLinks = [
//   { name: 'Dashboard Overview', href: '/dashboard', icon: FaHome },
//   { name: 'Add Recipe', href: '/dashboard/add-recipe', icon: FaPlusCircle },
//   { name: 'My Recipes', href: '/dashboard/my-recipes', icon: FaThList },
//   { name: 'Purchased Recipes', href: '/dashboard/purchased', icon: FaShoppingBag },
//   { name: 'Favorites', href: '/dashboard/favorites', icon: FaHeart },
// ];

// const getLinks = (user) => {
//   if (user?.role === 'admin') {
//     return adminLinks;
//   }
//   return userLinks;
// };

// const links = getLinks


//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
//       {/* Sidebar */}
//       <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 space-y-8">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl font-black text-orange-600">RecipeHouse</span>
//           <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-bold">ADMIN USER</span>
//         </div>

//         <nav className="space-y-1">
//           {links.map((link) => {
//             const Icon = link.icon;
//             const isActive = pathname === link.href;
//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
//                   isActive
//                     ? 'bg-orange-600 text-white shadow-md'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
//                 }`}
//               >
//                 <Icon />
//                 <span>{link.name}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
//           <Link
//             href="/"
//             className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition"
//           >
//             <FaHome /> Back to Main Site
//           </Link>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 sm:p-10">{children}</main>
//     </div>
//   );
// };

// export default DashboardLayout;