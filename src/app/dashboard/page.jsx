









// ok code 
// import React from 'react';
// import { headers } from 'next/headers';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { auth } from '@/lib/auth';
// import { getUserStats } from '@/lib/actions/getUserStats';
// import { getAllUsers } from '@/lib/actions/userActions';
// import { getAllRecipes } from '@/lib/actions/recipeActions';
// import { getAllReports } from '@/lib/actions/reportActions';


// export const dynamic = 'force-dynamic';

// export default async function OverviewPage() {
//   // ১. MyRecipesPage এর মতোই হুবহু সার্ভার সাইড থেকে সেশন নেওয়া হলো
//   const headersList = await headers();
//   const session = await auth.api.getSession({ headers: headersList });
//   const user = session?.user;

//   let statsData = { totalRecipes: 0, totalFavorites: 0, totalLikes: 0 };
//   let adminStatsData = { totalUsers: 0, totalRecipes: 0, premiumMembers: 0, totalReports: 0 };

//   // ২. সেশন অনুযায়ী ডাটা ফেচ করা
//   if (user) {
//     if (user.role === 'admin') {
//       const [usersList, recipesList, reportsList] = await Promise.all([
//         getAllUsers(),
//         getAllRecipes(),
//         getAllReports(),
//       ]);

//       adminStatsData = {
//         totalUsers: Array.isArray(usersList) ? usersList.length : 0,
//         totalRecipes: Array.isArray(recipesList) ? recipesList.length : 0,
//         premiumMembers: Array.isArray(usersList)
//           ? usersList.filter((u) => u.plan === 'pro' || u.plan === 'PRO' || u.plan === 'premium').length
//           : 0,
//         totalReports: Array.isArray(reportsList) ? reportsList.length : 0,
//       };
//     } else {
//       // ইউজার আইডি বা ইমেইল সরাসরি Server Action এ পাঠানো
//       statsData = await getUserStats(user.id, user.email);
//     }
//   }

//   const adminStats = [
//     { title: 'Total Users', count: adminStatsData.totalUsers, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: adminStatsData.totalRecipes, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: adminStatsData.premiumMembers, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: adminStatsData.totalReports, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];

//   const userStats = [
//     { title: 'Total Recipes', count: statsData.totalRecipes, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     // { title: 'Total ', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: statsData.totalLikes, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   clg

//   return (
//     <div className="space-y-8">
     
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
//           {user?.role || 'User'} Dashboard
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <div
//               key={stat.title}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }














  //  ok cdoe 

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import { getUserStats } from '@/lib/actions/getUserStats';
import { getAllUsers } from '@/lib/actions/userActions';
import { getAllRecipes } from '@/lib/actions/recipeActions';
import { getAllReports } from '@/lib/actions/reportActions';

const Overview = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [statsData, setStatsData] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikes: 0,
  });

  const [adminStatsData, setAdminStatsData] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    premiumMembers: 0,
    totalReports: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (user?.role === 'admin') {
        const [usersList, recipesList, reportsList] = await Promise.all([
          getAllUsers(),
          getAllRecipes(),
          getAllReports(),
        ]);

        const totalUsersCount = Array.isArray(usersList) ? usersList.length : 0;
        const totalRecipesCount = Array.isArray(recipesList) ? recipesList.length : 0;
        const totalReportsCount = Array.isArray(reportsList) ? reportsList.length : 0;

        const proMembersCount = Array.isArray(usersList)
          ? usersList.filter((u) => u.plan === 'pro' || u.plan === 'PRO' || u.plan === 'premium').length
          // ? usersList.filter((u) => u.role === 'pro' || u.plan === 'PRO' || u.role === 'premium').length
          : 0;

        setAdminStatsData({
          totalUsers: totalUsersCount,
          totalRecipes: totalRecipesCount,
          premiumMembers: proMembersCount,
          totalReports: totalReportsCount,
        });
      } else if (user?.id || user?.email) {
        const data = await getUserStats(user.id, user.email);
        if (data) setStatsData(data);
      }
    };

    loadStats();
  }, [user]);

  const adminStats = [
    { title: 'Total Users', count: adminStatsData.totalUsers, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
    { title: 'Total Recipes', count: adminStatsData.totalRecipes, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
    { title: 'Premium Members', count: adminStatsData.premiumMembers, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
    { title: 'Total Reports', count: adminStatsData.totalReports, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
  ];

  const userStats = [
    { title: 'Total Recipes', count: statsData.totalRecipes, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
    { title: 'Total Favorites', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
    { title: 'Likes Received', count: statsData.totalLikes, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
  ];

  const stats = user?.role === 'admin' ? adminStats : userStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
          {user?.role || 'User'} Dashboard
        </h1>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System metrics and manage user activities.
        </p> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
                <Icon />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;








// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import { getUserStats } from '@/lib/actions/getUserStats';
// import { getAllUsers } from '@/lib/actions/userActions';
// import { getAllRecipes } from '@/lib/actions/recipeActions'; // ManageRecipes এর Action টি যুক্ত করা হলো

// const Overview = () => {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const [statsData, setStatsData] = useState({
//     totalRecipes: 0,
//     totalFavorites: 0,
//     totalLikes: 0,
//   });

//   const [adminStatsData, setAdminStatsData] = useState({
//     totalUsers: 0,
//     totalRecipes: 0,
//     premiumMembers: 0,
//     totalReports: 0,
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       if (user?.role === 'admin') {
//         // ইউজার এবং রেসিপি তালিকা ফেচ করা
//         const [usersList, recipesList] = await Promise.all([
//           getAllUsers(),
//           getAllRecipes()
//         ]);

//         const totalUsersCount = Array.isArray(usersList) ? usersList.length : 0;
//         const totalRecipesCount = Array.isArray(recipesList) ? recipesList.length : 0;
        
//         const proMembersCount = Array.isArray(usersList)
//           ? usersList.filter((u) => u.role === 'pro' || u.plan === 'PRO' || u.role === 'premium').length
//           : 0;

//         setAdminStatsData((prev) => ({
//           ...prev,
//           totalUsers: totalUsersCount,
//           totalRecipes: totalRecipesCount,
//           premiumMembers: proMembersCount,
//         }));
//       } else if (user?.id || user?.email) {
//         const data = await getUserStats(user.id, user.email);
//         if (data) setStatsData(data);
//       }
//     };

//     loadStats();
//   }, [user]);

//   const adminStats = [
//     { title: 'Total Users', count: adminStatsData.totalUsers, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: adminStatsData.totalRecipes, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: adminStatsData.premiumMembers, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: adminStatsData.totalReports, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];

//   const userStats = [
//     { title: 'Total Recipes', count: statsData.totalRecipes, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: statsData.totalLikes, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
//           {user?.role || 'User'} Dashboard
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           System metrics and manage user activities.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Overview;








// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import { getUserStats } from '@/lib/actions/getUserStats';
// import { getAllUsers } from '@/lib/actions/userActions';

// const Overview = () => {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const [statsData, setStatsData] = useState({
//     totalRecipes: 0,
//     totalFavorites: 0,
//     totalLikes: 0,
//   });

//   const [adminStatsData, setAdminStatsData] = useState({
//     totalUsers: 0,
//     totalRecipes: 0,
//     premiumMembers: 0,
//     totalReports: 0,
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       if (user?.role === 'admin') {
//         const usersList = await getAllUsers();
//         if (Array.isArray(usersList)) {
//           const proMembers = usersList.filter(
//             (u) => u.role === 'pro' || u.plan === 'PRO' || u.role === 'premium'
//           ).length;

//           setAdminStatsData((prev) => ({
//             ...prev,
//             totalUsers: usersList.length,
//             premiumMembers: proMembers,
//           }));
//         }
//       } else if (user?.id || user?.email) {
//         const data = await getUserStats(user.id, user.email);
//         if (data) setStatsData(data);
//       }
//     };

//     loadStats();
//   }, [user]);

//   const adminStats = [
//     { title: 'Total Users', count: adminStatsData.totalUsers, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: adminStatsData.totalRecipes, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: adminStatsData.premiumMembers, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: adminStatsData.totalReports, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];

//   const userStats = [
//     { title: 'Total Recipes', count: statsData.totalRecipes, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: statsData.totalLikes, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
//           {user?.role || 'User'} Dashboard
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           System metrics and manage user activities.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Overview;



// ok code


// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import { getUserStats } from '@/lib/actions/getUserStats';

// const Overview = () => {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const [statsData, setStatsData] = useState({
//     totalRecipes: 0,
//     totalFavorites: 0,
//     totalLikes: 0,
//   });

//   useEffect(() => {
//     if (user?.id || user?.email) {
//       getUserStats(user.id, user.email).then((data) => {
//         setStatsData(data);
//       });
//     }
//   }, [user]);

//   const adminStats = [
//     { title: 'Total Users', count: 1250, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: 840, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: 195, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: 14, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];

//   const userStats = [
//     { title: 'Total Recipes', count: statsData.totalRecipes, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: statsData.totalFavorites, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: statsData.totalLikes, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
//           {user?.role || 'User'} Dashboard
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           System metrics and manage user activities.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Overview;








// ok code 
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';
// import { getUserRecipeCount } from '@/lib/actions/getRecipeCount';

// const Overview = () => {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;
//   const [recipeCount, setRecipeCount] = useState(0);

//   useEffect(() => {
//     if (user?.id || user?.email) {
//       getUserRecipeCount(user.id, user.email).then(count => setRecipeCount(count));
//     }
//   }, [user]);

//   const adminStats = [
//     { title: 'Total Users', count: 1250, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: 840, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: 195, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: 14, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];

//   const userStats = [
//     { title: 'Total Recipes', count: recipeCount, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: 3, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: 5, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
//           {user?.role || 'User'} Dashboard
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           System metrics and manage user activities.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Overview;




// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaUsers, FaUtensils, FaCrown, FaFlag, FaBookmark, FaHeart } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client';

// const Overview = () => {
//    const { data: session } = authClient.useSession();
//     const user = session?.user;





    
  
//     console.log(user);
//   const adminStats= [
//     { title: 'Total Users', count: 1250, icon: FaUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Recipes', count: 840, icon: FaUtensils, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Premium Members', count: 195, icon: FaCrown, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
//     { title: 'Total Reports', count: 14, icon: FaFlag, color: 'text-red-500 bg-red-100 dark:bg-red-950/60' },
//   ];
//   const userStats = [
//     { title: 'Total Recipes', count: 6, icon: FaUtensils, color: 'text-blue-500 bg-blue-100 dark:bg-blue-950/60' },
//     { title: 'Total Favorites', count: 3, icon: FaBookmark, color: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60' },
//     { title: 'Likes Received', count: 5, icon: FaHeart, color: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60' },
    
//   ];

//   const stats = user?.role === 'admin' ? adminStats : userStats;

//   console.log(user);

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white"> {user?.role} Dashboard</h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           System metrics and manage user activities.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4"
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
//                 <Icon />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{stat.title}</p>
//                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Overview;