export type JWTPayload = {
  sub: string;
  iat: number;
  exp: number;
  email: string;
};
