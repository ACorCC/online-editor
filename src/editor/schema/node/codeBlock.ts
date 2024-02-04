import { NodeSpec } from 'prosemirror-model'

const codeBlock: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }, { tag: 'code' }],
  toDOM() {
    return ['pre', ['code', 0]];
  },
};

export default codeBlock
