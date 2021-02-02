import OBSWebsocket from "obs-websocket-js";
import { EventNode, ExecNode, Node, types } from "macrograph";

import { engine } from "./engine";

@Node({ displayName: "Set Current Scene" })
export class SetCurrentScene extends ExecNode {
  build() {
    super.build();
    this.AddInputDataPin("Scene", types.string);
  }

  get SceneInputPin() {
    return this.InputDataPins[0];
  }

  Work() {
    engine.emit("SetCurrentScene", { "scene-name": this.SceneInputPin.Data });
  }
}

@Node({ displayName: "Current Scene Changed" })
export class CurrentSceneChanged extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Scene", types.string);

    engine.on("SwitchScenes", (args) =>
      this.Start({ sceneName: args["scene-name"] })
    );
  }

  get SceneOutputPin() {
    return this.OutputDataPins[0];
  }

  Fire(data: { sceneName: string }) {
    this.SceneOutputPin.Data = data.sceneName;
  }
}
