import NotFoundContent from "@/components/not-found/NotFoundContent";
import { fieldwornFonts } from "@/lib/fieldworn-fonts";

/** Missing product, category or post: shown inside the store layout (header and footer included). */
export default function NotFound() {
  return (
    <div className={fieldwornFonts}>
      <NotFoundContent />
    </div>
  );
}
