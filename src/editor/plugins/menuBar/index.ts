import { Plugin } from 'prosemirror-state';
import buildMenuItems from './buildMenuItems'
import MenuBarView from './MenuBarView'

export default function createMenuBarPlugin(): Plugin {
  return new Plugin({
    view(editorView) {
      return new MenuBarView(editorView, buildMenuItems(editorView.state.schema));
    },
  })
}
