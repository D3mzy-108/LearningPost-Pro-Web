"use client";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import { useRouter } from "next/navigation";

export default function ConfirmStartTest({ test }: { test: any }) {
  const router = useRouter();
  function startTest() {
    router.push(
      `/certification-tests/take-test?id=${test["testid"]}&time=${test["time"]}`
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4 text-center p-6 md:p-8">
        <h3 className="text-red-600 text-2xl font-bold">Important Info!</h3>
        <p className="text-black/80">
          {
            "You cannot reattempt the test after completion unless authorized by your administrator, handler, or manager."
          }
        </p>
        <p className="text-black/80">
          {
            "If your test session is interrupted, your progress won't be saved. This may result in you having to restart the test or being prevented from making further attempts."
          }
        </p>
        <div className="w-full text-center mt-4">
          <PrimaryBtn
            btnWidth="w-fit"
            type="button"
            textContent="Start Test"
            onClick={() => startTest()}
          />
        </div>
      </div>
    </>
  );
}
