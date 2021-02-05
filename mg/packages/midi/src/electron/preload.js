const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  invoke: (type, data) => {
    ipcRenderer.invoke(`midi`, { type, data });
  },

  handle: (topic, callback) => {
    ipcRenderer.on(topic, callback);
  },
});
