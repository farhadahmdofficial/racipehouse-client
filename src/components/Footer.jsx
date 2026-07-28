


'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block text-2xl font-bold text-orange-500">
              Recipe<span className="text-white">House</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover, create, and share delicious homemade recipes with a passionate community of food lovers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-orange-500 transition-colors">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-orange-500 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                <span>123 Culinary Lane, Foodie Town, FT 56789</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
                <span>+1 (555) 000-8888</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-orange-500 flex-shrink-0" />
                <span>support@recipehouse.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
              Follow Us
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Connect with RecipeHouse on social media for daily recipe updates!
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RecipeHouse. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;














// import React from 'react';

// const Footer = () => {
//     return (
//         <div>
            
//         </div>
//     );
// };

// export default Footer;















// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { 
//   FaFacebookF, 
//   FaTwitter, 
//   FaInstagram, 
//   FaLinkedinIn, 
//   FaEnvelope, 
//   FaPhoneAlt, 
//   FaMapMarkerAlt 
// } from 'react-icons/fa'; // react-icons না থাকলে 'npm install react-icons' ইনস্টল করে নেবেন

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* টপ সেকশন: ৪টি গ্রিড কলাম */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
//           {/* ১. লোগো ও বর্ণনা (Logo & Description) */}
//           <div className="space-y-4">
//             <Link href="/" className="inline-block text-2xl font-bold text-orange-500">
//               Recipe<span className="text-white">Hub</span>
//             </Link>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Discover, create, and share delicious recipes with a passionate community of food lovers around the globe.
//             </p>
//           </div>

//           {/* ২. কুইক লিংকস (Quick Links) */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
//               Quick Links
//             </h3>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link href="/" className="hover:text-orange-500 transition-colors">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/recipes" className="hover:text-orange-500 transition-colors">
//                   Browse Recipes
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/profile" className="hover:text-orange-500 transition-colors">
//                   Profile
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* ৩. কন্টাক্ট ইনফরমেশন (Contact Information) */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
//               Contact Us
//             </h3>
//             <ul className="space-y-3 text-sm text-gray-400">
//               <li className="flex items-start space-x-3">
//                 <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
//                 <span>123 Culinary Avenue, Foodie City, FC 12345</span>
//               </li>
//               <li className="flex items-center space-x-3">
//                 <FaPhoneAlt className="text-orange-500 flex-shrink-0" />
//                 <span>+1 (555) 000-7890</span>
//               </li>
//               <li className="flex items-center space-x-3">
//                 <FaEnvelope className="text-orange-500 flex-shrink-0" />
//                 <span>support@recipehub.com</span>
//               </li>
//             </ul>
//           </div>

//           {/* ৪. সোশ্যাল লিংকস (Social Links) */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4 border-b border-orange-500 pb-1 inline-block">
//               Follow Us
//             </h3>
//             <p className="text-sm text-gray-400 mb-4">
//               Stay connected with us on social media for daily recipe updates!
//             </p>
//             <div className="flex space-x-3">
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
//                 aria-label="Facebook"
//               >
//                 <FaFacebookF />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
//                 aria-label="Twitter"
//               >
//                 <FaTwitter />
//               </a>
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
//                 aria-label="Instagram"
//               >
//                 <FaInstagram />
//               </a>
//               <a
//                 href="https://linkedin.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-300"
//                 aria-label="LinkedIn"
//               >
//                 <FaLinkedinIn />
//               </a>
//             </div>
//           </div>

//         </div>

//         {/* বটম সেকশন: কপিরাইট (Copyright) */}
//         <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
//           <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;