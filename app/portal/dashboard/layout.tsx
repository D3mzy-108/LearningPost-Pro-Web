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
      <div className="lg:hidden">
        <SideNavBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="w-full flex divide-x">
        <div className="w-fit max-lg:hidden">
          <SideNavBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="flex-1 w-full relative max-height-screen overflow-auto">
          <div className="w-full z-30">
            <Header
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </div>

          <LayoutChild>{children}</LayoutChild>
        </div>
      </div>
    </div>
  );
}
