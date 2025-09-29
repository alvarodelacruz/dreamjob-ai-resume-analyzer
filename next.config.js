/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.42'],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            canvas: false,
            encoding: false
        };
        return config;
    },
}

module.exports = nextConfig