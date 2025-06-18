import { getStoredItem } from "@/utils/local_storage_utils";

export default function Header({}) {
  function getUserName(): string {
    const user = getStoredItem("user");
    if (user["first_name"] == null) return "";
    return `${user.first_name.charAt(0)}. ${user.last_name}`;
  }
  return (
    <>
      <header className="w-full py-4 px-6 bg-transparent backdrop-blur-md flex gap-4 items-center shadow-md">
        <div className="w-fit px-[0.85rem] aspect-square rounded-full bg-black/80 grid place-items-center text-white/90 font-bold text-xl shadow-sm">
          {getUserName().charAt(0)}
        </div>
        <div
          className="flex-1 truncate text-[18px] font-normal"
          style={{
            color: "#333",
          }}
        >
          Welcome {getUserName()}
        </div>
      </header>
    </>
  );
}
