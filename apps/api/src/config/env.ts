import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.local' });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001'),
  DB_MODE: z.enum(['docker-mysql', 'local-mysql', 'remote-mysql']).default('local-mysql'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default('saven_infraops'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default('dev-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(12),
  MICROSOFT_TENANT_ID: z.string().default('common'),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_REDIRECT_URI: z.string().optional(),
  MICROSOFT_ALLOWED_DOMAINS: z.string().default('saven.in'),
  AI_ACTIVE_PROVIDER: z.enum(['mock', 'openai', 'claude', 'private']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  CLAUDE_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default('claude-3-5-sonnet-latest'),
  PRIVATE_MODEL_BASE_URL: z.string().default('http://localhost:11434'),
  PRIVATE_MODEL_API_KEY: z.string().optional(),
  PRIVATE_MODEL_NAME: z.string().default('llama3.1'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().default('Saven InfraOps <infraops@saven.in>'),
  TEAMS_WEBHOOK_URL: z.string().optional(),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_MB: z.coerce.number().default(20)
});

export const env = envSchema.parse(process.env);
export const allowedOrigins = env.WEB_ORIGIN.split(',').map((value) => value.trim()).filter(Boolean);
