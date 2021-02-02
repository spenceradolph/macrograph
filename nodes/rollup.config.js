module.exports = {
  input: "browser/index.ts",
  output: {
    file: "browser/index.js",
    format: "cjs",
  },
  plugins: [
    require("@rollup/plugin-typescript")(),
    require("@rollup/plugin-node-resolve").nodeResolve(),
    require("@rollup/plugin-commonjs")(),
  ],
  external: ["electron"],
};
