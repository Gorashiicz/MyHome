import type { NextConfig } from "next";

/** Musí být >= MAX_FILE_SIZE v lib/constants.ts (15 MB). */
const UPLOAD_BODY_LIMIT = "16mb";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: UPLOAD_BODY_LIMIT,
  },
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/api/export/denik": [
      "./assets/fonts/**/*",
      "./assets/diary/**/*",
      "./node_modules/dejavu-fonts-ttf/ttf/*.ttf",
    ],
  },
};

export default nextConfig;
