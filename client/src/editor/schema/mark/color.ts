
import { MarkSpec } from 'prosemirror-model'

const color: MarkSpec = {
  attrs: {
    color: { default: 'black' }
  },
  parseDOM: [
    {
      style: 'color',
      getAttrs: value => ({ color: value })
    },
  ],
  toDOM(mark) {
    return ['strong', {style: `color: ${mark.attrs.color}`}, 0];
  },
}

export default color