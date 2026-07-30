

'use client';

import React from 'react';
import { authClient } from '@/lib/auth-client'; // আপনার authClient এর সঠিক পাথ নিশ্চিত করুন
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, isPending, error } = authClient.useSession();

  // ১. ডাটা লোড হওয়ার সময় লোডার
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-mono">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading Profile Data...</p>
        </div>
      </div>
    );
  }

  // ২. লগইন না থাকলে অ্যাক্সেস দেওয়া হবে না
  if (!session) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-[#090d16] border border-white/10 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white font-mono">Access Denied</h2>
          <p className="text-xs text-gray-400">
            You need to be logged in to view your profile details.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-xl transition text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#030712] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-orange-500">
            Chef Identity Protocol
          </p>
          <h1 className="text-3xl font-extrabold text-white mt-1">User Profile</h1>
        </div>

        {/* Main Profile Card */}
        <div className="bg-[#090d16] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
          
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'Profile'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-orange-500/80 shadow-lg shadow-orange-500/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-600/20 border-2 border-orange-500 flex items-center justify-center text-orange-500 text-3xl font-bold font-mono">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#090d16] rounded-full"></span>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-orange-400">
                Verified Chef Member
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#030712] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 uppercase">User ID</span>
              <p className="text-gray-200 font-sans truncate">{user?.id || 'N/A'}</p>
            </div>

            <div className="bg-[#030712] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 uppercase">Email Status</span>
              <p className="text-emerald-400 font-sans">
                {user?.emailVerified ? 'Verified' : 'Active (Password Auth)'}
              </p>
            </div>

            <div className="bg-[#030712] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 uppercase">Account Created</span>
              <p className="text-gray-200 font-sans">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>

            <div className="bg-[#030712] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-500 uppercase">Auth Provider</span>
              <p className="text-orange-400 font-sans">Better-Auth (Credentials)</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/user/userdashboard"
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium transition text-xs"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = '/login';
                    },
                  },
                });
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-medium transition text-xs"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}


