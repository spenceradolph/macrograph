module.exports = {
  input: "src/electron/index.js",
  output: {
    file: "out/electron/index.js",
    format: "cjs",
  },
  plugins: [
    require("@rollup/plugin-node-resolve").nodeResolve(),
    require("@rollup/plugin-commonjs")(),
  ],
};
