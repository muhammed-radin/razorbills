import { Logo } from "@/components/logo";
import { useEffect } from "react";

export default function RedirectPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center w-full">
      <Logo className="h-12 w-12" />
      <p className="mt-4 text-lg font-medium">Redirecting to Google...</p>
    </div>
  );
}