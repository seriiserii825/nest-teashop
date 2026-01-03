import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// Типы всех переменных
type TEnvVar =
  | 'PORT'
  | 'SERVER_URL'
  | 'SERVER_DOMAIN'
  | 'CLIENT_URL'
  | 'JWT_SECRET'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'GOOGLE_CALLBACK_URL'
  | 'DB_USERNAME'
  | 'DB_PASSWORD'
  | 'DB_NAME'
  | 'DB_PORT';

// Загрузка env файлов (вызвать один раз в main.ts)
export function loadEnv(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Сначала .env (общие переменные)
  expand(config({ path: '.env' }));

  // Потом специфичные (перезаписывают)
  expand(config({ path: `.env.${nodeEnv}`, override: true }));
}

// Получение переменной
export function getEnv(name: TEnvVar, defaultValue?: string): string {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}
