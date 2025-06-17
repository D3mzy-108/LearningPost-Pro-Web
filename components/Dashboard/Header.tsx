import { getStoredItem } from "@/utils/local_storage_utils";

export default function Header({}) {
  function getUserName(): string {
    const user = getStoredItem("user");
    return `${user.first_name} ${user.last_name}`;
  }
  return (
    <>
      <header className="w-full py-4 px-6 bg-transparent rounded-xl backdrop-blur-md flex gap-4 items-center shadow-md">
        <div className="w-fit px-3 aspect-square rounded-full bg-[#F0F0F0] grid place-items-center text-black/70 font-bold text-2xl inset-shadow-sm">
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
