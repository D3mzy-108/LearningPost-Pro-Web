"use client";
import { useToast } from "@/context/ToastContext";
import { clearStorage, getStoredItem } from "@/utils/local_storage_utils";
import { DOMAIN } from "@/utils/urls";
import { BookIcon, ChartNoAxesCombined, LockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { viewTestsPortal } from "./Tests";

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
  const searchParams = useSearchParams();
  const [isTestLocked, setIsTestLocked] = useState(false);
  const navItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      icon: <ChartNoAxesCombined className="w-5 h-5 opacity-80" />,
    },
    {
      key: "modules",
      name: "Modules",
      icon: <BookIcon className="w-5 h-5 opacity-80" />,
    },
  ];

  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name} ${
      user.last_name !== null && user.last_name.length > 0
        ? user.last_name.charAt(0)
        : ""
    }.`;
  }

  function getTrack() {
    return getStoredItem("lessonTrackObj");
  }

  function getTrackCode() {
    return getStoredItem("lessonTrack");
  }

  useEffect(() => {
    setIsTestLocked(getStoredItem("isTestLocked"));
  }, []);

  return (
    <>
      <div className="max-lg:relative lg:w-fit">
        {/* Sidebar */}
        <aside
          className={`max-lg:fixed inset-y-0 z-50 w-72 md:w-80 max-lg:bg-white max-lg:shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
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
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/portal/dashboard?tc=${getTrackCode() ?? ""}&page=${
                    item.key
                  }`}
                  onClick={toggleSidebar}
                  className={`flex gap-3 items-center px-4 py-3 ${
                    searchParams.get("page") === item.key
                      ? "text-blue-600 bg-blue-100"
                      : "text-gray-700"
                  } hover:bg-blue-50 rounded-lg transition-colors duration-200`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* LINK TO CERTIFICATION TESTS */}
              <Link
                href={""}
                target={isTestLocked ? undefined : "_blank"}
                onClick={() => {
                  if (isTestLocked) {
                    showToast("Access denied!", "error");
                    showToast(
                      "You have not completed all your modules!",
                      "info"
                    );
                    toggleSidebar();
                  } else {
                    viewTestsPortal(isTestLocked, showToast);
                  }
                }}
                className="flex items-center p-4 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
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
                <div className="flex-1">Certification Tests</div>
                {isTestLocked && <LockIcon className="w-3 h-3 text-gray-600" />}
              </Link>
            </nav>

            {/* Sidebar Footer */}
            <div className="pt-6 px-4 pb-8 border-t border-gray-400">
              <div
                className="flex items-center space-x-3 border-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200 cursor-pointer p-4"
                onClick={() => {
                  clearStorage();
                  router.push("/");
                  showToast("Logged out successfully", "info");
                }}
              >
                <Image
                  src={`https://placehold.co/60x60/443333/EBEBEB?text=${getUserName().charAt(
                    0
                  )}`}
                  alt="..."
                  width={40}
                  height={40}
                  className="rounded-full"
                />
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
}
