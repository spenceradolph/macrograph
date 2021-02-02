"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webmidi_1 = require("webmidi");
var electron_1 = require("electron");
console.log("sending");
webmidi_1.default.enable(function () {
    electron_1.ipcRenderer.invoke("midi:test", webmidi_1.default.inputs.map(function (i) { return i.name; }).join(" "));
}, true);
//# sourceMappingURL=index.js.map