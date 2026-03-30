import { visit } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Root } from "mdast";

/**
 * remark 插件：自动给外部链接添加 target="_blank" rel="noopener noreferrer"
 */
const remarkExternalLinks: Plugin<[], Root> = (): Transformer<Root> => {
  return tree => {
    visit(tree, "link", (node: any) => {
      const url = node.url;
      // 仅处理 http/https 链接，忽略锚点、相对路径、邮件等
      if (url && /^https?:\/\//.test(url)) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = "_blank";
        node.data.hProperties.rel = "noopener noreferrer";
      }
    });
  };
};

export default remarkExternalLinks;
