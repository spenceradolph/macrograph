declare global {
  interface Window {
    ipc: {
      invoke(type: string, ...args: any[]): void;
      handle(topic: string, callback: (args: any) => void): void;
    };
  }
}

export default window;
