import { NodeSpec } from 'prosemirror-model'

const blockquote: NodeSpec = {
  content: 'block+',
  group: 'block',
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  },
}

export default blockquote