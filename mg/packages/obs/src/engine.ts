import { Engine, BaseEngine, Property } from "macrograph";
import OBSWebsocket from "obs-websocket-js";

@Engine("obs")
class OBSEngine extends BaseEngine {
  ws = new OBSWebsocket();

  @Property({})
  address = "localhost:4444";
  
  async start() {
    this.ws.connect({ address: this.address });
  }
}

export const engine = new OBSEngine();
