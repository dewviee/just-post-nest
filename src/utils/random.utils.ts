export function createRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.join('');
}
