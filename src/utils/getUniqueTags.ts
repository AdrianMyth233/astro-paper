import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]): Tag[] => {
  const tagCounts = new Map<string, { tagName: string; count: number }>();

  posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .forEach(tag => {
      const key = slugifyStr(tag);
      const existing = tagCounts.get(key);
      if (existing) {
        existing.count++;
      } else {
        tagCounts.set(key, { tagName: tag, count: 1 });
      }
    });

  return [...tagCounts.entries()]
    .map(([tag, { tagName, count }]) => ({ tag, tagName, count }))
    .sort((a, b) =>
      a.tagName.localeCompare(b.tagName, ["zh-CN", "en-US", "ja-JP"], {
        sensitivity: "base",
      })
    );
};

export default getUniqueTags;
