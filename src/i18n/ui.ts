import { SITE } from "@/config";

export type SupportedLocale = "zh" | "en" | "ja";

// ── Chinese (default) ────────────────────────────────────────────
const zh = {
  "nav.posts": "文章",
  "nav.categories": "分类",
  "nav.tags": "标签",
  "nav.about": "关于",
  "nav.archives": "归档",
  "nav.search": "搜索",

  "common.skip_to_content": "跳到内容",
  "common.back_to_top": "回到顶部",
  "common.all_posts": "所有文章",
  "common.featured": "精选",
  "common.recent_posts": "最近文章",
  "common.no_more": "已经到底啦",
  "common.go_back": "返回",

  "date.format": "YYYY年M月D日",
  "date.updated": "更新：",

  "posts.title": "文章",

  "categories.title": "分类",
  "categories.desc": "按分类浏览文章",
  "categories.posts_count": "篇",
  "categories.back": "返回分类",

  "tags.title": "标签",

  "search.title": "搜索",
  "search.placeholder": "搜索文章...",
  "search.no_results": "没有找到相关文章",

  "archives.title": "归档",

  "footer.all_rights": "版权所有",

  "theme.toggle": "切换深/浅色模式",

  "menu.open": "打开菜单",
  "menu.close": "关闭菜单",

  "post.prev": "上一篇",
  "post.next": "下一篇",
  "post.unit_words": "字",
  "post.unit_read_time": "分钟",

  "toc.title": "目录",

  "posts.empty": "暂无文章",
  "tags.empty": "暂无标签",
  "archives.empty": "暂无归档",
} as const;

// ── English ──────────────────────────────────────────────────────
const en: Record<keyof typeof zh, string> = {
  "nav.posts": "Posts",
  "nav.categories": "Categories",
  "nav.tags": "Tags",
  "nav.about": "About",
  "nav.archives": "Archives",
  "nav.search": "Search",

  "common.skip_to_content": "Skip to content",
  "common.back_to_top": "Back to top",
  "common.all_posts": "All Posts",
  "common.featured": "Featured",
  "common.recent_posts": "Recent Posts",
  "common.no_more": "You've reached the end",
  "common.go_back": "Go back",

  "date.format": "MMMM D, YYYY",
  "date.updated": "Updated:",

  "posts.title": "Posts",

  "categories.title": "Categories",
  "categories.desc": "Browse posts by category",
  "categories.posts_count": "posts",
  "categories.back": "Back to Categories",

  "tags.title": "Tags",

  "search.title": "Search",
  "search.placeholder": "Search posts...",
  "search.no_results": "No results found",

  "archives.title": "Archives",

  "footer.all_rights": "All rights reserved",

  "theme.toggle": "Toggle light / dark mode",

  "menu.open": "Open menu",
  "menu.close": "Close menu",

  "post.prev": "Previous",
  "post.next": "Next",
  "post.unit_words": "words",
  "post.unit_read_time": "min read",

  "toc.title": "Contents",

  "posts.empty": "No posts yet",
  "tags.empty": "No tags yet",
  "archives.empty": "No archives yet",
};

// ── Japanese ──────────────────────────────────────────────────────
const ja: Record<keyof typeof zh, string> = {
  "nav.posts": "記事",
  "nav.categories": "カテゴリ",
  "nav.tags": "タグ",
  "nav.about": "について",
  "nav.archives": "アーカイブ",
  "nav.search": "検索",

  "common.skip_to_content": "コンテンツへスキップ",
  "common.back_to_top": "トップへ戻る",
  "common.all_posts": "すべての記事",
  "common.featured": "注目記事",
  "common.recent_posts": "最近の記事",
  "common.no_more": "最後まで読みました",
  "common.go_back": "戻る",

  "date.format": "YYYY年M月D日",
  "date.updated": "更新：",

  "posts.title": "記事",

  "categories.title": "カテゴリ",
  "categories.desc": "カテゴリ別に記事を閲覧",
  "categories.posts_count": "件",
  "categories.back": "カテゴリに戻る",

  "tags.title": "タグ",

  "search.title": "検索",
  "search.placeholder": "記事を検索...",
  "search.no_results": "結果が見つかりません",

  "archives.title": "アーカイブ",

  "footer.all_rights": "全著作権所有",

  "theme.toggle": "ライト / ダーク モード切替",

  "menu.open": "メニューを開く",
  "menu.close": "メニューを閉じる",

  "post.prev": "前の記事",
  "post.next": "次の記事",
  "post.unit_words": "文字",
  "post.unit_read_time": "分で読める",

  "toc.title": "目次",

  "posts.empty": "まだ記事はありません",
  "tags.empty": "まだタグはありません",
  "archives.empty": "まだアーカイブはありません",
};

// ── Exported dictionaries ─────────────────────────────────────────
export const LOCALES: Record<SupportedLocale, Record<string, string>> = {
  zh,
  en,
  ja,
};

export type UIKey = keyof typeof zh;

/** Default locale from config (used for static rendering). */
export const DEFAULT_LOCALE: SupportedLocale =
  String(SITE.lang).slice(0, 2).toLowerCase() === "en"
    ? "en"
    : String(SITE.lang).slice(0, 2).toLowerCase() === "ja"
      ? "ja"
      : "zh";

/** Static translate — used only for SSR/SSG defaults and <title> tags. */
export function t(key: UIKey): string {
  return LOCALES[DEFAULT_LOCALE][key] ?? zh[key];
}
