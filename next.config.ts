import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer must not be bundled — it resolves its own subpaths at runtime
  serverExternalPackages: ["@react-pdf/renderer"],
  // pdfkit builds its font paths at runtime (require("./standard-fonts/" + name)),
  // so Vercel's tracer can't see them and leaves them out of the deployed function.
  // Ship them explicitly or renderToBuffer dies on MODULE_NOT_FOUND for Helvetica.
  outputFileTracingIncludes: {
    "/api/apply": ["./node_modules/pdfkit/js/standard-fonts/**"],
  },
};

export default nextConfig;
