import { NodeSpec } from 'prosemirror-model'

const orderedList: NodeSpec = {
  content: 'listItem+',
  group: 'block',
  parseDOM: [{ tag: 'ol' }],
  toDOM() {
    return ['ol', 0];
  },
};

export default orderedList