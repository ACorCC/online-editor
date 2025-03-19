import { NodeSpec } from 'prosemirror-model'

const link: NodeSpec = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inline: true,
  group: 'inline',
  draggable: true,
  parseDOM: [{ tag: 'a[href]' }],
  toDOM(node) {
    const { href, title } = node.attrs;
    return ['a', { href, title }, 0];
  },
};

export default link
