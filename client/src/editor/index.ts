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
  initialDoc: any

  constructor(element: HTMLElement, initialDoc?: any) {
    this.element = element
    this.initialDoc = initialDoc
    this.schema = schema
    this.state = this.createState()
    this.view = this.createView()
  }

  createState(): EditorState {
    return EditorState.create({
      doc: this.createDoc(),
      schema,
      plugins,
    })
  }

  createView(): EditorView {
    return new EditorView(this.element, {
      state: this.state,
      decorations,
      dispatchTransaction: transaction => {
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);
        
        const isFromServer = !!transaction.getMeta('isFromServer')
        console.error("xxxx ~~ isFromServer:", transaction.getMeta('isFromServer'))
        if (!isFromServer && transaction.docChanged) {
          window.collaboration.async2Server(newState)
        }
      },
    })
  }

  createDoc(): Node {
    if (this.initialDoc) {
      return this.schema.nodeFromJSON(this.initialDoc)
    }
    const title = this.schema.nodes.title.create(null, this.schema.nodes.paragraph.create())
    const body = this.schema.nodes.paragraph.create()
    const doc = this.schema.nodes.doc.create(null, [title, body])
    return doc
  }
}
