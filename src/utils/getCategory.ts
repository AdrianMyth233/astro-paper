import { CATEGORIES } from "@/constants";
import { DEFAULT_LOCALE } from "@/i18n/ui";

/** Extract category slug from post id (subfolder name). Returns null for root-level posts.
 *  Strips numeric sort prefix from folder name, e.g. "01-examples" → "examples" */
export function getCategory(id: string): string | null {
  const slashIndex = id.indexOf("/");
  if (slashIndex === -1) return null;
  const folderName = id.slice(0, slashIndex);
  return folderName.replace(/^\d+-/, "");
}

/** Get display label for a category slug. Falls back to zh, then slug. */
export function getCategoryLabel(slug: string): string {
  const found = CATEGORIES.find(c => c.slug === slug);
  if (!found) return slug;

  const { label } = found;
  if (typeof label === "string") return label;

  // SSR uses DEFAULT_LOCALE; client i18n.ts handles runtime override
  return label[DEFAULT_LOCALE] ?? label.zh ?? slug;
}
