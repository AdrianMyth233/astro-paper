/**
 * Client-side i18n runtime.
 *
 * How it works:
 * 1. Astro renders HTML with data-i18n="key" attributes on translatable elements.
 *    The default text is always Chinese (DEFAULT_LOCALE).
 * 2. On page load, this script reads the user's preferred language from
 *    localStorage ("i18n-lang") and replaces text content accordingly.
 * 3. The language switcher in the header updates localStorage and triggers a re-scan.
 * 4. On ViewTransitions navigation, the scan re-runs via astro:after-swap.
 *
 * For attributes like aria-label, title, data-label-open/close, use:
 *   data-i18n-attr="aria-label:menu.open"  →  aria-label gets the translated value
 *
 * For category labels, use:
 *   data-i18n-cat="tech"  →  text content gets the locale-specific category name
 */

import { LOCALES, type SupportedLocale } from "@/i18n/ui";
import { CATEGORIES } from "@/constants";

const STORAGE_KEY = "i18n-lang";

export function getUserLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en" || stored === "ja") return stored;
  } catch {}
  return "zh";
}

export function setUserLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
}

type LocaleLabel = Partial<Record<"zh" | "en" | "ja", string>>;

/** Translate a category label object by locale. */
function translateCategoryLabel(
  label: string | LocaleLabel,
  locale: SupportedLocale
): string {
  if (typeof label === "string") return label;
  return label[locale] ?? label.zh ?? "";
}

function applyTranslations(locale: SupportedLocale): void {
  const dict = LOCALES[locale];
  if (!dict) return;

  // Replace text content
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (key && dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Replace HTML attributes (format: "attrName:i18n.key" or "attr1:key1,attr2:key2")
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach(el => {
    const spec = el.dataset.i18nAttr;
    if (!spec) return;
    for (const pair of spec.split(",")) {
      const [attrName, i18nKey] = pair.split(":");
      if (attrName && i18nKey && dict[i18nKey]) {
        el.setAttribute(attrName.trim(), dict[i18nKey.trim()]);
      }
    }
  });

  // Replace category labels (format: data-i18n-cat="tech")
  document.querySelectorAll<HTMLElement>("[data-i18n-cat]").forEach(el => {
    const slug = el.dataset.i18nCat;
    if (!slug) return;
    const cat = CATEGORIES.find(c => c.slug === slug);
    if (cat) {
      el.textContent = translateCategoryLabel(cat.label, locale);
    }
  });
}

/** Update the page title if it contains a translated segment.
 *  Title is always rendered as "中文 | 乱八七糟", we replace the first segment. */
function applyTitle(locale: SupportedLocale): void {
  const dict = LOCALES[locale];
  if (!dict) return;

  // Static UI title translations
  const titleMap: Record<string, string> = {
    文章: dict["posts.title"],
    分类: dict["categories.title"],
    标签: dict["tags.title"],
    归档: dict["archives.title"],
    搜索: dict["search.title"],
  };

  // Category name translations (from CATEGORIES config)
  const catTitleMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    if (typeof cat.label === "string") continue;
    const zhLabel = cat.label.zh;
    if (zhLabel)
      catTitleMap[zhLabel] = translateCategoryLabel(cat.label, locale);
  }

  const raw = document.title;

  // Try category name first (e.g. "技术 | 分类 | 乱八七糟")
  for (const [zhWord, translated] of Object.entries(catTitleMap)) {
    if (raw.startsWith(zhWord)) {
      if (translated && translated !== zhWord) {
        document.title = translated + raw.slice(zhWord.length);
      }
      return;
    }
  }

  // Then try static UI titles
  for (const [zhWord, translated] of Object.entries(titleMap)) {
    if (raw.startsWith(zhWord)) {
      if (translated && translated !== zhWord) {
        document.title = translated + raw.slice(zhWord.length);
      }
      return;
    }
  }
}

function run(): void {
  const locale = getUserLocale();
  applyTranslations(locale);
  applyTitle(locale);
}

// Initial run
run();

// Re-run on ViewTransitions navigation
document.addEventListener("astro:after-swap", run);

// Listen for language switch from header
document.addEventListener("i18n:change", (e: Event) => {
  const locale = (e as CustomEvent<{ locale: SupportedLocale }>).detail?.locale;
  if (locale) {
    setUserLocale(locale);
    run();
  }
});
