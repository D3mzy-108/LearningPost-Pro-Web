import type { Metadata } from "next";
import "@/assets/css/animation.css";
import LayoutChild from "@/components/LayoutComponents/LayoutChild";

export const metadata: Metadata = {
  title: "Portal | LearningPost Pro",
  description: "",
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-height-screen relative">
      <div className="z-10 bg-gradient-to-b from-[#F5F5F5] to-white to-40% w-screen min-height-screen backdrop-blur-2xl">
        <LayoutChild>{children}</LayoutChild>
      </div>
    </div>
  );
}
