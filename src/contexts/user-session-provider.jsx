import { UserSessionContext } from "@/contexts/user-session-context";
import { useSession as useAuthSession } from "@/lib/auth-client";

export function UserSessionProvider({ children }) {
  const session = useAuthSession();

  return (
    <UserSessionContext.Provider value={session}>
      {children}
    </UserSessionContext.Provider>
  );
}
