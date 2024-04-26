/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/get-decoded-2448',
        destination: process.env.NEXT_PUBLIC_API_URL,
      },
    ];
  },
};

export default nextConfig;
