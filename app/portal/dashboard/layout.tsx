"use client";
import "@/assets/css/animation.css";
import LayoutChild from "@/components/LayoutComponents/LayoutChild";
import Header from "@/components/Portal/Dashboard/Header";
import SideNavBar from "@/components/Portal/Dashboard/SideBar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full">
      <SideNavBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="w-full relative">
        <div className="w-full sticky top-0 left-0 z-30">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <LayoutChild>{children}</LayoutChild>
      </div>
    </div>
  );
}
