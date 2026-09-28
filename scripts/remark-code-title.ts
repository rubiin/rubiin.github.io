import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// Normally declared by mdast-util-to-hast, which is not in this project's type
// graph — declared here so `hProperties` is typed on `node.data`.
declare module "mdast" {
  interface Data {
    hProperties?: Record<string, unknown>;
  }
}

/** Matches `title="…"` anywhere in a fence's meta string. */
const TITLE = /(?:^|\s)title="([^"]*)"/;

/**
 * remark plugin: lifts a fenced code block's title into the rendered code
 * element so the header can show a file name.
 *
 *   ```ts title="src/lib/utils.ts"
 *
 * The MDX pipeline drops `meta` when a fence becomes `<pre><code>`, so the
 * title is copied onto `data.hProperties` — mdast-util-to-hast merges those
 * into the element's props, where the `pre` override in mdx-components.tsx
 * reads it back off the `code` child and hands it to CodeBlock.
 */
export const remarkCodeTitle: Plugin<[], Root> = () => (tree) => {
  visit(tree, "code", (node) => {
    const title = TITLE.exec(node.meta ?? "")?.[1]?.trim();
    if (!title) return;
    node.data = {
      ...node.data,
      hProperties: { ...node.data?.hProperties, "data-title": title },
    };
  });
};
