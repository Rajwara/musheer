"use client";

import { usePathname } from "next/navigation";

/** Pages that bring their own header and footer (the /test-mock-2 style). */
export const OWN_CHROME = ["/branches"];

export default function HideOnPaths({ children, paths = OWN_CHROME }: { children: React.ReactNode; paths?: string[] }) {
  const pathname = usePathname();
  return paths.includes(pathname) ? null : <>{children}</>;
}
