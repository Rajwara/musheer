import { FieldwornChromeBehavior, FieldwornFooter, FieldwornHeader } from "@/app/(mock)/test-mock-3/FieldwornChrome";
import "@/app/(site)/fieldworn-site.css";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";
import StoreCartLink from "./StoreCartLink";

/**
 * Wraps a store page in the /test-mock-2 branding: its fonts and colours, and
 * its header and footer. The page must also be listed in OWN_CHROME
 * (components/HideOnPaths.tsx) so the store header and footer are hidden.
 */
export default function FieldwornShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`fwb ${fieldwornFonts} ${className}`}>
      <FieldwornHeader cart={<StoreCartLink />} />
      {children}
      <FieldwornFooter image={imageSrc("images/content/story")} />
      <FieldwornChromeBehavior />
    </div>
  );
}
