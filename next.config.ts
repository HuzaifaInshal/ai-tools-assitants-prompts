import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['isomorphic-git', 'memfs'],
};

export default nextConfig;
