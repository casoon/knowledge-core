import { z } from 'zod';

export const baseEnvSchema = z.object({
  PUBLIC_SITE_URL: z.url(),
  PUBLIC_SITE_NAME: z.string().min(1),
  PUBLIC_AUTHOR: z.string().min(1),
  PUBLIC_LOCALE: z.string().min(2).default('en'),
  PUBLIC_ENABLE_DARK_MODE: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

export function validateEnv<T extends z.ZodType>(
  schema: T,
  env: Record<string, unknown>
): z.infer<T> {
  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.issues);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export function createEnvSchema(defaults: {
  PUBLIC_SITE_URL: string;
  PUBLIC_SITE_NAME: string;
  PUBLIC_AUTHOR: string;
  PUBLIC_LOCALE?: string;
}) {
  return baseEnvSchema.extend({
    PUBLIC_SITE_URL: z.url().default(defaults.PUBLIC_SITE_URL),
    PUBLIC_SITE_NAME: z.string().min(1).default(defaults.PUBLIC_SITE_NAME),
    PUBLIC_AUTHOR: z.string().min(1).default(defaults.PUBLIC_AUTHOR),
    PUBLIC_LOCALE: z
      .string()
      .min(2)
      .default(defaults.PUBLIC_LOCALE || 'en'),
  });
}
