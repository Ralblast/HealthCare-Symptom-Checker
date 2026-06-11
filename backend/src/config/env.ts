import 'dotenv/config';

// Read everything through one typed object so the rest of the app never
// touches process.env directly. We fail fast at boot if a required key is
// missing instead of getting a confusing error deep inside a request.

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  isProd: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  mongoUri: requireEnv('MONGODB_URI'),
  groqApiKey: requireEnv('GROQ_API_KEY'),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};
