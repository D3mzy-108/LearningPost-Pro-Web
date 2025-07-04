"use client";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import { Question } from "@/components/Portal/QuizComponents/QuizScreen";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { SAVE_PERFORMANCE } from "@/utils/urls";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PracticeQuestResults() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const __testId = searchParams.get("id");
  const __passed = searchParams.get("passed");
  const [corrections, setCorrections] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function validateParam(param: any) {
    if (param === null || param.trim() === "") {
      return false;
    }
    return true;
  }

  useEffect(() => {
    function validateScreenParams() {
      if (validateParam(__testId) && validateParam(__passed)) {
        setCorrections(getStoredItem("corrections") || []);
        return;
      } else {
        router.push("/portal");
        showToast("Course key is invalid.", "error");
      }
    }

    validateScreenParams();
  }, [__passed, __testId, router, showToast]);

  function calculateScore() {
    try {
      return Math.floor(
        (parseInt(__passed ?? "0") /
          (parseInt(__passed ?? "0") + corrections.length)) *
          100
      );
    } catch (error) {
      return 0;
    }
  }

  async function savePerformance() {
    setIsLoading(true);
    const user = getStoredItem("user");
    const response = await http.post(SAVE_PERFORMANCE(user.username), {
      total_answered: `${parseInt(__passed ?? "0") + corrections.length}`,
      correctly_answered: __passed ?? "0",
      wrongly_answered: `${corrections.length}`,
      time: "6", // SET DEFAULT TIME TAKEN TO 6 MINUTES
      testid: `${__testId ?? "0"}`,
    });
    if (!response.success) {
      showToast(
        "Failed to save performance. Connection Interrupted!!",
        "error"
      );
    }
    const trackCode = getStoredItem("lessonTrack");
    router.push(`/portal/dashboard?tc=${trackCode}`);
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen p-12 grid place-items-center">
        <Image src={loadingImg} alt="Loading..." width={300} height={300} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen overflow-auto py-6 md:py-12 px-3 md:px-8 mx-auto relative">
        <div className="w-full flex flex-col gap-4 items-center">
          <legend className="font-bold text-xl text-black/80">Results</legend>

          {/* SCORE SUMMARY */}
          <div className="w-full max-w-lg flex gap-2">
            {/* PASSED */}
            <div className="w-full bg-gray-100/80 flex-1 rounded-xl overflow-hidden p-2 flex items-center gap-3">
              <div className="w-1 min-h-12 bg-green-600 text-white text-sm rounded-full"></div>
              <div className="w-full flex-1 text-start sm:text-center">
                <span className="text-sm text-black/50">Correct</span>
                <div
                  className="text-green-600 text-lg"
                  style={{ fontWeight: 600 }}
                >
                  {__passed || "0"}
                </div>
              </div>
            </div>

            {/* FAILED */}
            <div className="w-full bg-gray-100/80 flex-1 rounded-xl overflow-hidden p-2 flex items-center gap-3">
              <div className="w-1 min-h-12 bg-red-600 text-white text-sm rounded-full"></div>
              <div className="w-full flex-1 text-start sm:text-center">
                <span className="text-sm text-black/50">Wrong</span>
                <div
                  className="text-red-600 text-lg"
                  style={{ fontWeight: 600 }}
                >
                  {corrections.length}
                </div>
              </div>
            </div>

            {/* SCORE */}
            <div className="w-full bg-gray-100/80 flex-1 rounded-xl overflow-hidden p-2 flex items-center gap-3">
              <div className="w-1 min-h-12 bg-yellow-600 text-white text-sm rounded-full"></div>
              <div className="w-full flex-1 text-start sm:text-center">
                <span className="text-sm text-black/50">Score</span>
                <div
                  className="text-yellow-600 text-lg"
                  style={{ fontWeight: 600 }}
                >
                  {calculateScore()}%
                </div>
              </div>
            </div>
          </div>

          {/* CORRECTIONS */}
          <legend className="font-bold text-xl text-black/80 mt-2">
            Notes
          </legend>
          <ul className="w-full max-w-lg p-0 m-0 flex flex-col gap-2">
            {corrections.map((question, index) => {
              return (
                <li
                  key={index}
                  className="w-full bg-gray-100/80 p-4 rounded-xl"
                >
                  <div className="w-full flex gap-4">
                    <div className="w-1 bg-red-600 text-white text-sm rounded-full"></div>
                    <div className="w-full flex-1">
                      <p
                        className="text-black/80"
                        style={{ fontWeight: "600" }}
                      >
                        {question.question}
                      </p>
                      <p className="text-black/80 my-2">
                        Answer: {question.answer}
                      </p>
                      <p className="text-black/80">{question.explanation}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* CONTINUE BTN */}
          <div className="w-full max-w-sm text-center px-4 mt-2 sticky -bottom-2 md:-bottom-6">
            <PrimaryBtn
              type="button"
              btnWidth="w-full shadow-xl"
              textContent="Continue"
              onClick={() =>
                setTimeout(() => {
                  savePerformance();
                }, 1000)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
