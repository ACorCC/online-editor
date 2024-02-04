import { EditorState } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export default function decorations(state: EditorState): DecorationSet {
  const { doc } = state
  const titlePos = 0
  const decorations = []
  if (doc.nodeAt(titlePos)?.textContent.length === 0) {
    const decoration = Decoration.node(titlePos + 1, titlePos + 3, {class: 'empty-title'})
    decorations.push(decoration)
  }
  const titleSize = doc.nodeAt(titlePos)?.nodeSize || 0
  const firstTilePos = titleSize || 0
  if (doc.content.size - titleSize === 2 && doc.nodeAt(firstTilePos)?.type.name === 'paragraph') {
    const decoration = Decoration.node(firstTilePos, firstTilePos + 2, {class: 'empty-content'})
    decorations.push(decoration)
  }
  return DecorationSet.create(doc, decorations)
}