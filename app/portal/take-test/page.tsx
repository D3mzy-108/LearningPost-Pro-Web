"use client";
import QuizScreen, {
  Question,
} from "@/components/Portal/QuizComponents/QuizScreen";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { GET_TEST_QUESTIONS } from "@/utils/urls";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TakeTest() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const __testId = searchParams.get("id");
  const __time = searchParams.get("time");
  const [questions, setQuestions] = useState<Question[]>([]);

  function validateParam(param: any) {
    if (param === null || param.trim() === "") {
      return false;
    }
    return true;
  }

  useEffect(() => {
    function validateScreenParams() {
      if (validateParam(__testId)) {
        return;
      } else {
        router.push("/portal");
        showToast("Course key is invalid.", "error");
      }
    }

    async function fetchQuestions() {
      const response = await http.get(GET_TEST_QUESTIONS(__testId ?? ""));
      if (response.success) {
        if (response.data.questions.length === 0) {
          router.push("/portal");
          showToast("No questions found for this test.", "info");
        } else {
          setQuestions(
            (response.data.questions as []).map((q: any) => {
              return {
                questionId: q["questionid"] ?? "",
                comprehension: q["comprehension"] ?? "",
                diagram: q["diagram"] ?? "",
                question: q["question"] ?? "",
                optionA: q["a"] ?? "",
                optionB: q["b"] ?? "",
                optionC: q["c"] ?? "",
                optionD: q["d"] ?? "",
                answer: q["answer"] ?? "",
                explanation: q["explanation"] ?? "",
                topic: q["topic"] ?? "",
              };
            })
          );
        }
      } else {
        router.push("/portal");
        showToast(response.message, "error");
      }
    }

    validateScreenParams();
    fetchQuestions();
  }, [__testId, router, showToast]);

  return (
    <>
      <div className="w-full">
        <QuizScreen
          questions={questions}
          time={parseInt(__time ?? "40")}
          testId={__testId ?? "0"}
          isCBTMode={true}
        />
      </div>
    </>
  );
}
