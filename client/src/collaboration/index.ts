import type WS from "@/network/ws"
import { EditorState } from "prosemirror-state"

export default class Collaboration {

  ws: WS
  
  constructor(ws: WS) {
    this.ws = ws
  }

  public async2Server(state: EditorState) {
    const docJSON = state.doc.toJSON()
    console.log('async2Server', docJSON)
    this.ws.send('update', {
      doc: docJSON
    })
  }
}