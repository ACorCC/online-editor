import { NodeSpec } from 'prosemirror-model';

const title: NodeSpec = {
  content: 'paragraph',
  group: 'title',
  parseDOM: [{ tag: 'div.title', contentElement: 'p' }],
  toDOM() {
    return ['div', { class: 'title' }, 0]
  },
};

export default title