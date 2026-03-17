export interface RefreshTokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface AccessTokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
