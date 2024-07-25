export interface IAuthTokenInfo {
  payload?: object;
  type?: 'refresh' | 'access';
  iat?: number;
  exp?: number;
}
