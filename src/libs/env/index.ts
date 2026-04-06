import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_BASE_URL_MOCK: z.string().url().optional(),
  VITE_BASE_URL: z.string().url(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_COOKIE_CONSENT: z.string().optional(),
  VITE_SUPABASE_URL: z.string(),
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string(),
});

export const env = envSchema.parse(import.meta.env);
