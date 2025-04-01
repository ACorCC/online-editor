import type WS from "@/network/ws"

export default class Collaboration {

  ws: WS
  
  constructor(ws: WS) {
    this.ws = ws
  }

  public async2Server(version: number, steps: any[]) {
    this.ws.send({
      type: 'update',
      version,
      steps,
    })
  }
}