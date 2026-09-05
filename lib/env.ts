import { z } from "zod";

const optionalString = z.preprocess((value) => value === "" ? undefined : value, z.string().optional());
const optionalUrl = z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional());
const optionalEmail = z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional());

const envSchema = z.object({
  MONGODB_URI: optionalString,
  AUTH_SECRET: z.preprocess((value) => value === "" ? undefined : value, z.string().min(16).optional()),
  NEXTAUTH_URL: optionalUrl,
  ADMIN_EMAIL: optionalEmail,
  ADMIN_PASSWORD: z.preprocess((value) => value === "" ? undefined : value, z.string().min(8).optional()),
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  NEXT_PUBLIC_APP_URL: optionalUrl
});

export const env = envSchema.parse(process.env);

export function requireEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}
