"use client";

import BtnContent from "@/components/ui/BtnContent";
import { useMemo, useRef, useState } from "react";
import PostCard, { type PostSummary } from "./PostCard";

const POSTS_PER_PAGE = 6;

/** Category filter and pagination for the blog grid (same behaviour as the design's main.js). */
export default function BlogList({ posts, categories, author }: { posts: PostSummary[]; categories: string[]; author: string }) {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const filtersRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => posts.filter((p) => category === "all" || p.category === category), [posts, category]);
  const pages = Math.max(1, Math.ceil(matches.length / POSTS_PER_PAGE));
  const current = Math.min(page, pages - 1);
  const visible = matches.slice(current * POSTS_PER_PAGE, (current + 1) * POSTS_PER_PAGE);

  const changePage = (delta: number) => {
    setPage(current + delta);
    filtersRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <>
      <div className="filters" role="group" aria-label="Filter posts by category" ref={filtersRef}>
        {["all", ...categories].map((c) => (
          <button
            key={c}
            className="filter"
            type="button"
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setPage(0);
            }}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>
      <div className="post-grid">
        {visible.map((p) => (
          <PostCard key={p.slug} post={p} author={author} />
        ))}
      </div>
      <p className="empty-state" hidden={matches.length > 0}>
        No posts in this category yet.
      </p>
      <div className="pager">
        <button className="btn am-btn am-line am-back" type="button" hidden={current === 0} onClick={() => changePage(-1)}>
          <BtnContent label="Previous" icon="back" />
        </button>
        <button className="btn am-btn" type="button" hidden={current >= pages - 1} onClick={() => changePage(1)}>
          <BtnContent label="Next Blog" />
        </button>
      </div>
    </>
  );
}
