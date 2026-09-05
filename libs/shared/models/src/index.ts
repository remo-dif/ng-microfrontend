export interface User {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly roles: readonly Role[];
}

export type Role = 'customer' | 'admin';

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken?: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
}

export interface Order {
  readonly id: string;
  readonly status: 'pending' | 'paid' | 'shipped';
  readonly total: number;
}
