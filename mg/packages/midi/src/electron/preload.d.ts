declare global {
  interface Window {
    invokeIpc(type: string, ...args: any[]): void;
  }
}

export default window;
