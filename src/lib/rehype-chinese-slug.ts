import { slugify } from '@/lib/utils';

export default function rehypeChineseSlug() {
  return (tree: any) => {
    const slugCounts = new Map<string, number>();

    visit(tree, (node: any) => {
      if (
        node.type === 'element' &&
        ['h2', 'h3', 'h4'].includes(node.tagName) &&
        !node.properties?.id
      ) {
        const text = getTextContent(node);
        let id = slugify(text);

        const count = slugCounts.get(id) || 0;
        slugCounts.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;

        node.properties = node.properties || {};
        node.properties.id = id;
      }
    });
  };
}

function visit(node: any, callback: (n: any) => void) {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      visit(child, callback);
    }
  }
}

function getTextContent(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}
