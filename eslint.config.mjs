import lichtblick from "@lichtblick/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  ...lichtblick.configs.base,
  ...lichtblick.configs.typescript,
  prettier,
  {
    ignores: ["dist/", "build-wasm/", "src/wasm/libOpenDRIVE.js", "website/", "submodule/"],
  },
];
