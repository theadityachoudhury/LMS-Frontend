// src/hooks/useUserContext.ts

import { useContext } from "react";
import { UserContext, UserContextType } from "../Context/UserProvider";

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
