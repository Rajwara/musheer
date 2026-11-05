import "@/app/(site)/fieldworn-site.css";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";

/**
 * Wraps a store page in the /test-mock-2 branding: its fonts and colours. The
 * header and footer come from the root layout (Header, SiteFooter).
 */
export default function FieldwornShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`fwb ${fieldwornFonts} ${className}`}>
      {children}
    </div>
  );
}
