"use client";

import { useStore } from "./StoreProvider";

export default function HeartButton({ slug, name }: { slug: string; name: string }) {
  const { wishlist, toggleWish } = useStore();
  const on = wishlist.includes(slug);
  return (
    <button
      className={on ? "heart on" : "heart"}
      type="button"
      aria-label={`Save ${name} to wishlist`}
      aria-pressed={on}
      onClick={() => toggleWish(slug)}
    >
      {on ? "♥" : "♡"}
    </button>
  );
}
