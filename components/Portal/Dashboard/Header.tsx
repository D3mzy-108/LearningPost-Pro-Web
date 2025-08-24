"use client";
import { getStoredItem } from "@/utils/local_storage_utils";
import Link from "next/link";
import { SideBarProps } from "./SideBar";
import Image from "next/image";

export default function Header({ isSidebarOpen, toggleSidebar }: SideBarProps) {
  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name} ${user.last_name.charAt(0)}.`;
  }

  return (
    <>
      <header className="bg-gray-100 border-b border-gray-400 pr-3 sm:px-6 py-4">
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
              <div className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded-lg border-b-2 border-b-gray-400">
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
            <div className="w-fit p-1 border border-black/30 rounded-full flex items-center">
              <Image
                src={`https://placehold.co/60x60/443333/EBEBEB?text=${getUserName().charAt(
                  0
                )}`}
                alt="..."
                width={32}
                height={32}
                className="rounded-full"
              />
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
