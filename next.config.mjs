/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['s.gravatar.com'],
    },
    env: {
        API_URL: 'http://localhost:8080/api',
    },
    output: 'standalone'
};

export default nextConfig;
