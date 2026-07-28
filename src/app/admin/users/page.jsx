'use client';

import React, { useState } from 'react';
import { FaBan, FaCheck, FaCrown } from 'react-icons/fa';

const initialUsers = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', isPremium: true, isBlocked: false },
  { _id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'User', isPremium: false, isBlocked: false },
  { _id: '3', name: 'Mark Wilson', email: 'mark@example.com', role: 'User', isPremium: false, isBlocked: true },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlockStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase font-semibold">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                <td className="py-4 px-6 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{user.name}</span>
                  {user.isPremium && <FaCrown className="text-amber-500 text-xs" />}
                </td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="py-4 px-6">
                  {user.isBlocked ? (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Blocked</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toggleBlockStatus(user._id)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1.5 ml-auto ${
                      user.isBlocked
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {user.isBlocked ? <><FaCheck /> Unblock</> : <><FaBan /> Block</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;