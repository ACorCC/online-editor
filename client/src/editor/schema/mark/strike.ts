
import { MarkSpec } from 'prosemirror-model'

const strike: MarkSpec = {
  parseDOM: [{ tag: 's' }, { tag: 'strike' }],
  toDOM() {
    return ['s', 0];
  },
};

export default strike