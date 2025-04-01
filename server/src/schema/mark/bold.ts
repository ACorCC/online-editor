
import { MarkSpec } from 'prosemirror-model'

const bold: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    { tag: 'b' },
    { style: 'font-weight=bold' },
    { style: 'font-weight=700' },
  ],
  toDOM() {
    return ['strong', 0];
  },
}

export default bold