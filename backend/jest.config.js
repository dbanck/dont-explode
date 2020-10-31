module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json",
    },
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/__tests__/**/*.spec.ts"],

  collectCoverageFrom: ["src/**/*.ts", "!**/__tests__/**.ts"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
