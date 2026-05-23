/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/ruleslawyer',
    env: {
        NEXT_PUBLIC_BASE_PATH: '/ruleslawyer',
        NEXT_PUBLIC_PROFILE_ROUTE: '/ruleslawyer/auth/profile',
        NEXT_PUBLIC_ACCESS_TOKEN_ROUTE: '/ruleslawyer/auth/access-token',
    },
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
