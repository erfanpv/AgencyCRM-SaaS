import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
      'g3zmm4s4nr.ufs.sh',
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
