import { NodeSpec } from 'prosemirror-model'

const listItem: NodeSpec = {
  content: 'paragraph block*',
  defining: true,
  parseDOM: [{ tag: 'li' }],
  toDOM() {
    return ['li', 0];
  },
};

export default listItem