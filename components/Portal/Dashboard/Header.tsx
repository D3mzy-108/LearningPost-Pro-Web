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
      <header className="w-full py-4 px-4 md:px-6 bg-transparent backdrop-blur-md flex flex-shrink-0 items-center shadow-md">
        <Link href={"/portal"}>
          <div className="w-fit flex gap-3 border-2 border-black/30 bg-black/5 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M6 3h8a1 1 0 0 1 1 1v5.022q.516.047 1 .185V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4.257a5.5 5.5 0 0 1-.657-1H6a1 1 0 0 1-1-1h4.207a5.5 5.5 0 0 1-.185-1H5V4a1 1 0 0 1 1-1m1 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm6 1v1H7V5zm6 9.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4.98-1.966a.45.45 0 0 0-.447-.037a.5.5 0 0 0-.155.108a.5.5 0 0 0-.145.357v3.075a.5.5 0 0 0 .145.358a.6.6 0 0 0 .157.11a.45.45 0 0 0 .323.02a.5.5 0 0 0 .13-.064l2.296-1.567a.47.47 0 0 0 .163-.185a.54.54 0 0 0-.003-.487a.5.5 0 0 0-.167-.182z"
              />
            </svg>
            <span className="text-sm">Learning Tracks</span>
          </div>
        </Link>
        <div className="w-fit max-w-[160px] p-1 border border-black/30 rounded-full flex items-center ml-auto">
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
      </header>
    </>
  );
}
