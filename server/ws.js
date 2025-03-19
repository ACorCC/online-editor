const WebSocket = require('ws')
const url = require("url");

// 模拟数据库（这里用 JSON 存储文档）
let documentState = {
  type: "doc",
  content: [
      { type: "paragraph", content: [{ type: "text", text: "Hello ProseMirror!" }] }
  ]
};

class WS {

  _users = new Map()

  _wsServer = null

  constructor() {
    const wsServer = new WebSocket.Server({ port: 8080 })
    this._wsServer = wsServer
    console.log('listening on port 8080...')

    wsServer.on('connection', (ws, req) => {
      const params = new URLSearchParams(url.parse(req.url).query);
      const userId = params.get("userId");
      if (!userId) {
        this._send(userId, ws, {
          type: 'error',
          error: "缺少 userId"
        })
        ws.close();
        return;
      }
      if (this._isLogin(userId)) {
        this._send(userId, ws, {
          type: 'error',
          error: "userId已登录,换个号"
        })
        ws.close();
        return;
      }
      this._login(userId, ws)
  
      ws.on('message', message => this._onMessage(message, { ws, userId }))
  
      ws.on('close', () => {
        this._logout(userId)
      })
    })
  }

  _isLogin(userId) {
    return this._users.has(userId)
  }

  _login(userId, ws) {
    this._users.set(userId, ws)
    console.log(`${userId} login`)
    console.log(`current users count: ${this._users.size}, userIds: [${Array.from(this._users.keys())}]`)
    this._send(userId, ws, {
      type: 'init',
      doc: documentState
    })
  }

  _logout(userId) {
    this._users.delete(userId)
    console.log(`${userId} logout`)
    console.log(`current users count: ${this._users.size}, userIds: [${Array.from(this._users.keys())}]`)
  }

  _send(userId, ws, data) {
    ws.send(JSON.stringify({
      ...data,
      userId
    }))
  }

  _onMessage(message, context) {
    const { ws, userId } = context
    const data = JSON.parse(message);
    console.log(`Received ${userId} message:`, data)

    if (data.type === "update") {
      console.log("收到文档更新:", JSON.stringify(data.data.doc));
      
      // 更新文档状态（存数据库）
      documentState = data.data.doc;

      // 广播给所有客户端
      this._wsServer.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          this._send('', client, {
            type: 'update',
            doc: documentState
          })
        }
      });
    }
  }
}

module.exports = WS