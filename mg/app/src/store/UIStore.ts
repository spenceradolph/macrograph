import { XYCoords } from "@macrograph/core";
import { Node, NodePin } from "./Nodes";
import { action, computed, observable } from "mobx";

export class UIStore {
  @observable createNodeMenu: {
    visible: boolean;
    position?: XYCoords;
  } = {
    visible: false,
  };

  @observable selectedNode?: Node;
  @observable draggingPin?: NodePin;
  socketLocations = observable(new Map<string, XYCoords>());
  @observable mouseDragLocation?: XYCoords;

  @computed
  get mousePath() {
    if (!this.draggingPin || !this.mouseDragLocation) return undefined;

    let socketLocation = this.draggingPin.position;

    return {
      x1: this.mouseDragLocation.x,
      y1: this.mouseDragLocation.y,
      x2: socketLocation.x,
      y2: socketLocation?.y,
    };
  }

  @action
  toggleCreateNodeMenu(position?: XYCoords) {
    this.createNodeMenu = {
      visible: position !== undefined,
      position,
    };
  }

  @action
  setDraggingPin(pin?: NodePin) {
    this.draggingPin?.setSelected(false);
    pin?.setSelected(true);

    this.draggingPin = pin;
  }

  @action
  setMouseDragLocation(location?: XYCoords) {
    this.mouseDragLocation = location;
  }

  @action
  setSocketLocation(id: string, location?: XYCoords) {
    if (location) this.socketLocations.set(id, location);
    else this.socketLocations.delete(id);
  }
}
