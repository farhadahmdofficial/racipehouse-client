


/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://racipehouse-sever.vercel.app/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;







// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;
