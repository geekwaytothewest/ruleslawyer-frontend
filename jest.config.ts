import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to the Next.js app to load next.config and .env files in the test environment.
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  // SWC rewrites "@/*" in static imports, but jest.mock("@/...") strings are
  // resolved by jest itself, so map the alias here too. (tsconfig has no
  // baseUrl, so next/jest doesn't add this automatically.)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "utilities/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the
// Next.js config, which is async, before the Jest config is built.
export default createJestConfig(config);
