"use client";
import { useToast } from "@/context/ToastContext";
import { clearStorage, getStoredItem } from "@/utils/local_storage_utils";
import { DOMAIN } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface SideBarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function SideNavBar({
  isSidebarOpen,
  toggleSidebar,
}: SideBarProps) {
  const router = useRouter();
  const { showToast } = useToast();

  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name.charAt(0)}. ${user.last_name}`;
  }

  function getTrack() {
    return getStoredItem("lessonTrackObj");
  }

  return (
    <>
      <div className="relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 w-72 md:w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col min-h-screen">
            {/* Sidebar Header */}
            <div className="py-6 px-3 border-b border-gray-200">
              <div className="flex flex-col items-center space-y-3">
                <Image
                  src={`${DOMAIN}${getTrack()["logo"]}`}
                  alt={getTrack()["name"] ?? ""}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/60x60/EEE/333333?text=";
                  }} // Fallback image
                  width={57.5}
                  height={57.5}
                  className="p-1"
                  style={{
                    borderRadius: "12px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    background: "#EEE",
                  }}
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 line-clamp-2 text-center">
                    {getTrack()["name"]}
                  </h1>
                  {/* <p className="text-sm text-gray-500">#{getTrack()["code"]}</p> */}
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                href="#"
                className="flex items-center px-4 py-3 text-blue-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h1"
                  />
                </svg>
                Modules
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Learning Resources
              </Link>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Certification Tests
              </a>
              {/* <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Reports
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.638 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </a> */}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 pb-8 border-t border-gray-200">
              <div
                className="flex items-center space-x-3"
                onClick={() => {
                  clearStorage();
                  router.push("/");
                  showToast("Logged out successfully", "info");
                }}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {getUserName().charAt(0)}.
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-red-500">Logout</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
}
