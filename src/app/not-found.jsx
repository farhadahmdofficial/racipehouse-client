



// src/app/not-found.jsx
'use client';

import Link from 'next/link';
import { FaHome, FaUtensils } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-5">
        <div className="text-7xl font-extrabold text-orange-500 flex justify-center items-center gap-3">
          <FaUtensils />
          <span>404</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-md"
          >
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}