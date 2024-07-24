export interface IRefreshToken {
  payload?: object;
  type: 'refresh' | 'access';
  iat?: number;
  exp?: number;
}
