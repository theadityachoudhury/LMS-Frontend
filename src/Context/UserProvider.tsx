import React, { createContext, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { loginError, User } from "../Types";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import {
  fetchUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  setAuthenticated,
  setReady,
  signInWithGoogle,
  verify,
} from "../Store/Slices/userSlice";
import useToast from "../Hooks/useToast";

// Define the context type
export interface UserContextType {
  user: User | null;
  ready: boolean;
  error: loginError;
  authenticated: boolean;
  login: (data: {
    recognition: { email?: string; username?: string };
    password: string;
  }) => void;
  logout: () => void;
  verify: () => void;
  isLoggedIn: () => boolean;
  signInWithGoogle: (credential: string) => void;
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

  const { toastError, toastSuccess } = useToast();

  useEffect(() => {
    const authCookie = Cookies.get("authenticated");
    if (authCookie === undefined || authCookie === "false") {
      Cookies.set("authenticated", "false");
      dispatch(setAuthenticated(false));
    } else {
      dispatch(setAuthenticated(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (
      typeof error.account === "string" ||
      typeof error.password === "string" ||
      typeof error.recognition === "string"
    ) {
      const err: string =
        error.account ||
        error.password ||
        error.recognition ||
        "Failed to login";
      toastError(err);
    }
  }, [error, toastError]);

  useEffect(() => {
    if (ready && authenticated) {
      toastSuccess("Logged in successfully");
    } else if (ready && !authenticated) {
      toastSuccess("Logged out successfully");
    }
  }, [authenticated, toastSuccess]);

  useEffect(() => {
    if (authenticated) {
      dispatch(setReady(false));
      dispatch(fetchUser()).then(() => console.log("User fetched"));

      if (user === null) {
        dispatch(refreshAccessToken()).then(() =>
          dispatch(fetchUser()).then(() => console.log()),
        );
      }

      const refreshAccessTokenInterval = setInterval(
        () => {
          dispatch(refreshAccessToken()).then(() =>
            dispatch(fetchUser()).then(() => console.log()),
          );
        },
        3 * 60 * 60 * 1000,
      );

      return () => clearInterval(refreshAccessTokenInterval);
    }
    dispatch(setReady(true));
  }, [authenticated]);

  function isLoggedIn(): boolean {
    return Cookies.get("authenticated") === "true";
  }

  return (
    <UserContext.Provider
      value={{
        user,
        ready,
        error,
        authenticated,
        login: (data) => dispatch(loginUser(data)),
        logout: () => dispatch(logoutUser()),
        verify: () => dispatch(verify()),
        isLoggedIn,
        signInWithGoogle: (credential) =>
          dispatch(signInWithGoogle(credential)),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
