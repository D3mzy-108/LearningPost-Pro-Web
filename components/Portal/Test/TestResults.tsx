import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { GET_TEST_SCORE } from "@/utils/urls";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";
import React, { useCallback, useEffect, useState } from "react";

interface TestScoreProps {
  test: any;
}

interface ScoreData {
  score: number;
  test: string;
  date_attempted: string;
  angle: number;
}

/**
 * TestScore React component.
 * This component fetches and displays a user's test score,
 * including a circular progress indicator.
 */
export default function TestScore({ test }: TestScoreProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const user = getStoredItem("user");

  const fetchScore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(
        GET_TEST_SCORE(`${test["testid"]}`, user.username)
      );

      if (response.success) {
        setScoreData({
          test: response.data.score.test,
          score: response.data.score.score,
          date_attempted: response.data.score.date_attempted,
          angle: 360 * (response.data.score.score / 100),
        });
      } else {
        showToast("Failed to retrieve score data.", "error");
      }
    } catch (err) {
      showToast(
        "Failed to load test score due to network or API issue.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [test, showToast, user.username]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  return (
    <div className="w-full flex flex-col items-stretch font-inter p-4">
      {loading ? (
        // Loading indicator: A simple spinning circle
        <div className="p-5 flex justify-center items-center">
          <Image src={loadingImg} alt="Loading..." width={300} height={300} />
        </div>
      ) : error ? (
        // Error message display
        <div className="p-5 text-red-600 text-center text-lg">{error}</div>
      ) : scoreData ? (
        // Display score data if successfully fetched
        <div className="p-5 bg-white rounded-lg shadow-md">
          <div className="flex flex-col w-full items-center gap-6">
            {/* Circular Progress Indicator Approximation */}
            <div
              className="rounded-full w-[120px] aspect-square p-3 flex items-stretch justify-stretch"
              style={{
                background: `conic-gradient(#ca8a04 ${scoreData.angle}deg, #DDD ${scoreData.angle}deg)`,
              }}
            >
              <div className="w-full rounded-full bg-white grid place-items-center">
                <span className="text-2xl font-extrabold text-yellow-600">
                  {Math.floor(scoreData.score)}%
                </span>
              </div>
            </div>

            {/* User and test details column */}
            <div className="w-full flex flex-col flex-grow min-w-0">
              <p className="font-semibold text-gray-800 text-base break-words">
                {user.firstName} {user.lastName}
              </p>
              <div className="h-1.5" /> {/* Spacer */}
              <p className="text-gray-600 text-sm break-words">
                {scoreData.test}
              </p>
              <div className="h-1.5" /> {/* Spacer */}
              <p className="text-gray-600 text-sm break-words">
                Score: {scoreData.score}%
              </p>
              <div className="h-1.5" /> {/* Spacer */}
              <p className="text-gray-600 text-sm break-words">
                Date: {scoreData.date_attempted}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
