
import { Node } from "prosemirror-model";
import schema from "./schema";
import { DocumentInfo } from "./type";

const documentInfos: { [x in string]: DocumentInfo } = {}

const initialDocJSON = {
  type: "doc",
  content: [
      { type: "title", content: [{ type: "paragraph", content: [] }] },
      { type: "paragraph", content: [] }
  ]
}

const initDocument = () => {
  return {
    doc: Node.fromJSON(schema, initialDocJSON),
    version: 0,
    steps: [],
    stepClientIDs: []
  }
}

export const getDocumentInfo = (id: string) => {
  if (!documentInfos[id]) {
    documentInfos[id] = initDocument()
  }
  return documentInfos[id]
}
