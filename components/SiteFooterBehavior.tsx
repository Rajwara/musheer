"use client";

import { usePathname } from "next/navigation";
import { FieldwornChromeBehavior } from "@/app/(mock)/test-mock-3/FieldwornChrome";

/** Re-run the footer's wordmark sizing and scroll animations on every page change. */
export default function SiteFooterBehavior() {
  const pathname = usePathname();
  return <FieldwornChromeBehavior key={pathname} />;
}
