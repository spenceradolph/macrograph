// @ts-check

/// <reference path="./preload.d.ts"/>

import WebMidi, { Input, Output } from "webmidi";

const invokeIpc = window.ipc.invoke;
const handleIpc = window.ipc.handle;

WebMidi.enable((err) => {
  if (err) return;

  let input: Input | undefined;
  let output: Output | undefined;

  WebMidi.addListener("connected", ({ port }) =>
    invokeIpc("connected", {
      name: port.name,
      type: port.type,
    })
  );

  WebMidi.addListener("disconnected", ({ port }) =>
    invokeIpc("disconnected", {
      name: port.name,
      type: port.type,
    })
  );

  handleIpc("set-input", (i) => {
    input?.removeListener();
    input = WebMidi.inputs.find((_i) => _i.name === i);
    if (!input) return;

    input.addListener("noteon", "all", ({ channel, rawVelocity, note }) => {
      invokeIpc("standard-received", {
        channel,
        value: rawVelocity,
        index: note.number,
        type: 0,
      });
    });
    input.addListener("noteoff", "all", ({ channel, note }) => {
      invokeIpc("standard-received", {
        channel,
        index: note.number,
        value: 0,
        type: 1,
      });
    });
    input.addListener(
      "controlchange",
      "all",
      ({ channel, value, controller }) => {
        invokeIpc("standard-received", {
          channel,
          value,
          index: controller.number,
          type: 2,
        });
      }
    );
  });
  handleIpc("set-output", (o) => {
    output = WebMidi.outputs.find((_i) => _i.name === o);
  });

  handleIpc("send-basic", ({ index, channel, type, value }) => {
    if (!output) return;

    switch (type) {
      case 0:
        output.playNote(index, channel, {
          rawVelocity: true,
          velocity: value,
        });
        break;
      case 1:
        output.stopNote(index, channel);
        break;
      case 2:
        output.sendControlChange(index, value, channel);
        break;
    }
  });

  handleIpc("send-sysex", ({ device, data }) => {
    const output = WebMidi.outputs.find((o) => o.name === device);
    if (!output) return;

    output.sendSysex(
      [],
      data.slice(
        data[0] === 0xf0 ? 1 : 0,
        data[data.length - 1] === 0xf7 ? -1 : undefined
      )
    );
  });
}, true);
