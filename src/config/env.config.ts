const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(
      `[ENV] Missing required environment variable: "${key}". Check your .env.local file.`
    );
  }
  return value;
};

export const env = {
  app: {
    name: getEnvVar("NEXT_PUBLIC_APP_NAME", "Portfolio Admin"),
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  api: {
    baseUrl: getEnvVar(
      "NEXT_PUBLIC_API_BASE_URL",
      "https://yash-portfoliyo-backend.onrender.com"
    ),
    timeout: Number(getEnvVar("NEXT_PUBLIC_API_TIMEOUT", "30000")),
  },
  auth: {
    tokenKey: getEnvVar("NEXT_PUBLIC_TOKEN_KEY", "portfolio_admin_token"),
    userKey: getEnvVar("NEXT_PUBLIC_USER_KEY", "portfolio_admin_user"),
  },
} as const;

export type EnvConfig = typeof env;