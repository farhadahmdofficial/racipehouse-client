



'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client'; // আপনার Better Auth ক্লায়েন্ট ফাইল ইম্পোর্ট করুন

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // পাসওয়ার্ড ভ্যালিডেশন রুলস Check
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    return null;
  };

  // ১. Email and Password দিয়ে রেজিস্টার করার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // পাসওয়ার্ড ভ্যালিডেশন চেক
    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);

    try {
      // Better Auth এর signUp call
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image || undefined, // ছবি না দিলে undefined
      });

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.');
      } else {
        // সফলভাবে রেজিস্টার হলে হোমপেজে বা ড্যাশবোর্ডে রিডাইরেক্ট করবে
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ২. Google OAuth দিয়ে সাইন-ইন করার ফাংশন
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/', // লগইন সফল হলে যেখানে রিডাইরেক্ট হবে
      });
    } catch (err) {
      setError('Failed to log in with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join RecipeHouse and start sharing your food magic
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <FaImage className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Must contain 6+ chars, 1 uppercase & 1 lowercase letter.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-xl transition"
        >
          <FaGoogle className="text-red-500" />
          <span>Google Sign In</span>
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
















// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from 'react-icons/fa';

// const RegisterPage = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     image: '',
//     password: '',
//   });
//   const [error, setError] = useState('');

//   // পাসওয়ার্ড ভ্যালিডেশন রুলস Check
//   const validatePassword = (password) => {
//     if (password.length < 6) {
//       return 'Password must be at least 6 characters long.';
//     }
//     if (!/[A-Z]/.test(password)) {
//       return 'Password must contain at least one uppercase letter.';
//     }
//     if (!/[a-z]/.test(password)) {
//       return 'Password must contain at least one lowercase letter.';
//     }
//     return null;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     // পাসওয়ার্ড ভ্যালিডেশন কল
//     const pwdError = validatePassword(formData.password);
//     if (pwdError) {
//       setError(pwdError);
//       return;
//     }

//     // Auth API Call / Firebase Integration
//     alert('Registration successful!');
//     router.push('/');
//   };

//   const handleGoogleLogin = () => {
//     // Google Login logic
//     alert('Redirecting to Google Sign In...');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
//       >
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             Create an Account
//           </h2>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Join RecipeHouse and start sharing your food magic
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name Field */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Full Name
//             </label>
//             <div className="relative">
//               <FaUser className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="John Doe"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//           </div>

//           {/* Email Field */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Email Address
//             </label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="you@example.com"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//           </div>

//           {/* Image URL Field */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Profile Image URL
//             </label>
//             <div className="relative">
//               <FaImage className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="url"
//                 required
//                 value={formData.image}
//                 onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//                 placeholder="https://example.com/photo.jpg"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="password"
//                 required
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//             <p className="text-[11px] text-gray-500 mt-1">
//               Must contain 6+ chars, 1 uppercase & 1 lowercase letter.
//             </p>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
//           >
//             Register Account
//           </button>
//         </form>

//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">Or continue with</span>
//           </div>
//         </div>

//         {/* Google Login */}
//         <button
//           onClick={handleGoogleLogin}
//           type="button"
//           className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-xl transition"
//         >
//           <FaGoogle className="text-red-500" />
//           <span>Google Sign In</span>
//         </button>

//         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Already have an account?{' '}
//           <Link href="/login" className="text-orange-600 font-semibold hover:underline">
//             Log in
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default RegisterPage;