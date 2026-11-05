import { FieldwornFooter } from "@/app/(mock)/test-mock-3/FieldwornChrome";
import "@/app/(site)/fieldworn-site.css";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";
import { imageSrc } from "@/lib/images";
import SiteFooterBehavior from "./SiteFooterBehavior";

/** The /test-mock-2 footer (as on the home page), shown on every page from the root layout. */
export default function SiteFooter() {
  return (
    <div className={`fwb site-foot ${fieldwornFonts}`}>
      <FieldwornFooter image={imageSrc("images/content/story")} />
      <SiteFooterBehavior />
    </div>
  );
}
