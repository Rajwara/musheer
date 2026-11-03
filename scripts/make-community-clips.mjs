// Turns the community look illustrations into short sample clips (slow zoom),
// so the video-testimonial section has something to play before real customer
// videos are added.
//
// Needs ffmpeg and Playwright's Chromium:  node scripts/make-community-clips.mjs
// Output: public/videos/community/look-N.mp4 and public/images/community/look-N.jpg (poster)

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const svgDir = path.join(root, "public/images/community");
const videoDir = path.join(root, "public/videos/community");
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "clips-"));
fs.mkdirSync(videoDir, { recursive: true });

const files = fs.readdirSync(svgDir).filter((f) => /^look-\d+\.svg$/.test(f)).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 2 });

for (const [i, file] of files.entries()) {
  const name = file.replace(/\.svg$/, "");
  const svg = fs.readFileSync(path.join(svgDir, file), "utf8");
  await page.setContent(`<body style="margin:0">${svg.replace("<svg ", '<svg style="display:block;width:720px;height:1280px" ')}</body>`);
  const png = path.join(tmp, `${name}.png`);
  await page.screenshot({ path: png });

  // Alternate zoom-in / zoom-out and the drift direction so the row does not move in lockstep.
  const frames = 180; // 6 s at 30 fps
  const zoom = i % 2 ? `1.14-0.14*on/${frames}` : `1+0.14*on/${frames}`;
  const drift = i % 3 === 0 ? "-1" : i % 3 === 1 ? "1" : "0";
  const filter =
    `scale=2160:3840,zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)+${drift}*on*0.6':y='ih/2-(ih/zoom/2)':d=${frames}:s=720x1280:fps=30,format=yuv420p`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", png, "-vf", filter, "-frames:v", String(frames),
    "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-movflags", "+faststart", "-an", path.join(videoDir, `${name}.mp4`)]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-vf", "scale=720:1280", "-q:v", "4", path.join(svgDir, `${name}.jpg`)]);
  console.log(`made ${name}.mp4`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
