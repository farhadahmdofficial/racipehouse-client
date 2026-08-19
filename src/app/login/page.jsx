

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authClient } from "@/lib/auth-client"; 
import toast from 'react-hot-toast';

// 1. মূল ফরম এবং লজিক আলাদা কম্পোনেন্টে রাখা হলো
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const intendedRoute = searchParams.get('redirect') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const logingdata = Object.fromEntries(formdata.entries());

    const { data, error } = await authClient.signIn.email({
      ...logingdata,
    });

    if (error) {
      toast.error('Login failed', {
        style: {
          border: '1px solid #f43f5e',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px'
        },
      });
      return;
    }

    toast.success(' Successful Login ', {
      style: {
        border: '1px solid #00ffcc',
        padding: '16px',
        color: '#fff',
        background: '#090d16',
        fontFamily: 'monospace',
        fontSize: '12px'
      },
    });

    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    try {
      toast.success('Google Login...', {
        style: {
          border: '1px solid #00ffcc',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px'
        },
      });

      const fullCallbackURL = `${window.location.origin}/`;

      await authClient.signIn.social({
        provider: "google",
        callbackURL: fullCallbackURL,
      });

    } catch (error) {
      console.error("Google login error:", error);
      toast.error('Google Login Failed!', {
        style: {
          border: '1px solid #f43f5e',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px'
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Log in to manage your recipes and dashboard
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Field 1: Email */}
        <div className="space-y-1">
          <label className="block font-mono text-[12px] uppercase tracking-widest text-gray-400">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-500 text-xs" />
            <input
              type="email"
              name="email"
              required
              placeholder="name@domain.com"
              className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
            />
          </div>
        </div>

        {/* Field 2: Password */}
        <div className="space-y-1">
          <label className="block font-mono text-[12px] uppercase tracking-widest text-gray-400">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-xs" />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-[#030712] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-500 hover:text-[#00ffcc] text-xs transition-colors focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
          >
            Login
          </button>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white  px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-xl transition"
      >
        <FaGoogle className="text-red-500" />
        <span>Google Sign In</span>
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-orange-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};

// 2. Main Export-এ Suspense দিয়ে Wrap করা হয়েছে
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Suspense fallback={<div className="text-white text-sm font-mono">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;














// ok code 


// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FaEnvelope, FaLock, FaGoogle,FaEye, FaEyeSlash } from 'react-icons/fa';
// import { authClient} from "@/lib/auth-client"; 
// import toast from 'react-hot-toast';
// // import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const intendedRoute = searchParams.get('redirect') || '/'; // Intended route or fallback to Home

//   // const [email, setEmail] = useState('');
//   // const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {


//      e.preventDefault();
//         const formdata = new FormData(e.target);
          
    
//           const logingdata = Object.fromEntries(formdata.entries());
              
    
//           const { data, error } = await authClient.signIn.email({
//             ...logingdata,
    
            
           
//           });
     
    
//           // console.log(data);


//           // const { data: tokenData } = await authClient.token()
//           // console.log(tokenData);

          
    
//           if (error) {
//             toast.error('Login failed', {
//               style: {
//                 border: '1px solid #f43f5e',
//                 padding: '16px',
//                 color: '#fff',
//                 background: '#090d16',
//                 fontFamily: 'monospace',
//                 fontSize: '12px'
//               },
            
//             });
//             return ;
//           }
    
    
//       //   
    
//        toast.success(' Successful Login ', {
//               style: {
//                 border: '1px solid #00ffcc',
//                 padding: '16px',
//                 color: '#fff',
//                 background: '#090d16',
//                 fontFamily: 'monospace',
//                 fontSize: '12px'
//               },
//             });
    
    
//             setTimeout(() => {
//               router.push('/');
//              }, 1500);
//   };

//   // const handleCredentialLogin = (e) => {
//   //   e.preventDefault();
//   //   alert('Logged in successfully!');
//   //   router.push(intendedRoute); // Redirecting to intended route
//   // };

//   // const handleGoogleLogin = () => {
   
//   // };
//   const handleGoogleLogin = async () => {
//   try {
//     toast.success('Google Login...', {
//       style: {
//         border: '1px solid #00ffcc',
//         padding: '16px',
//         color: '#fff',
//         background: '#090d16',
//         fontFamily: 'monospace',
//         fontSize: '12px'
//       },
//     });

//     // 💡 window.location.origin ব্যবহারের ফলে এটি http://localhost:3000/ তৈরি করবে
//     const fullCallbackURL = `${window.location.origin}/`;

//     await authClient.signIn.social({
//       provider: "google",
//       callbackURL: fullCallbackURL, // 👈 এখানে ফুল URL দেওয়া হলো
//     });

//   } catch (error) {
//     console.error("Google login error:", error);
//     toast.error('Google Login Failed!', {
//       style: {
//         border: '1px solid #f43f5e',
//         padding: '16px',
//         color: '#fff',
//         background: '#090d16',
//         fontFamily: 'monospace',
//         fontSize: '12px'
//       },
//     });
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
//       >
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             Welcome Back
//           </h2>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//             Log in to manage your recipes and dashboard
//           </p>
//         </div>


//         <form onSubmit={handleLogin} className="space-y-4">
//   {/* Field 1: Email */}
//   <div className="space-y-1">
//     <label className="block font-mono text-[12px] uppercase tracking-widest text-gray-400">
//       Email
//     </label>
//     <div className="relative">
//       <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-500 text-xs" />
//       <input
//         type="email"
//         name="email"
//         required
//         placeholder="name@domain.com"
//         className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//       />
//     </div>
//   </div>

//   {/* Field 2: Password */}

//   <div className="space-y-1">
//       <label className="block font-mono text-[12px] uppercase tracking-widest text-gray-400">
//         Password
//       </label>
//       <div className="relative">
//         {/* বাম পাশের লক আইকন */}
//         <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-xs" />

//         <input
//           type={showPassword ? 'text' : 'password'} // টগল স্টেট অনুযায়ী টাইপ পরিবর্তন হবে
//           name="password"
//           required
//           placeholder="••••••••"
//           className="w-full pl-10 pr-10 py-2.5 bg-[#030712] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//         />

//         {/* ডান পাশের শো/হাইড চোখের আইকন বাটন */}
//         <button
//           type="button" // ফরম যাতে অনাকাঙ্ক্ষিতভাবে সাবমিট না হয়
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3.5 top-3.5 text-gray-500 hover:text-[#00ffcc] text-xs transition-colors focus:outline-none"
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </button>
//       </div>
//     </div>



//   {/* <div className="space-y-1">
//     <label className="block font-mono text-[12px] uppercase tracking-widest text-gray-400">
//       Password
//     </label>
//     <div className="relative">
//       <FaLock className="absolute left-3.5 top-3.5 text-gray-500 text-xs" />
      
//       <input
//         type="password"
//         name="password"
//         required
//         placeholder="••••••••"
//         className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//       />
//     </div>
//   </div> */}

//   {/* LOGIN BUTTON */}
//   <div className="pt-2">
//     <button
//       type="submit"
//       className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
//       // className="w-full bg-[#00ffcc] text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl hover:bg-[#00ffcc]/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(0,255,204,0.1)] hover:shadow-[0_0_25px_rgba(0,255,204,0.3)]"
//     >
//       Login
//     </button>
//   </div>
// </form>

//         {/* <form onSubmit={handleCredentialLogin} className="space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Email Address
//             </label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
//           >
//             Log In
//           </button>
//         </form> */}

//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white  px-2 text-gray-400">Or continue with</span>
//           </div>
//         </div>

//         <button
//           onClick={handleGoogleLogin}
//           type="button"
//           className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-xl transition"
//         >
//           <FaGoogle className="text-red-500" />
//           <span>Google Sign In</span>
//         </button>

//         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Don&apos;t have an account?{' '}
//           <Link href="/register" className="text-orange-600 font-semibold hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;