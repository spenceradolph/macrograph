import { Engine, BaseEngine, Property, Text } from "macrograph";
import OBSWebsocket from "obs-websocket-js";

@Engine("obs")
class OBSEngine extends BaseEngine {
  ws = new OBSWebsocket();

  connected = false;

  @Property()
  address!: Text;

  async start() {
    this.address.value = "localhost:4444";

    try {
      await this.ws.connect({ address: this.address.value });
      this.connected = true;
    } catch {
      this.connected = false;
    }
  }
}

export const engine = new OBSEngine();
