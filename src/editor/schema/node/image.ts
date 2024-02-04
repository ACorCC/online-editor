import { NodeSpec } from 'prosemirror-model'

const image: NodeSpec = {
  attrs: {
    src: {},
    alt: { default: null },
  },
  inline: true,
  group: 'inline',
  draggable: true,
  parseDOM: [{ tag: 'img[src]' }],
  toDOM(node) {
    const { src, alt } = node.attrs;
    return ['img', { src, alt }];
  },
};

export default image