// src/Context/UserProvider.tsx

import React, { createContext, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { BackendTokens, User } from "../Types";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import {
  fetchUser,
  login,
  logout,
  refreshAccessToken,
  verify,
} from "../Store/Slices/userSlice";

// Define the context type
export interface UserContextType {
  user: User | null;
  ready: boolean;
  error: string | null;
  authenticated: boolean;
  login: (data: BackendTokens) => void;
  logout: () => void;
  verify: () => void;
}

// Create the context
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { user, authenticated, ready, error } = useAppSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (Cookies.get("authenticated") === undefined) {
      Cookies.set("authenticated", "false");
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      dispatch(fetchUser());

      const refreshAccessTokenInterval = setInterval(() => {
        dispatch(refreshAccessToken());
      }, 50 * 1000);

      return () => clearInterval(refreshAccessTokenInterval);
    }
  }, [authenticated, dispatch]);

  return (
    <UserContext.Provider
      value={{
        user,
        ready,
        error,
        authenticated,
        login: (data) => dispatch(login(data)),
        logout: () => dispatch(logout()),
        verify: () => dispatch(verify()),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
