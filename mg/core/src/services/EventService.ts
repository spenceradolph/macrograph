import { EventEmitter2 } from "eventemitter2";

export default class IpcBus extends EventEmitter2 {
  constructor() {
    super({ wildcard: true, delimiter: ":" });
  }

  send(type: string, data: any) {
    this.emit("IPC_MAIN", { type, data });
  }

  onMany(listeners: Record<string, (a: any) => any>) {
    Object.entries(listeners).forEach(([k, v]) => this.on(k, v));
  }
}
