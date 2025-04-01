
import { MarkSpec } from 'prosemirror-model'

const code: MarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code', 0];
  },
};

export default code