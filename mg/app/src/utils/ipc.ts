import type { CoreEventsMap, RendererRequestsMap } from "@macrograph/core";

const { ipcRenderer } = window.require("electron");

export const invokeIpc = <T extends keyof RendererRequestsMap>({
  type,
  ...args
}: RendererRequestsMap[T]["args"] & {
  type: T;
}): Promise<RendererRequestsMap[T]["returns"]> => {
  return ipcRenderer.invoke(type, args);
};

export const handleCoreIpc = <T extends keyof CoreEventsMap>(
  type: T,
  callback: (args: CoreEventsMap[T]["args"]) => void
) => {
  ipcRenderer.on(`core:${type}`, (_: any, args: CoreEventsMap[T]["args"]) =>
    callback(args)
  );
};