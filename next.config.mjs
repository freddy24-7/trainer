/** @type {import('next').NextConfig} */
import moduleAlias from 'module-alias'

moduleAlias.addAlias('punycode', 'punycode/')
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
};

export default nextConfig;
