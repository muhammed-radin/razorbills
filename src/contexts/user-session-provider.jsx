import { UserSessionContext } from "@/contexts/user-session-context";
import { api } from "@/utils/api";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function UserSessionProvider({ children }) {
  const location = useLocation();
  // Structure the state to mimic better-auth's hook return structure
  const [sessionState, setSessionState] = useState({
    data: null,
    isPending: true,
    error: null,
    updated: null,
  });

  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionData = await api.getSession(); // Your custom async API call

        setSessionState(sessionData);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setSessionState({
          data: null,
          isPending: false,
          error: err,
          updated: null,
        });
      }
    }

    fetchSession();
  }, [location.pathname]); // Re-fetch session when the location changes

  // Pass down the entire object so it mirrors better-auth's useSession hook structure
  return (
    <UserSessionContext.Provider value={sessionState}>
      {children}
    </UserSessionContext.Provider>
  );
}
