export function createRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.join('');
}

/**
 * possible max length of this will be like 12 character
 * Source: https://chatgpt.com/share/aff00c3f-af60-4090-8f5f-a95d4965abd3
 * View latest answer in that link*/
export function generateUniqueString(): string {
  const timestamp = Date.now().toString(36);
  return `${timestamp}`;
}
