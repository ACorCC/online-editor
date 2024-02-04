import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import schema from './schema'
import plugins from './plugins'
import decorations from './decorations'
import { Node, Schema } from "prosemirror-model"

export default class Editor {
  element: HTMLElement
  view: EditorView
  state: EditorState
  schema: Schema

  constructor(element: HTMLElement) {
    this.element = element
    this.schema = schema
    this.state = this.createState()
    this.view = this.createView()
  }

  createState(): EditorState {
    return EditorState.create({
      doc: this.initialDoc(),
      schema,
      plugins,
    })
  }

  createView(): EditorView {
    return new EditorView(this.element, {
      state: this.state,
      decorations,
      // dispatchTransaction(transaction) {
      //   const newState = editorView.state.apply(transaction);
      //   editorView.updateState(newState);
      // },
    })
  }

  initialDoc(): Node {
    const title = this.schema.nodes.title.create(null, this.schema.nodes.paragraph.create())
    const body = this.schema.nodes.paragraph.create()
    const doc = this.schema.nodes.doc.create(null, [title, body])
    return doc
  }
}
