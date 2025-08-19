"use client";
import { getStoredItem } from "@/utils/local_storage_utils";
import Link from "next/link";
import { SideBarProps } from "./SideBar";

export default function Header({ isSidebarOpen, toggleSidebar }: SideBarProps) {
  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name.charAt(0)}. ${user.last_name}`;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link href={"/portal"}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Learning Tracks
                </span>
              </div>
            </div>
          </Link>

          <div className="w-fit min-w-[50px]">
            <div className="w-fit max-w-[160px] p-1 border border-black/30 rounded-full flex items-center max-md:hidden">
              <div className="w-fit px-[0.5rem] aspect-square rounded-full bg-black/80 grid place-items-center text-white/90 font-bold text-md shadow-sm">
                {getUserName().charAt(0)}
              </div>
              <div
                className="flex-1 truncate text-xs font-normal px-2"
                style={{
                  color: "#333",
                }}
              >
                {getUserName()}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
