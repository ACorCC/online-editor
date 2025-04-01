interface IMessage {
  type: string
  version: number
  steps: any[]
  clientID: string | number
  clientIDs: Array<string | number>
  doc?: any
  stepClientIDs?: Array<string | number>
}
