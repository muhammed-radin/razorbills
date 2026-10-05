import { createContext, useContext } from "react";

export const UserSessionContext = createContext(null);

export function useUserSession() {
  const context = useContext(UserSessionContext);

  if (context === null) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }

  return context;
}
