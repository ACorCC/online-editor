import { Step } from "prosemirror-transform";

class Authority {

  public doc: any
  public steps: Step[]
  public stepClientIDs: string[]
  public onNewSteps: Function[]

  constructor(doc: any) {
    this.doc = doc;
    this.steps = [];
    this.stepClientIDs = [];
    this.onNewSteps = [];
  }
  getVersion() {
    return this.steps.length;
  }
  receiveSteps(version: number, steps: Step[], clientID: string) {
    if (version != this.steps.length) return;
    // Apply and accumulate new steps
    steps.forEach((step) => {
      this.doc = step.apply(this.doc).doc;
      this.steps.push(step);
      this.stepClientIDs.push(clientID);
    });
    // Signal listeners
    this.onNewSteps.forEach(function (f) {
      f();
    });
  }
  stepsSince(version: number) {
    return {
      steps: this.steps.slice(version),
      clientIDs: this.stepClientIDs.slice(version),
    };
  }
}

export default Authority