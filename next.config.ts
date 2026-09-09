import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer must not be bundled — it resolves its own subpaths at runtime
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
