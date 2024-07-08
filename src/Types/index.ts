// src/types.ts

export interface User {
  name: {
    fname: string;
    lname?: string;
  };
  id: string;
  email: string;
  username: string;
  role: string;
  verified: boolean;
  deleted: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendTokens {
  token: string;
  expiresIn: number;
  refreshToken: string;
  user: User;
}

export interface UserState {
  user: User | null;
  authenticated: boolean;
  ready: boolean;
  error: string | null;
}
