// src/types.ts

enum Role {
  ADMIN,
  USER,
}

export interface User {
  name: {
    fname: string;
    lname?: string;
  };
  id: string;
  email: string;
  username: string;
  role: Role;
  verified: boolean;
  deleted: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendTokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: User;
}

export interface refreshToken {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
}

export interface loginError {
  recognition: string | null;
  password: string | null;
  account: string | null;
}

export interface UserState {
  user: User | null;
  authenticated: boolean;
  ready: boolean;
  error: loginError;
}
