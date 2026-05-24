import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().url().default("http://localhost:3000"),
  SESSION_SECRET: z.string().min(32).default("dev-secret-change-me-with-32-characters"),
  PRIVATE_FILES_DIR: z.string().default("./storage/private"),
  DOWNLOAD_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  PAYMENT_PROVIDER: z.enum(["mock", "stripe"]).default("mock"),
  PAYMENT_WEBHOOK_SECRET: z.string().min(16).default("dev-webhook-secret-change-me"),
  MOCK_AUTO_APPROVE: z.string().default("true"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional()
});

export const env = envSchema.parse(process.env);
