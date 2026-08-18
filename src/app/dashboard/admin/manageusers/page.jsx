


'use client';

import { getAllUsers , toggleUserBlockStatus } from '@/lib/actions/userActions';
import React, { useEffect, useState } from 'react';
import { FaBan, FaCheck, FaCrown, FaSpinner } from 'react-icons/fa';
// import { getAllUsers, toggleUserBlockStatus } from '@lib/actions/userActions';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, isBlocked) => {
    setUpdatingId(userId);
    const res = await toggleUserBlockStatus(userId, isBlocked);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: !isBlocked } : u))
      );
    } else {
      alert('Failed to update status');
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-3xl text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
          Total Users: {users.length}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase font-semibold">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Plan / Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {users.map((user) => {
              const isPro = user.plan === 'pro' || user.isPremium;

              return (
                <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img
                      src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                      alt={user.name || "User"}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex items-center gap-1.5">
                      <span>{user.name || "No Name"}</span>
                      {isPro && <FaCrown className="text-amber-500 text-xs" title="Pro User" />}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      isPro 
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {user.plan ? user.plan.toUpperCase() : user.role || 'FREE'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.isBlocked ? (
                      <span className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Blocked
                      </span>
                    ) : (
                      <span className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                      disabled={updatingId === user._id}
                      className={`px-3 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer ${
                        user.isBlocked
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } disabled:opacity-50`}
                    >
                      {updatingId === user._id ? (
                        <FaSpinner className="animate-spin" />
                      ) : user.isBlocked ? (
                        <><FaCheck /> Unblock</>
                      ) : (
                        <><FaBan /> Block</>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;















// 'use client';

// import React, { useState } from 'react';
// import { FaBan, FaCheck, FaCrown } from 'react-icons/fa';

// const initialUsers = [
//   { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', isPremium: true, isBlocked: false },
//   { _id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', isPremium: false, isBlocked: false },
//   { _id: '3', name: 'Mark Wilson', email: 'mark@example.com', role: 'User', isPremium: false, isBlocked: true },
// ];

// const ManageUsers = () => {
//   const [users, setUsers] = useState(initialUsers);

//   const toggleBlockStatus = (userId) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((u) =>
//         u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
//       )
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>

//       <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase font-semibold">
//               <th className="py-4 px-6">User</th>
//               <th className="py-4 px-6">Email</th>
//               <th className="py-4 px-6">Status</th>
//               <th className="py-4 px-6 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
//             {users.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
//                 <td className="py-4 px-6 font-medium text-gray-900 dark:text-white flex items-center gap-2">
//                   <span>{user.name}</span>
//                   {user.isPremium && <FaCrown className="text-amber-500 text-xs" />}
//                 </td>
//                 <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
//                 <td className="py-4 px-6">
//                   {user.isBlocked ? (
//                     <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Blocked</span>
//                   ) : (
//                     <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
//                   )}
//                 </td>
//                 <td className="py-4 px-6 text-right">
//                   <button
//                     onClick={() => toggleBlockStatus(user._id)}
//                     className={`px-3 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1.5 ml-auto ${
//                       user.isBlocked
//                         ? 'bg-green-600 hover:bg-green-700 text-white'
//                         : 'bg-red-600 hover:bg-red-700 text-white'
//                     }`}
//                   >
//                     {user.isBlocked ? <><FaCheck /> Unblock</> : <><FaBan /> Block</>}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageUsers;