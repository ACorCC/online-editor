import { Plugin } from 'prosemirror-state';
import CatalogBarView from './CatalogView';

export default function createCatalog(): Plugin {
  return new Plugin({
    view(editorView) {
      return new CatalogBarView(editorView);
    },
  })
}
