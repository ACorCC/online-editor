import Editor from "@/editor"
import "@/components/MenuBar"
import "@/components/CatalogBar"
import "@/components/CountBar"
import { EditorView } from "prosemirror-view"
import { TextSelection } from "prosemirror-state"
import Collaboration from "@/collaboration"
import WS from "@/network/ws"

const createEditor = () => {
  const editorDom = document.createElement('div')
  editorDom.classList.add('editor')
  window.editor = new Editor(editorDom)
  window.view = window.editor.view
  return editorDom
}

// 让编辑器视图聚焦并将光标放在标题的末尾
function focusOnTitleEnd(editorView: EditorView) {
  const { state } = editorView;
  const firstParagraphPos = 1
  const firstParagraph = state.doc.nodeAt(firstParagraphPos)

  if (firstParagraph) {
    const pos = firstParagraphPos + firstParagraph.nodeSize - 1
    const selection = TextSelection.create(state.doc, pos);
    editorView.dispatch(state.tr.setSelection(selection));
    editorView.focus();
  }
}

const createApp = (app: Element) => {
  const ws = new WS()
  ws.onReady = (data: IMessage) => {
    const { doc, version } = data
    //@ts-ignore
    window.initialDoc = doc
    //@ts-ignore
    window.initialVersion = version
    window.collaboration = new Collaboration(ws)
    app.append(createEditor())
    focusOnTitleEnd(window.view)
  }
}

export default createApp