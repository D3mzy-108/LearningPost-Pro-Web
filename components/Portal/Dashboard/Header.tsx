import { getStoredItem } from "@/utils/local_storage_utils";
import Link from "next/link";

export default function Header({}) {
  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name.charAt(0)}. ${user.last_name}`;
  }
  return (
    <>
      <header className="w-full py-4 px-6 bg-transparent backdrop-blur-md flex gap-4 items-center shadow-md">
        <Link href={"/portal"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#444"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-home"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <div className="w-fit p-1 border rounded-full flex items-center ml-auto">
          <div className="w-fit px-[0.5rem] aspect-square rounded-full bg-black/80 grid place-items-center text-white/90 font-bold text-md shadow-sm">
            {getUserName().charAt(0)}
          </div>
          <div
            className="flex-1 truncate text-xs font-normal px-2"
            style={{
              color: "#333",
            }}
          >
            Welcome {getUserName()}
          </div>
        </div>
      </header>
    </>
  );
}
