"use client";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import { getStoredItem } from "@/utils/local_storage_utils";

export const viewTestsPortal = (
  isLocked: boolean,
  showToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void
) => {
  const user = getStoredItem("user");
  if (isLocked && !user.hasUnrestrictedAccess) {
    showToast("Access denied!", "error");
    showToast("You have not completed all your modules!", "info");
  } else {
    const urlPath = `${
      window.location.origin
    }/certification-tests/?tc=${getStoredItem("lessonTrack")}`;
    const a = document.createElement("a");
    a.href = urlPath;
    a.target = "_blank";
    a.click();
  }
};

export default function Tests({ isLocked }: { isLocked: boolean }) {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  return (
    <section className="w-full py-4 md:px-2 lg:px-4 backdrop-blur-sm">
      <h3 className="text-black text-xl font-bold w-full">
        Certification Tests
      </h3>
      <div className="text-black/60 my-5 text-sm italic rounded-xl">
        <p>
          {`This section contains the certification tests required to clear you for active duty with ${searchParams.get(
            "tc"
          )}.
          `}
        </p>
        <p>
          {`
         Access to these tests will be granted upon the successful completion of all prerequisite courses.`}
        </p>
      </div>

      <div className={`w-full mt-3`}>
        <PrimaryBtn
          btnWidth="w-fit"
          onClick={() => viewTestsPortal(isLocked, showToast)}
          textContent="View Tests"
          type="button"
        />
      </div>
    </section>
  );
}
