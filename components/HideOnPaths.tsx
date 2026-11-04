"use client";

import { usePathname } from "next/navigation";

/** Pages that bring their own header and footer (the /test-mock-2 style). */
export const OWN_CHROME = ["/branches", "/blog", "/contact", "/policies"];

export default function HideOnPaths({ children, paths = OWN_CHROME }: { children: React.ReactNode; paths?: string[] }) {
  const pathname = usePathname();
  const own = paths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  return own ? null : <>{children}</>;
}
