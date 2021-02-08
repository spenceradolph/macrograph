import { EventNode, ExecNode, Node, types } from "macrograph";
import { Engine, MIDIEventType } from "./engine";

@Node({ displayName: "Device Connected" })
class MIDIDeviceConnected extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Name", types.string);
    this.AddOutputDataPin("Is Input", types.boolean);

    Engine.on("connected", (d) => this.Start(d));
  }

  Fire({ name, type }: any) {
    this.OutputDataPins[0].Data = name;
    this.OutputDataPins[1].Data = type === "input";
  }
}

@Node({ displayName: "Device Disconnected" })
class MIDIDeviceDisconnected extends EventNode {
  build() {
    super.build();
    this.AddOutputDataPin("Name", types.string);
    this.AddOutputDataPin("Is Input", types.boolean);

    Engine.on("disconnected", (d) => this.Start(d));
  }

  Fire({ name, type }: any) {
    this.OutputDataPins[0].Data = name;
    this.OutputDataPins[1].Data = type === "input";
  }
}

@Node({ displayName: "Send Standard MIDI" })
class MIDISendStandard extends ExecNode {
  build() {
    super.build();

    this.AddInputDataPin("Index", types.int);
    this.AddInputDataPin("Value", types.int);
    this.AddInputDataPin("Channel", types.int);
    this.AddInputDataPin("Type", types.enum(MIDIEventType));
  }

  async Work() {
    const [index, value, channel, type] = this.InputDataPins.map((p) => p.Data);
    Engine.emit("send-basic", { index, value, channel, type });
  }
}

@Node({ displayName: "Send Sysex" })
class MIDISendSysex extends ExecNode {
  build() {
    super.build();

    this.AddInputDataPin("Data", types.array(types.int));
  }

  async Work() {
    const data = this.InputDataPins[0].Data;
    Engine.emit("send-sysex", { data });
  }
}

@Node({ displayName: "Standard MIDI Received" })
class MIDIReceiveStandard extends EventNode {
  build() {
    super.build();

    this.AddOutputDataPin("Index", types.int);
    this.AddOutputDataPin("Value", types.int);
    this.AddOutputDataPin("Channel", types.int);
    this.AddOutputDataPin("Type", types.enum(MIDIEventType));

    Engine.on("standard-received", (data) => this.Start(data));
  }

  Fire({ index, value, channel, type }: any) {
    this.OutputDataPins[0].Data = index;
    this.OutputDataPins[1].Data = value;
    this.OutputDataPins[2].Data = channel;
    this.OutputDataPins[3].Data = type;
  }
}

@Node({ displayName: "Note On Received" })
class MIDINoteOn extends EventNode {
  build() {
    super.build();

    this.AddOutputDataPin("Note", types.int);
    this.AddOutputDataPin("Velocity", types.int);
    this.AddOutputDataPin("Channel", types.int);

    Engine.on("noteon", (d) => this.Start(d));
  }

  Fire({ index, value, channel }: any) {
    this.OutputDataPins[0].Data = index;
    this.OutputDataPins[1].Data = value;
    this.OutputDataPins[2].Data = channel;
  }
}
@Node({ displayName: "Note Off Received" })
class MIDINoteOff extends EventNode {
  build() {
    super.build();

    this.AddOutputDataPin("Note", types.int);
    this.AddOutputDataPin("Channel", types.int);

    Engine.on("noteoff", (d) => this.Start(d));
  }

  Fire({ index, channel }: any) {
    this.OutputDataPins[0].Data = index;
    this.OutputDataPins[1].Data = channel;
  }
}
