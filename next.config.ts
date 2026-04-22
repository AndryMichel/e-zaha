import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'observatoireddl.mg',
                pathname: '/uploads/**',
            },
            // ✅ AJOUTER
            {
                protocol: 'https',
                hostname: 'api.observatoireddl.mg',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',
            },
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(pdf)$/i,
            type: 'asset/resource',
        });
        return config;
    },
};

export default nextConfig;