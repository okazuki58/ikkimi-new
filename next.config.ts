import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabaseストレージからの画像を許可
      {
        protocol: "https",
        hostname: "auth.ikki-mi.com",
        port: "",
        pathname: "/storage/v1/object/public/ikkimi-image/**",
      },
      {
        protocol: "https",
        hostname: "xcclmezluzvwbewszwtw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      {
        protocol: "https",
        hostname: "auth.ikki-mi.com",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      // Googleユーザーアバター画像を許可
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // すべてのパスを許可
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**", // すべてのパスを許可
      },
      {
        protocol: "https",
        hostname: "ikkimi.imgix.net",
        port: "",
        pathname: "/**", // すべてのパスを許可
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // すべてのパスを許可
      },
    ],
  },
};

export default nextConfig;
