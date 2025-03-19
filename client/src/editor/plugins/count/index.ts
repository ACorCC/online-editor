import { Plugin } from 'prosemirror-state';
import CountView from './CountView';

export default function createCount(): Plugin {
  return new Plugin({
    view(editorView) {
      return new CountView(editorView);
    },
  })
}
