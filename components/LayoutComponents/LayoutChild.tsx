"use client";
import { __isLastLoginToday } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LayoutChild({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    function autoLogout() {
      const loginSessionActive = __isLastLoginToday();
      if (loginSessionActive !== true) {
        router.push("/");
        localStorage.removeItem("user");
      }
    }

    autoLogout();
  }, []);

  return <>{children}</>;
}
