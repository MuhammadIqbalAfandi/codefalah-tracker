function readEnvValue(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export const API_BASE_URL =
  readEnvValue(import.meta.env.VITE_API_BASE_URL) ?? "http://localhost:8080";

export const APP_TIME_ZONE =
  readEnvValue(import.meta.env.VITE_APP_TIME_ZONE) ?? "Asia/Jakarta";
