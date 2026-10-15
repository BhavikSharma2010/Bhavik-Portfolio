import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives one level below a parent package-lock.json; pin the root
  // so Turbopack doesn't try to use it.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
