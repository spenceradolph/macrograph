// @ts-check

/// <reference path="./preload.d.ts"/>

/** @type {import("webmidi").default} */
// @ts-expect-error
const WebMidi = require("webmidi");

const invokeIpc = window.ipc.invoke;
const handleIpc = window.ipc.handle;

WebMidi.enable((err) => {
  if (err) return;
  console.log("Midi enabled");

  WebMidi.addListener("connected", ({ port }) => {
    console.log("CONNECTED", port.name, port.type);
    invokeIpc("connected", {
      name: port.name,
      type: port.type,
    });
  });

  WebMidi.addListener("disconnected", ({ port }) => {
    console.log("DISCONNETED", port.name, port.type);
    invokeIpc("disconnected", {
      name: port.name,
      type: port.type,
    });
  });

  handleIpc("send-basic", ({ device, note, channel, velocity }) => {
    const output = WebMidi.outputs.find((o) => o.name === device);
    if (!output) return;

    output.playNote(note, channel, {
      rawVelocity: true,
      velocity,
    });
  });
}, true);
