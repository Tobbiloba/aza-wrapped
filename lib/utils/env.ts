/**
 * Environment variable validation
 * Validates required environment variables at startup
 */

export function validateEnv() {
  const required = {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  };

  const missing: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

