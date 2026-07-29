



'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client'; // 💡signUp ইমপোর্ট সরিয়ে শুধু authClient রাখা হয়েছে
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaUtensils } from 'react-icons/fa';

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData(e.target);
    const name = formdata.get('name');
    const email = formdata.get('email');
    const password = formdata.get('password');
    const image = formdata.get('image')?.toString().trim();

    // 💡 explicit অবজেক্ট পেলোড তৈরি
    const payload = {
      email,
      password,
      name,
    };

    if (image && image.length > 0) {
      payload.image = image;
    }

    try {
      // ✅ Better Auth client call
      const { data, error } = await authClient.signUp.email(payload);

      if (error) {
        toast.error(error.message || 'Registration failed', {
          style: {
            border: '1px solid #f43f5e',
            padding: '16px',
            color: '#fff',
            background: '#090d16',
            fontFamily: 'monospace',
            fontSize: '12px',
          },
        });
        return;
      }

      toast.success('Registration Successful!', {
        style: {
          border: '1px solid #00ffcc',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px',
        },
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err) {
      console.error('Registration exception:', err);
      toast.error('An unexpected error occurred.', {
        style: {
          border: '1px solid #f43f5e',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast.success('Redirecting to Google Sign In...', {
        style: {
          border: '1px solid #f97316',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px',
        },
      });

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google Login Failed!', {
        style: {
          border: '1px solid #f43f5e',
          padding: '16px',
          color: '#fff',
          background: '#090d16',
          fontFamily: 'monospace',
          fontSize: '12px',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#090d16]/70 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative z-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase border-b border-orange-500/30 pb-1">
            <FaUtensils className="text-orange-500" /> RecipeHouse Protocol
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Create <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">Account</span>
          </h1>
          <p className="text-xs text-gray-400">
            Join our community to discover and share delicious recipes.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Chef / User Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Farhad Ahmed"
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="your-email@example.com"
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Avatar / Photo URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://images.com/profile.jpg"
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full bg-[#030712] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
            >
              {loading ? 'Creating Profile...' : 'Register Account'}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-[#090d16] px-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-bold text-xs tracking-wide py-3 rounded-xl hover:bg-white/[0.08] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.74 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.75-4.9 3.75-8.53z"
            />
            <path
              fill="#FBBC05"
              d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.4 0 11.63 0 14s.54 4.6 1.5 6.5l3.6-2.8z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.26 0-5.99-2.1-6.98-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-gray-500 font-mono">
          Already a member?{' '}
          <Link href="/login" className="text-orange-400 hover:underline font-bold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;








// 'use client';

// import { useState } from 'react';
// import { authClient, signUp } from '@/lib/auth-client';
// // import { authClient } from "@/lib/auth-client";
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { toast } from 'react-hot-toast';
// import { FaEye, FaEyeSlash, FaUtensils } from 'react-icons/fa';

// const Register = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formdata = new FormData(e.target);
//     const registerData = Object.fromEntries(formdata.entries());

//     // 💡 image ফিল্ড ফাকা থাকলে তা বাদ দেওয়া ভালো যেন URL validation fail না করে
//     if (!registerData.image || registerData.image.trim() === '') {
//       delete registerData.image;
//     }

//     try {
//       // ✅ signUp.email এর বদলে authClient.signUp.email
//       const { data, error } = await authClient.signUp.email({
//         ...registerData,
//       });

//       if (error) {
//         toast.error(error.message || 'Registration failed', {
//           style: {
//             border: '1px solid #f43f5e',
//             padding: '16px',
//             color: '#fff',
//             background: '#090d16',
//             fontFamily: 'monospace',
//             fontSize: '12px',
//           },
//         });
//         return;
//       }

//       toast.success('Registration Successful!', {
//         style: {
//           border: '1px solid #00ffcc',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });

//       setTimeout(() => {
//         router.push('/');
//       }, 1500);

//     } catch (err) {
//       console.error(err);
//       toast.error('An unexpected error occurred.', {
//         style: {
//           border: '1px solid #f43f5e',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   // const handleRegister = async (e) => {
//   //   e.preventDefault();
//   //   const formdata = new FormData(e.target);
      

//   //     const registerData = Object.fromEntries(formdata.entries());
          

//   //     const { data, error } = await signUp.email({
//   //       ...registerData,

        
       
//   //     });
     

//   //     // console.log(data);

//   //     if (error) {
//   //       toast.error('Registration failed', {
//   //         style: {
//   //           border: '1px solid #f43f5e',
//   //           padding: '16px',
//   //           color: '#fff',
//   //           background: '#090d16',
//   //           fontFamily: 'monospace',
//   //           fontSize: '12px'
//   //         },
        
//   //       });
//   //       return ;
//   //     }


 

//   //  toast.success('Registration Successful! ', {
//   //         style: {
//   //           border: '1px solid #00ffcc',
//   //           padding: '16px',
//   //           color: '#fff',
//   //           background: '#090d16',
//   //           fontFamily: 'monospace',
//   //           fontSize: '12px'
//   //         },
//   //       });

  
//   //       setTimeout(() => {
//   //         router.push('/');
//   //        }, 1500);
   
//   // };




//   const handleGoogleLogin = async () => {
//     try {
//       toast.success('Redirecting to Google Sign In...', {
//         style: {
//           border: '1px solid #f97316',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });

//       await authClient.signIn.social({
//         provider: 'google',
//         callbackURL: '/',
//       });
//     } catch (error) {
//       console.error('Google login error:', error);
//       toast.error('Google Login Failed!', {
//         style: {
//           border: '1px solid #f43f5e',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#030712] text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">
//       {/* 🔮 Warm Culinary Orange Glow Grid */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[160px] pointer-events-none" />

//       <div className="w-full max-w-md bg-[#090d16]/70 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative z-10 space-y-6 shadow-2xl">
//         {/* 🍳 RECIPE HOUSE TITLE HEADER */}
//         <div className="text-center space-y-2">
//           <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase border-b border-orange-500/30 pb-1">
//             <FaUtensils className="text-orange-500" /> RecipeHouse Protocol
//           </div>
//           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
//             Create <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">Account</span>
//           </h1>
//           <p className="text-xs text-gray-400">
//             Join our community to discover and share delicious recipes.
//           </p>
//         </div>

//         {/* 📝 REGISTRATION FORM */}
//         <form onSubmit={handleRegister} className="space-y-4">
//           {/* Field 1: Name */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Chef / User Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               required
//               placeholder="Farhad Ahmed"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 2: Email */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="your-email@example.com"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 3: Photo URL */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Avatar / Photo URL (Optional)
//             </label>
//             <input
//               type="url"
//               name="image"
//               placeholder="https://images.com/profile.jpg"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 4: Password */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Secure Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 required
//                 minLength={8}
//                 placeholder="••••••••"
//                 className="w-full bg-[#030712] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
//               >
//                 {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
//               </button>
//             </div>
//           </div>

//           {/* 🎯 REGISTER BUTTON */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
//             >
//               {loading ? 'Creating Profile...' : 'Register Account'}
//             </button>
//           </div>
//         </form>

//         {/* ⚡ OR DIVIDER */}
//         <div className="relative flex items-center justify-center py-1">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/5"></div>
//           </div>
//           <span className="relative bg-[#090d16] px-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">
//             OR
//           </span>
//         </div>

//         {/* 🌐 GOOGLE LOGIN BUTTON */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-bold text-xs tracking-wide py-3 rounded-xl hover:bg-white/[0.08] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5"
//         >
//           <svg className="h-4 w-4" viewBox="0 0 24 24">
//             <path
//               fill="#EA4335"
//               d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.74 5.04 12 5.04z"
//             />
//             <path
//               fill="#4285F4"
//               d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.75-4.9 3.75-8.53z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.4 0 11.63 0 14s.54 4.6 1.5 6.5l3.6-2.8z"
//             />
//             <path
//               fill="#34A853"
//               d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.26 0-5.99-2.1-6.98-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
//             />
//           </svg>
//           <span>Continue with Google</span>
//         </button>

//         {/* 🔗 LOGIN ROUTE LINK */}
//         <p className="text-center text-xs text-gray-500 font-mono">
//           Already a member?{' '}
//           <Link href="/login" className="text-orange-400 hover:underline font-bold">
//             Log In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
















// 'use client';

// import { useState } from 'react';
// import { authClient } from '@/lib/auth-client';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// // import { authClient, signUp } from '@/lib/auth-client';
// import { toast } from 'react-hot-toast';
// import { FaEye, FaEyeSlash, FaUtensils } from 'react-icons/fa';

// const Register = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formdata = new FormData(e.target);
//     const registerData = Object.fromEntries(formdata.entries());
//     console.log(registerData,"singu data ");

  
//       const { data, error } = await authClient.signUp.email({
//         ...registerData,
//       });
//       // console.log(data ,'new data 1');



//         if (error) {
//         toast.error('Registration failed', {
//           style: {
//             border: '1px solid #f43f5e',
//             padding: '16px',
//             color: '#fff',
//             background: '#090d16',
//             fontFamily: 'monospace',
//             fontSize: '12px'
//           },
        
//         });
//         return ;
//       }


 

//    toast.success('Registration Successful! ', {
//           style: {
//             border: '1px solid #00ffcc',
//             padding: '16px',
//             color: '#fff',
//             background: '#090d16',
//             fontFamily: 'monospace',
//             fontSize: '12px'
//           },
//         });

  
//         setTimeout(() => {
//           router.push('/');
//          }, 1500);
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       toast.success('Redirecting to Google Sign In...', {
//         style: {
//           border: '1px solid #f97316',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });

//       await authClient.signIn.social({
//         provider: 'google',
//         callbackURL: '/',
//       });
//     } catch (error) {
//       console.error('Google login error:', error);
//       toast.error('Google Login Failed!', {
//         style: {
//           border: '1px solid #f43f5e',
//           padding: '16px',
//           color: '#fff',
//           background: '#090d16',
//           fontFamily: 'monospace',
//           fontSize: '12px',
//         },
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#030712] text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">
//       {/* 🔮 Warm Culinary Orange Glow Grid */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[160px] pointer-events-none" />

//       <div className="w-full max-w-md bg-[#090d16]/70 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative z-10 space-y-6 shadow-2xl">
//         {/* 🍳 RECIPE HOUSE TITLE HEADER */}
//         <div className="text-center space-y-2">
//           <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-orange-400 uppercase border-b border-orange-500/30 pb-1">
//             <FaUtensils className="text-orange-500" /> RecipeHouse Protocol
//           </div>
//           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
//             Create <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">Account</span>
//           </h1>
//           <p className="text-xs text-gray-400">
//             Join our community to discover and share delicious recipes.
//           </p>
//         </div>

//         {/* 📝 REGISTRATION FORM */}
//         <form onSubmit={handleRegister} className="space-y-4">
//           {/* Field 1: Name */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Chef / User Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               required
//               placeholder="Farhad Ahmed"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 2: Email */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="you are email adress"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 3: Photo URL */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Avatar / Photo URL (Optional)
//             </label>
//             <input
//               type="url"
//               name="image"
//               placeholder="https://images.com/profile.jpg"
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//             />
//           </div>

//           {/* Field 4: Password */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
//               Secure Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 required
//                 placeholder="••••••••"
//                 className="w-full bg-[#030712] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 transition-colors"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors"
//               >
//                 {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
//               </button>
//             </div>
//           </div>

//           {/* 🎯 REGISTER BUTTON */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]"
//             >
//               {loading ? 'Creating Profile...' : 'Register Account'}
//             </button>
//           </div>
//         </form>

//         {/* ⚡ OR DIVIDER */}
//         <div className="relative flex items-center justify-center py-1">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-white/5"></div>
//           </div>
//           <span className="relative bg-[#090d16] px-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">
//             OR
//           </span>
//         </div>

//         {/* 🌐 GOOGLE LOGIN BUTTON */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-bold text-xs tracking-wide py-3 rounded-xl hover:bg-white/[0.08] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5"
//         >
//           <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
//             <path
//               fill="#EA4335"
//               d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.74 5.04 12 5.04z"
//             />
//             <path
//               fill="#4285F4"
//               d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.75-4.9 3.75-8.53z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.4 0 11.63 0 14s.54 4.6 1.5 6.5l3.6-2.8z"
//             />
//             <path
//               fill="#34A853"
//               d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.26 0-5.99-2.1-6.98-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
//             />
//           </svg>
//           <span>Continue with Google</span>
//         </button>

//         {/* 🔗 LOGIN ROUTE LINK */}
//         <p className="text-center text-xs text-gray-500 font-mono">
//           Already a member?{' '}
//           <Link href="/login" className="text-orange-400 hover:underline font-bold">
//             Log In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;






// 'use client';

// // import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { authClient, signUp } from '@/lib/auth-client';
// import { toast } from 'react-hot-toast'; //


// const  Register =() => {
//   const router = useRouter();




 

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formdata = new FormData(e.target);
      

//       const registerData = Object.fromEntries(formdata.entries());
          

//       const { data, error } = await signUp.email({
//         ...registerData,

        
       
     
//       });

//       // console.log(data);

//       if (error) {
//         toast.error('Registration failed', {
//           style: {
//             border: '1px solid #f43f5e',
//             padding: '16px',
//             color: '#fff',
//             background: '#090d16',
//             fontFamily: 'monospace',
//             fontSize: '12px'
//           },
        
//         });
//         return ;
//       }


 

//    toast.success('Registration Successful! ', {
//           style: {
//             border: '1px solid #00ffcc',
//             padding: '16px',
//             color: '#fff',
//             background: '#090d16',
//             fontFamily: 'monospace',
//             fontSize: '12px'
//           },
//         });

  
//         setTimeout(() => {
//           router.push('/');
//          }, 1500);


    
  

        
   
//   };






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

  
//     await authClient.signIn.social({
//       provider: "google",
//       callbackURL: "/",         
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






//   // const handleGoogleLogin = async () => {
   
      
//   //     await authClient.signIn.social({
//   //       provider: "google",
//   //       callbackURL: "/",         
       
//   //     });

   
//   // };









//   return (
//     <div className="min-h-screen bg-[#030712] text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">

//       {/* 🔮 Background Cyan Glow Grid */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#00ffcc]/5 blur-[160px] pointer-events-none" />

//       <div className="w-full max-w-md bg-[#090d16]/60 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative z-10 space-y-6 shadow-2xl">

//         {/* 📑 REGISTRATION TITLE */}
//         <div className="text-center space-y-1.5">
//           {/* <div className="inline-block font-mono text-[9px] tracking-[0.2em] text-[#00ffcc] uppercase border-b border-[#00ffcc]/20 pb-0.5">
//             Access Protocol
//           </div> */}
//           <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
//             Create <span className="text-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,0.3)]"> Account</span>
//           </h1>
//           {/* <p className="text-xs text-gray-400">
//             Initialize your profile metrics to join the RentRide network.
//           </p> */}
//         </div>

//         {/* ⚠️ ERROR MESSAGE DISPLAY (Inline Custom Alert) */}

      

//         {/* 📝 REGISTRATION FORM */}
//         <form onSubmit={handleRegister} className="space-y-4">

//           {/* Field 1: Name */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               required
//               placeholder="Farhad Ahmed"
            
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* Field 2: Email */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="name@domain.com"
           
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* Field 3: Photo URL */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Photo URL</label>
//             <input
//               type="url"
//               name="image"
//               required
//               placeholder="https://images.com/profile.jpg"
         
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>
        

//           {/* Field 4: Password */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Secure Password</label>
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="••••••••"
       
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* 🎯 REGISTER BUTTON */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               // disabled={loading}
//               className="w-full bg-[#00ffcc] text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl hover:bg-[#00ffcc]/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(0,255,204,0.1)] hover:shadow-[0_0_25px_rgba(0,255,204,0.3)]"
//             >
//               Register Account
//             </button>
//           </div>
//         </form>

//         {/* ⚡ OR DIVIDER */}
//         <div className="relative flex items-center justify-center py-2">
//           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
//           <span className="relative bg-[#090d16] px-3 font-mono text-[9px] uppercase tracking-widest text-gray-500">OR </span>
//         </div>

//         {/* 🌐 GOOGLE LOGIN BUTTON */}
//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-bold text-xs tracking-wide py-3 rounded-xl hover:bg-white/[0.08] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5"
//         >
//           {/* Minimalist Google SVG Icon */}
//           <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
//             <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.14 8.74 5.04 12 5.04z" />
//             <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.14-1.98 3.75-4.9 3.75-8.53z" />
//             <path fill="#FBBC05" d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.4 0 11.63 0 14s.54 4.6 1.5 6.5l3.6-2.8z" />
//             <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.68-2.85c-1.02.68-2.33 1.1-4.28 1.1-3.26 0-5.99-2.1-6.98-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z" />
//           </svg>
//           <span>Continue with Google</span>
//         </button>

//       </div>
//     </div>
//   );
// }



// export default Register;












// 'use client';
// // import React, { useState } from 'react';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle, FaEyeSlash, FaEye } from 'react-icons/fa';
// import { authClient } from '@/lib/auth-client'; // আপনার Better Auth ক্লায়েন্ট ফাইল ইম্পোর্ট করুন



// const RegisterPage = () => {
//   // const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     image: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // পাসওয়ার্ড ভ্যালিডেশন রুলস Check
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

//   // ১. Email and Password দিয়ে রেজিস্টার করার ফাংশন
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formdata = new FormData(e.target);
      

//       const registerData = Object.fromEntries(formdata.entries());
          

//       const { data, error } = await signUp.email({
//         ...registerData,

        
       
//       });
     


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError('');

//   //   // পাসওয়ার্ড ভ্যালিডেশন চেক
//   //   const pwdError = validatePassword(formData.password);
//   //   if (pwdError) {
//   //     setError(pwdError);
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     // Better Auth এর signUp call
//   //     const { data, error: authError } = await authClient.signUp.email({
//   //       email: formData.email,
//   //       password: formData.password,
//   //       name: formData.name,
//   //       image: formData.image || undefined, // ছবি না দিলে undefined
//   //     });

//   //     if (authError) {
//   //       setError(authError.message || 'Registration failed. Please try again.');
//   //     } else {
//   //       // সফলভাবে রেজিস্টার হলে হোমপেজে বা ড্যাশবোর্ডে রিডাইরেক্ট করবে
//   //       router.push('/');
//   //     }
//   //   } catch (err) {
//   //     setError('An unexpected error occurred. Please try again.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // ২. Google OAuth দিয়ে সাইন-ইন করার ফাংশন
//   const handleGoogleLogin = async () => {
//     setError('');
//     try {
//       await authClient.signIn.social({
//         provider: 'google',
//         callbackURL: '/', // লগইন সফল হলে যেখানে রিডাইরেক্ট হবে
//       });
//     } catch (err) {
//       setError('Failed to log in with Google.');
//     }
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

//         <form onSubmit={handleRegister} className="space-y-4">

//           {/* Field 1: Name */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               required
//               placeholder="Farhad Ahmed"
            
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* Field 2: Email */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="name@domain.com"
           
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* Field 3: Photo URL */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Photo URL</label>
//             <input
//               type="url"
//               name="image"
//               required
//               placeholder="https://images.com/profile.jpg"
         
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>
        

//           {/* Field 4: Password */}
//           <div className="space-y-1">
//             <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Secure Password</label>
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="••••••••"
       
//               className="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffcc]/50 transition-colors"
//             />
//           </div>

//           {/* 🎯 REGISTER BUTTON */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               // disabled={loading}
//               className="w-full bg-[#00ffcc] text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl hover:bg-[#00ffcc]/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(0,255,204,0.1)] hover:shadow-[0_0_25px_rgba(0,255,204,0.3)]"
//             >
//               Register Account
//             </button>
//           </div>
//         </form>

        

//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200 dark:border-gray-800" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-white px-2 text-gray-400">Or continue with</span>
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
// }};

// export default RegisterPage;
















// // 'use client';

// // import React, { useState } from 'react';
// // import Link from 'next/link';
// // import { useRouter } from 'next/navigation';
// // import { motion } from 'framer-motion';
// // import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from 'react-icons/fa';

// // const RegisterPage = () => {
// //   const router = useRouter();
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     image: '',
// //     password: '',
// //   });
// //   const [error, setError] = useState('');

// //   // পাসওয়ার্ড ভ্যালিডেশন রুলস Check
// //   const validatePassword = (password) => {
// //     if (password.length < 6) {
// //       return 'Password must be at least 6 characters long.';
// //     }
// //     if (!/[A-Z]/.test(password)) {
// //       return 'Password must contain at least one uppercase letter.';
// //     }
// //     if (!/[a-z]/.test(password)) {
// //       return 'Password must contain at least one lowercase letter.';
// //     }
// //     return null;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setError('');

// //     // পাসওয়ার্ড ভ্যালিডেশন কল
// //     const pwdError = validatePassword(formData.password);
// //     if (pwdError) {
// //       setError(pwdError);
// //       return;
// //     }

// //     // Auth API Call / Firebase Integration
// //     alert('Registration successful!');
// //     router.push('/');
// //   };

// //   const handleGoogleLogin = () => {
// //     // Google Login logic
// //     alert('Redirecting to Google Sign In...');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
// //       >
// //         <div className="text-center">
// //           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
// //             Create an Account
// //           </h2>
// //           <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
// //             Join RecipeHouse and start sharing your food magic
// //           </p>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
// //             {error}
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           {/* Name Field */}
// //           <div>
// //             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
// //               Full Name
// //             </label>
// //             <div className="relative">
// //               <FaUser className="absolute left-3.5 top-3.5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 required
// //                 value={formData.name}
// //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                 placeholder="John Doe"
// //                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Email Field */}
// //           <div>
// //             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
// //               Email Address
// //             </label>
// //             <div className="relative">
// //               <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
// //               <input
// //                 type="email"
// //                 required
// //                 value={formData.email}
// //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                 placeholder="you@example.com"
// //                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Image URL Field */}
// //           <div>
// //             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
// //               Profile Image URL
// //             </label>
// //             <div className="relative">
// //               <FaImage className="absolute left-3.5 top-3.5 text-gray-400" />
// //               <input
// //                 type="url"
// //                 required
// //                 value={formData.image}
// //                 onChange={(e) => setFormData({ ...formData, image: e.target.value })}
// //                 placeholder="https://example.com/photo.jpg"
// //                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Password Field */}
// //           <div>
// //             <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
// //               Password
// //             </label>
// //             <div className="relative">
// //               <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
// //               <input
// //                 type="password"
// //                 required
// //                 value={formData.password}
// //                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //                 placeholder="••••••••"
// //                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
// //               />
// //             </div>
// //             <p className="text-[11px] text-gray-500 mt-1">
// //               Must contain 6+ chars, 1 uppercase & 1 lowercase letter.
// //             </p>
// //           </div>

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
// //           >
// //             Register Account
// //           </button>
// //         </form>

// //         <div className="relative my-4">
// //           <div className="absolute inset-0 flex items-center">
// //             <div className="w-full border-t border-gray-200 dark:border-gray-800" />
// //           </div>
// //           <div className="relative flex justify-center text-xs uppercase">
// //             <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">Or continue with</span>
// //           </div>
// //         </div>

// //         {/* Google Login */}
// //         <button
// //           onClick={handleGoogleLogin}
// //           type="button"
// //           className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2.5 rounded-xl transition"
// //         >
// //           <FaGoogle className="text-red-500" />
// //           <span>Google Sign In</span>
// //         </button>

// //         <p className="text-center text-sm text-gray-600 dark:text-gray-400">
// //           Already have an account?{' '}
// //           <Link href="/login" className="text-orange-600 font-semibold hover:underline">
// //             Log in
// //           </Link>
// //         </p>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default RegisterPage;