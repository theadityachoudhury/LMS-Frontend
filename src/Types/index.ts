// src/types.ts

import { CSSProperties } from "react";

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

export interface SingleOTPInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean;
}

export interface OTPInputProps {
  length: number;
  onChangeOTP: (otp: string) => void;

  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;

  style?: CSSProperties;
  className?: string;

  inputStyle?: CSSProperties;
  inputClassName?: string;
}
