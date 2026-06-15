/** @type {import('next').NextConfig} */

// Android (Capacitor) ke liye static export, web ke liye normal server build.
// BUILD_TARGET=android -> static files (out/) jo Capacitor wrap karega.
const isAndroid = process.env.BUILD_TARGET === "android";

const nextConfig = {
  reactStrictMode: true,
  ...(isAndroid && { output: "export", images: { unoptimized: true } }),
};

module.exports = nextConfig;
