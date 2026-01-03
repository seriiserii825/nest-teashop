type TEnvVar =
  | 'PORT'
  | 'SERVER_URL'
  | 'SERVER_DOMAIN'
  | 'CLIENT_URL'
  | 'JWT_SECRET'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'GOOGLE_CALLBACK_URL';

export function getEnvVariable(name: TEnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}
