import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output :'export' ,
  trailingSlash: true,
  basePath: '/my_gpt_next',
  assetPrefix: 'https://nextmygpt.pielove.xyz/',
};

export default nextConfig;
