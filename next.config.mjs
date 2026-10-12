import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  webpack(config) {
    config.resolve.alias["@"] = projectRoot;
    return config;
  },
};

export default nextConfig;
