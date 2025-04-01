
import { MarkSpec } from 'prosemirror-model'

const italic: MarkSpec = {
  parseDOM: [{ tag: 'em' }, { tag: 'i' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['em', 0];
  },
};

export default italic