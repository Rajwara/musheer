"use client";

import { usePathname } from "next/navigation";

/** Pages that bring their own footer (the /test-mock-2 style); the store header shows everywhere. */
export const OWN_CHROME = ["/", "/about", "/branches", "/blog", "/contact", "/policies", "/product", "/category"];

export default function HideOnPaths({ children, paths = OWN_CHROME }: { children: React.ReactNode; paths?: string[] }) {
  const pathname = usePathname();
  // "/" matches the home page only; other entries also match their sub-pages.
  const own = paths.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")));
  return own ? null : <>{children}</>;
}
