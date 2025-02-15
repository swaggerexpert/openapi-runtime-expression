const path = require("node:path");

module.exports = {
  env: {
    cjs: {
      browserslistEnv: "isomorphic-production",
      presets: [
        [
          "@babel/preset-env",
          {
            debug: false,
            modules: "commonjs",
            loose: true,
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          },
        ],
      ],
      plugins: [
        [
          path.join(
            __dirname,
            "./scripts/babel-plugin-add-import-extension.cjs",
          ),
          { extension: "cjs" },
        ],
        [
          "module-resolver",
          {
            resolvePath(sourcePath, currentFile) {
              if (sourcePath === "apg-lite") {
                const apgLiteCJS = path.resolve("./src/apg-lite.cjs");
                const currentDir = path.dirname(currentFile);
                return path.relative(currentDir, apgLiteCJS);
              }
              return sourcePath;
            },
          },
        ],
      ],
    },
    es: {
      browserslistEnv: "isomorphic-production",
      presets: [
        [
          "@babel/preset-env",
          {
            debug: false,
            modules: false,
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          },
        ],
      ],
      plugins: [
        [
          path.join(
            __dirname,
            "./scripts/babel-plugin-add-import-extension.cjs",
          ),
          { extension: "mjs" },
        ],
      ],
    },
  },
};
