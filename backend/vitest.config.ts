import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Dummy values so config/env.ts validation passes without a real .env.
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/symptom-checker-test',
      GROQ_API_KEY: 'test-key',
      LOG_LEVEL: 'error',
    },
  },
});
