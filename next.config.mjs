/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "2002",
        pathname: "/media/**",
        // search: "",
      },
      {
        protocol: "https",
        hostname: "api.learningpost.ng",
        port: "",
        pathname: "/media/**",
        // search: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
        // search: "",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
