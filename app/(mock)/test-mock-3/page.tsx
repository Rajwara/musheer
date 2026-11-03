import fs from "node:fs";
import path from "node:path";
import Logotype, { type LogotypeImages } from "./Logotype";

/**
 * Image slots. Upload a file named after the slot to public/images/test-mock-3/
 * (for example hero-1b.webp) and it replaces that placeholder on the next build.
 * Until then each slot shows the original grey placeholder with its size.
 */
const SLOTS = [
  "hero-1a", "hero-1b", "hero-1c", "hero-2a", "hero-2b", "hero-2c", "hero-3a", "hero-3b", "hero-3c",
  "about-1", "about-2",
  "service-1", "service-2", "service-3", "service-4",
  "process-1", "process-2", "process-3", "process-4",
  "project-1", "project-2", "project-3", "project-4",
  "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6",
];
const DIR = path.join(process.cwd(), "public", "images", "test-mock-3");
const EXTENSIONS = ["webp", "jpg", "jpeg", "png", "avif"];

function findImage(slot: string) {
  const ext = EXTENSIONS.find((e) => fs.existsSync(path.join(DIR, `${slot}.${e}`)));
  return ext ? `/images/test-mock-3/${slot}.${ext}` : undefined;
}

export default function TestMock3Page() {
  const img: LogotypeImages = Object.fromEntries(SLOTS.map((s) => [s, findImage(s)]));
  return <Logotype img={img} />;
}
