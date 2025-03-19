import { getUserId } from "@/user"
import { Slice } from "prosemirror-model"

export default class WS {

  public onReady: (doc: any) => void = () => {}

  private ws: WebSocket

  constructor() {
    this.ws = new WebSocket(`ws://localhost:8080?userId=${getUserId()}`)
    this.ws.onopen = () => {
      console.log('ws connected')
    }
    this.ws.onmessage = this._onMessage.bind(this)
    this.ws.onclose = () => {
      console.log('ws closed')
    }
    this.ws.onerror = (err) => {
      console.error('ws error', err)
    }
  }

  public send(type: string, data: { [key in string]: any }) {
    data.userId = getUserId()
    this.ws.send(JSON.stringify({
      type,
      data
    }))
  }

  private _onMessage(event: MessageEvent) {
    let data: IMessage = JSON.parse(event.data)
    console.log('ws received', data)
    switch (data.type) {
      case 'init':
        this.onReady(data.doc)
        break
      case 'update':
        console.log("收到文档:", data.doc);
        const doc = data.doc
        const view = window.view
        // 其他客户端更新时，更新本地文档
        const { state, dispatch } = view;
        const tr = state.tr.replace(0, state.doc.nodeSize - 2, new Slice(view.state.schema.nodeFromJSON(doc).content, 0, 0));
        tr.setMeta('isFromServer', true);
        dispatch(tr);
        break
      default:
        break
    }
  }
}
