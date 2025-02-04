/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's.gravatar.com',
                pathname: '**',
            },
        ],

    },
    output: 'standalone'
};

export default nextConfig;
