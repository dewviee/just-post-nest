export default function getEnv(): string {
  const envPath = 'src/environments/';
  switch (process.env.NODE_ENV) {
    case 'dev':
      return envPath + '.dev.env';
    default:
      return envPath + '.local.env';
  }
}
