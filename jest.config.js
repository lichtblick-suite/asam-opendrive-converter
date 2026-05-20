const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@converters$": "<rootDir>/src/converters",
    "^@converters/(.*)$": "<rootDir>/src/converters/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
