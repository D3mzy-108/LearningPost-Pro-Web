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
    <div className="w-full min-h-screen relative">
      <div className="fixed top-3 left-3 w-[300px] aspect-square bg-black/80 animated-backdrop-container"></div>
      <div className="z-10 bg-gradient-to-b from-white/90 to-white/40 to-40% w-screen min-h-screen backdrop-blur-2xl">
        <LayoutChild children={children} />
      </div>
    </div>
  );
}
