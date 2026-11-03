import type { NextConfig } from "next";

// Keep links to the old static-site URLs (e.g. product-foo.html) working.
const legacy = (source: string, destination: string) => ({ source, destination, permanent: true });

const nextConfig: NextConfig = {
  async redirects() {
    return [
      legacy("/index.html", "/"),
      legacy("/category-:slug([a-z0-9-]+).html", "/category/:slug"),
      legacy("/product-:slug([a-z0-9-]+).html", "/product/:slug"),
      legacy("/policy-:slug([a-z0-9-]+).html", "/policies/:slug"),
      legacy("/:page(about|account|cart|contact|journal|search|stores|wishlist).html", "/:page"),
    ];
  },
};

export default nextConfig;
