import WebSocket from 'ws'
import url from "url"
import { getDocumentInfo } from './document'
import Authority from './authority'
import { Step } from "prosemirror-transform"
import schema from './schema/index'

const documentId = 'default'

class WS {

  _users = new Map()

  _wsServer: WebSocket.Server

  authority: Authority

  constructor() {
    const wsServer = new WebSocket.Server({ port: 8081 })
    this._wsServer = wsServer

    const documentInfo = getDocumentInfo(documentId)
    this.authority = new Authority(documentInfo.doc);
    this.authority.onNewSteps.push(() => {
      documentInfo.doc = this.authority.doc
      documentInfo.steps = this.authority.steps
      documentInfo.stepClientIDs = this.authority.stepClientIDs
      documentInfo.version = this.authority.getVersion()
    })
    
    console.log('listening on port 8081...')

    wsServer.on('connection', (ws, req) => {
      if (!req.url) {
        ws.close();
        return;
      }
      const params = new URLSearchParams(url.parse(req.url).query || '');
      const userId = params.get("userId");
      if (!userId) {
        ws.send(JSON.stringify({
          type: 'error',
          error: "缺少 userId"
        }))
        ws.close();
        return;
      }
      if (this._isLogin(userId)) {
        ws.send(JSON.stringify({
          type: 'error',
          error: "userId已登录,换个号"
        }))
        ws.close();
        return;
      }
      this._login(userId, ws)
  
      ws.on('message', message => this._onMessage(JSON.parse(message.toString()), ws))
  
      ws.on('close', () => {
        this._logout(userId)
      })
    })
  }

  _isLogin(userId: string) {
    return this._users.has(userId)
  }

  _login(userId: string, ws: WebSocket) {
    this._users.set(userId, ws)
    console.log(`${userId} login`)
    console.log(`current users count: ${this._users.size}, userIds: [${Array.from(this._users.keys())}]`)
    ws.send(JSON.stringify({
      type: 'init',
      ...getDocumentInfo(documentId),
    }))
  }

  _logout(userId: string) {
    this._users.delete(userId)
    console.log(`${userId} logout`)
    console.log(`current users count: ${this._users.size}, userIds: [${Array.from(this._users.keys())}]`)
  }

  _onMessage(message: any, ws: WebSocket) {
    if (message.type === "update") {
      console.log("收到客户端更新:", JSON.stringify(message));
      const { steps, clientId, version } = message
      const newSteps = steps.map((step: Step) => Step.fromJSON(schema, step));

      if (version !== this.authority.getVersion()) {
        console.log('版本不一致,客户端', version, '服务端', this.authority.getVersion())
        ws.send(JSON.stringify({
          type: 'sync',
          version: this.authority.getVersion(),
        }))
        // todo...
        return
      }
      
      this.authority.receiveSteps(version, newSteps, clientId);

      // 广播给所有客户端
      this._wsServer.clients.forEach(client => {
        const message = JSON.stringify({
          type: 'update',
          version: this.authority.getVersion(),
          ...this.authority.stepsSince(version),
        })
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      });
    }
  }

}

export default WS