import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // The round-trip and cross-check suites walk every day of the calendar table.
    testTimeout: 120_000,
  },
});
