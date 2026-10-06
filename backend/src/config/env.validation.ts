import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1, 'Falta DATABASE_URL (conéctala tras crear la base).'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET debe tener al menos 10 caracteres.'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.string().default('3000'),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
});

export function validateEnv(config: Record<string, unknown>) {
  const parsed = schema.safeParse(config);
  if (!parsed.success) {
    throw new Error('Configuración inválida:\n' + JSON.stringify(parsed.error.format(), null, 2));
  }
  return parsed.data;
}
