import "server-only";
import type { LocatorBranch } from "@/components/BranchLocator";
import { BRANCHES } from "./brand";
import { imageSrc } from "./images";

// Shown on hover until a photo of the branch itself is added at public/images/branches/<id>.webp.
const FALLBACKS = ["images/pages/branches", "images/pages/about", "images/hero/hero-new", "images/pages/contact", "images/content/story"];

/** Every branch with its emirate and a photo, for the branch finder and the branches map. */
export function locatorBranches(): LocatorBranch[] {
  let i = 0;
  return BRANCHES.flatMap((e) =>
    e.branches.map((b) => {
      const own = imageSrc(`images/branches/${b.id}`);
      const image = own.endsWith(".svg") ? imageSrc(FALLBACKS[i++ % FALLBACKS.length]) : own;
      return { ...b, emirate: e.emirate, image };
    }),
  );
}
