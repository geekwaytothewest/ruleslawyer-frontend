/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's.gravatar.com',
                pathname: '**',
            },
            {
              protocol: "https",
              hostname: "*.googleusercontent.com",
              port: "",
              pathname: "**",
            },
            {
                protocol: "https",
                hostname: "*.auth0.com",
                port: "",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "*.fbsbx.com",
                port: "",
                pathname: "**"
            },
            {
                protocol: "https",
                hostname: "*.live.net",
                port: "",
                pathname: "**"
            },
        ],

    },
    output: 'standalone'
};

export default nextConfig;
