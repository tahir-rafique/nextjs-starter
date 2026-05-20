import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment:  "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  /* ── Module aliases matching tsconfig paths ── */
  moduleNameMapper: {
    "^@/(.*)$":            "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/lib/(.*)$":        "<rootDir>/src/lib/$1",
    "^@/hooks/(.*)$":      "<rootDir>/src/hooks/$1",
    "^@/store/(.*)$":      "<rootDir>/src/store/$1",
    "^@/context/(.*)$":    "<rootDir>/src/context/$1",
    "^@/types/(.*)$":      "<rootDir>/src/types/$1",
    "^@/models/(.*)$":     "<rootDir>/src/models/$1",
  },

  /* ── Coverage ─────────────────────────────── */
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/app/api/**",
    "!src/types/**",
    "!src/**/index.ts",
  ],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 },
  },

  /* ── Test matching ────────────────────────── */
  testMatch: [
    "<rootDir>/src/__tests__/**/*.{test,spec}.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],

  /* ── Transform ────────────────────────────── */
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

export default createJestConfig(config);
