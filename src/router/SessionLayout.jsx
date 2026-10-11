import { Outlet } from "react-router-dom";
import { UserSessionProvider } from "@/contexts/user-session-provider";

export default function SessionLayout() {
  return (
    <UserSessionProvider>
      <Outlet />
    </UserSessionProvider>
  );
}
