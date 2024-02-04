import { NodeSpec } from 'prosemirror-model';

const heading: NodeSpec = {
  content: 'inline*',
  group: 'block',
  // 复制一个标题后，全选段落内容或者在一个空段落中粘贴，能粘贴整个标题块
  defining: true,
  attrs: { 
    level: { default: 1 },
    id: { default: '' }
  },
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } },
  ],
  toDOM(node) {
    return ['h' + node.attrs.level, {id: node.attrs.id}, 0];
  },
};

export default heading