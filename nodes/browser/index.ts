import webmidi from "webmidi";
import { ipcRenderer } from "electron";

console.log("sending");

webmidi.enable(() => {
  ipcRenderer.invoke("midi:test", webmidi.inputs.map(i => i.name).join(" "));
}, true);
