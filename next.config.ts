import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  // db/schema.sql is read at runtime, so keep it in the traced output.
  outputFileTracingIncludes: {
    "/**/*": ["./db/schema.sql"],
  },
  images: {
    // Product images uploaded through the admin panel are served from /uploads.
    // Add your CDN / object-storage host here when you move off local storage.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // The bundled catalog artwork is SVG line-art. Admin uploads are restricted
    // to raster formats (see src/lib/upload.ts), and SVGs are served sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
