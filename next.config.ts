import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without this Next walks up and finds the package-lock in the home directory.
  turbopack: { root: __dirname },
};

export default nextConfig;
