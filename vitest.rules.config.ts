import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/firestoreRules.emulator.test.ts"],
    fileParallelism: false,
  },
});
