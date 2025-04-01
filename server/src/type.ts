import { Step } from "prosemirror-transform"

export type DocumentInfo = {
  doc: any,
  version: number,
  steps: Step[],
  stepClientIDs: string[]
}