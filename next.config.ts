import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',

    // 🖼️ Configuration pour les images externes
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'observatoireddl.mg',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '0.0.0.0',
                port: '8000',
                pathname: '/uploads/**',
            }
        ],
    },

    // Ensure large PDF files are correctly handled
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(pdf)$/i,
            type: 'asset/resource',
        });
        return config;
    },
};

export default nextConfig;