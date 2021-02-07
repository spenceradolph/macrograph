import { BrowserWindow, ipcMain } from "electron";
import { Engine } from "./engine";

export const win = new BrowserWindow({
  show: false,
  webPreferences: {
    contextIsolation: true,
    preload: `${__dirname}/electron/preload.js`,
  },
});

win.webContents.openDevTools();

win.loadURL(`file://${__dirname}/electron/index.html`);

ipcMain.handle(`midi`, (_, { type, data }) => {
  Engine.emit(type, data);
});
