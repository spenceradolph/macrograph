import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/electron/index.ts",
  output: {
    file: "out/electron/index.js",
    format: "cjs",
  },
  plugins: [typescript({tsconfig: "tsconfig.electron.json"}), commonjs(), nodeResolve()],
  external: ["electron"],
};
