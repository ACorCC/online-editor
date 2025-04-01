import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import schema from './schema'
import createPlugins from './plugins'
import decorations from './decorations'
import { Node, Schema } from "prosemirror-model"
import { sendableSteps } from "prosemirror-collab"

export default class Editor {
  element: HTMLElement
  view: EditorView
  state: EditorState
  schema: Schema
  initialDoc: any

  constructor(element: HTMLElement) {
    this.element = element
    // @ts-ignore
    this.initialDoc = window.initialDoc
    this.schema = schema
    this.state = this.createState()
    this.view = this.createView()
  }

  createState(): EditorState {
    return EditorState.create({
      doc: this.createDoc(),
      schema,
      plugins: createPlugins(),
    })
  }

  createView(): EditorView {
    return new EditorView(this.element, {
      state: this.state,
      decorations,
      dispatchTransaction: transaction => {
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);

        let sendable = sendableSteps(newState)
        console.error("xxxx ~ sendable:", sendable)
        if (sendable) {
          window.collaboration.async2Server(sendable.version, sendable.steps)
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
