const CJK_CHARS_PER_MINUTE = 400;
const EN_WORDS_PER_MINUTE = 200;

/**
 * 计算中英文混合文本的字数和预计阅读时间
 * - 中文字符：按字符数计算，阅读速度约 400 字/分钟
 * - 英文单词：按空格分词，阅读速度约 200 词/分钟
 */
export function getReadingStats(rawBody: string): {
  /** CJK 字符数 + 英文单词数 */
  wordCount: number;
  /** 预计阅读分钟数，不足 1 分钟取 1 */
  minutes: number;
} {
  // 剥离 Markdown 语法符号（标题标记、链接语法、图片语法、代码块等）
  const plainText = rawBody
    .replace(/```[\s\S]*?```/g, "") // 代码块
    .replace(/`[^`]*`/g, "") // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, "") // 图片
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // 链接 → 保留文字
    .replace(/^#{1,6}\s+/gm, "") // 标题标记
    .replace(/>\s?/g, "") // 引用标记
    .replace(/[-*+]\s/g, "") // 无序列表标记
    .replace(/\d+\.\s/g, "") // 有序列表标记
    .replace(/---+/g, "") // 分割线
    .replace(/\|/g, "") // 表格线
    .replace(/\*+/g, "") // 加粗/斜体标记
    .replace(/~~.*?~~/g, "") // 删除线
    .replace(/<!--[\s\S]*?-->/g, "") // HTML 注释
    .replace(/<[^>]*>/g, "") // HTML 标签
    .trim();

  // 匹配 CJK 字符
  const cjkMatches = plainText.match(
    /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g
  );
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // 移除 CJK 字符后，按空格分词统计英文单词数
  const withoutCjk = plainText.replace(
    /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g,
    " "
  );
  const enWords = withoutCjk.split(/\s+/).filter(w => w.length > 0);
  const enCount = enWords.length;

  const wordCount = cjkCount + enCount;
  const minutes = Math.max(
    1,
    Math.ceil(cjkCount / CJK_CHARS_PER_MINUTE + enCount / EN_WORDS_PER_MINUTE)
  );

  return { wordCount, minutes };
}
