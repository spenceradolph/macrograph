// @ts-check

/// <reference path="./preload.d.ts"/>

/** @type {import("webmidi").default} */
// @ts-expect-error
const WebMidi = require("webmidi");

WebMidi.enable((err) => {
  if (err) return;
  console.log("Midi enabled");

  WebMidi.addListener("connected", ({ port }) => {
    console.log("CONNETED", port.name);
    window.invokeIpc("midi:connected", { name: port.name });
  });
}, true);
