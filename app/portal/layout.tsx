"use client";
import { __isLastLoginToday } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/assets/css/animation.css";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <div className="w-full min-h-screen relative">
      <div className="fixed top-3 left-3 w-[300px] aspect-square bg-black/80 animated-backdrop-container"></div>
      <div className="z-10 bg-gradient-to-b from-white/90 to-white/40 to-40% w-screen min-h-screen backdrop-blur-2xl">
        {children}
      </div>
    </div>
  );
}
