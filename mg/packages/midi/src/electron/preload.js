const { ipcRenderer } = require("electron");

window.invokeIpc = (type, ...data) => {
  ipcRenderer.invoke(type, ...data);
};
