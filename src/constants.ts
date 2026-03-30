export interface Social {
  name: string;
  href: string;
  linkTitle: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

/** Per-locale label map. Omitted locales fall back to "zh", then the slug. */
type LocaleLabel = Partial<Record<"zh" | "en" | "ja", string>>;

export interface Category {
  /** Must match the subfolder name in posts/ (after stripping numeric prefix).
   *  e.g. folder "01-examples" → slug "examples" */
  slug: string;
  /** Display name. A plain string is shown for all locales.
   *  An object provides per-locale labels; missing locales fall back to zh. */
  label: string | LocaleLabel;
}

export const SOCIALS: Social[] = [];

export const SHARE_LINKS: Social[] = [];

// ── Configure your categories here ───────────────────────────────────────────
// slug must match a subfolder name in posts/ (numeric prefix stripped).
// Ordering here controls the display order on /categories.
export const CATEGORIES: Category[] = [
  { slug: "tech", label: { zh: "技术", en: "Tech", ja: "技術" } },
  { slug: "life", label: { zh: "生活", en: "Life", ja: "生活" } },
  { slug: "sports", label: { zh: "运动", en: "Sports", ja: "スポーツ" } },
  {
    slug: "entertainment",
    label: { zh: "影音游", en: "Media", ja: "エンタメ" },
  },
  { slug: "thoughts", label: { zh: "随想", en: "Thoughts", ja: "雑想" } },
];
