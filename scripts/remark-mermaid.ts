import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * remark plugin: converts fenced ```mermaid code blocks into
 * `<Mermaid chart="...">` MDX JSX elements so the client component can
 * render them lazily. Non-mermaid fences are left untouched for Shiki.
 */
export const remarkMermaid: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'code', (node, index, parent) => {
    if (node.lang !== 'mermaid' || index === undefined || index === null || !parent) {
      return
    }
    const element: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'Mermaid',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'chart',
          value: node.value,
        },
      ],
      children: [],
    }
    parent.children.splice(index, 1, element)
  })
}
