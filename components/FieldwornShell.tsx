import { FieldwornChromeBehavior, FieldwornFooter } from "@/app/(mock)/test-mock-3/FieldwornChrome";
import "@/app/(site)/fieldworn-site.css";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";

/**
 * Wraps a store page in the /test-mock-2 branding: its fonts and colours and
 * its footer. The header is the store header from the root layout. List the page
 * in OWN_CHROME (components/HideOnPaths.tsx) so the store footer is hidden.
 */
export default function FieldwornShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`fwb ${fieldwornFonts} ${className}`}>
      {children}
      <FieldwornFooter image={imageSrc("images/content/story")} />
      <FieldwornChromeBehavior />
    </div>
  );
}
