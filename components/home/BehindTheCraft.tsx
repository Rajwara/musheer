import CommunityVideos from "@/components/CommunityVideos";
import { COMMUNITY } from "@/lib/brand";
import { cards } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import "@/app/(mock)/test-mock-2/community.css";
import "./behind-the-craft.css";

/** "*Behind The Craft / See It On Instagram" from /test-mock-2: the shoppable Instagram reels. */
export default function BehindTheCraft() {
  const clips = COMMUNITY.clips.map((c) => ({ ...c, poster: imageSrc(c.poster), products: cards(c.products) }));
  return (
    <section className="btc" aria-labelledby="btc-title">
      <div className="btc-container btc-head">
        <div>
          <span className="btc-label">*Behind The Craft</span>
          <h2 id="btc-title">
            See It On{" "}
            <a className="btc-ig" href={COMMUNITY.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </h2>
        </div>
        <p>
          Follow{" "}
          <a href={COMMUNITY.instagram} target="_blank" rel="noopener noreferrer">
            @almusheer
          </a>{" "}
          on{" "}
          <a href={COMMUNITY.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>{" "}
          for more, and tag us wearing Al Musheer to be featured in our community showcase.
        </p>
      </div>
      <div className="cv">
        <CommunityVideos eyebrow={COMMUNITY.eyebrow} text={COMMUNITY.text} instagram={COMMUNITY.instagram} clips={clips} hideHead />
      </div>
    </section>
  );
}
