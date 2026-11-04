"use client";

import { usePathname } from "next/navigation";

/** Pages that bring their own footer (the /test-mock-2 style); the store header shows everywhere. */
export const OWN_CHROME = ["/about", "/branches", "/blog", "/contact", "/policies", "/product", "/category"];

export default function HideOnPaths({ children, paths = OWN_CHROME }: { children: React.ReactNode; paths?: string[] }) {
  const pathname = usePathname();
  const own = paths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  return own ? null : <>{children}</>;
}
