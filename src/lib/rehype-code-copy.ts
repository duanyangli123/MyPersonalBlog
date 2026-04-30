export default function rehypeCodeCopy() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'element' &&
        node.tagName === 'pre' &&
        node.children?.[0]?.tagName === 'code'
      ) {
        node.properties = node.properties || {};
        node.properties.style = 'position: relative;';

        node.children.push({
          type: 'element',
          tagName: 'button',
          properties: {
            className: 'code-copy-btn',
            'data-code': '',
            style: 'position:absolute;top:8px;right:8px;padding:2px 8px;font-size:12px;border-radius:4px;background:#374151;color:#d1d5db;border:none;cursor:pointer;z-index:1;',
          },
          children: [{ type: 'text', value: '复制' }],
        });
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
