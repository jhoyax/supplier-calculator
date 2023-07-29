const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath: isProd ? '/supplier-calculator' : undefined,
    assetPrefix: isProd ? '/supplier-calculator/' : undefined, // assetPrefix requires the trailing slash
}

module.exports = nextConfig
