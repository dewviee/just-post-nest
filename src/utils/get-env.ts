export default function getEnv(): string {
  const envPath = 'src/environments/';
  switch (process.env.NODE_ENV) {
    case 'dev':
      return envPath + '.env.dev';
    default:
      return envPath + '.env.local';
  }
}
