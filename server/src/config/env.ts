import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1),
  DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  IN_PROD: z.coerce.boolean().default(false),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);