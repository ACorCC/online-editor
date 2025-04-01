import schema from "@/editor/schema"
import { getUserId } from "@/user"
import { receiveTransaction } from "prosemirror-collab"
import { Step } from "prosemirror-transform"

export default class WS {

  public onReady: (data: IMessage) => void = () => {}

  private ws: WebSocket

  constructor() {
    this.ws = new WebSocket(`ws://localhost:8081?userId=${getUserId()}`)
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

  public send(params: { [key in string]: any }) {
    this.ws.send(JSON.stringify({
      ...params,
      userId: getUserId(),
      clientId: getUserId(),
    }))
  }

  private _onMessage(event: MessageEvent) {
    let data: IMessage = JSON.parse(event.data)
    switch (data.type) {
      case 'init':
        this.onReady(data)
        break
      case 'update':
        this._onUpdate(data)
        break
      case 'sync':
        break
      case 'error':
        break
      default:
        break
    }
  }

  private _onUpdate(data: IMessage) {
    console.log('收到服务端更新', data)
    const { steps, version, clientIDs } = data
    const newSteps = steps.map((step: any) => Step.fromJSON(schema, step))
    const view = window.view
    const tr = receiveTransaction(view.state, newSteps, clientIDs);
    console.error("xxxx ~ WS ~ _onUpdate ~ tr:", data, tr, tr.steps.length)
    view.dispatch(tr);
  }
}
