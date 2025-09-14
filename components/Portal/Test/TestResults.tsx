import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { GET_TEST_ATTEMPT } from "@/utils/urls";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";
import React, { useCallback, useEffect, useState } from "react";
import { CheckCheck, NotebookPen, User, X } from "lucide-react";
import TestCertificate from "./TestCertificate";

interface TestScoreProps {
  test: any;
}

export interface ScoreData {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  test: {
    id: number;
    title: string;
    expires: string;
    pass_mark: number;
  };
  attempt_time: string;
  score: number;
  is_voided: boolean;
  is_attempted: boolean;
  proctoring_failures: number;
  is_passed: boolean;
  serial_number: string;
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
        GET_TEST_ATTEMPT(`${test["testid"]}`, user.username)
      );

      if (response.success) {
        setScoreData(response.data.attempt);
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusBadge = () => {
    if (scoreData == null) return;
    if (scoreData.is_voided) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
          <X className="h-4 w-4 mr-2" />
          Voided
        </span>
      );
    }
    if (scoreData.is_passed) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
          <CheckCheck className="h-4 w-4 mr-2" />
          Passed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
        <X className="h-4 w-4 mr-2" />
        Failed
      </span>
    );
  };

  return (
    <div className="w-full">
      {loading ? (
        // Loading indicator: A simple spinning circle
        <div className="p-5 flex justify-center items-center">
          <Image src={loadingImg} alt="Loading..." width={300} height={300} />
        </div>
      ) : error ? (
        // Error message display
        <div className="p-5 text-red-600 text-center text-lg">{error}</div>
      ) : scoreData ? (
        <div className="w-full max-w-4xl">
          {/* <div className="absolute top-3 left-3">{statusBadge()}</div> */}
          {scoreData.is_passed && !scoreData.is_voided ? (
            <TestCertificate scoreData={scoreData} />
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8">
            <div className="bg-white rounded-lg p-6 border border-b-2 border-gray-200">
              <div className="flex items-center text-gray-700 mb-3">
                <User className="h-6 w-6 mr-3 text-indigo-500" />
                <h2 className="text-xl font-semibold">User Details</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Name:</strong> {user.first_name} {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>User ID:</strong> {user.username}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-b-2 border-gray-200">
              <div className="flex items-center text-gray-700 mb-3">
                <NotebookPen className="h-6 w-6 mr-3 text-pink-500" />
                <h2 className="text-xl font-semibold">Test Details</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Test Title:</strong> {scoreData!.test.title}
                </p>
                <p>
                  <strong>Pass Mark:</strong> {scoreData!.test.pass_mark}%
                </p>
                <p>
                  <strong>Expires:</strong>{" "}
                  {formatDate(scoreData!.test.expires)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-b-2 border-gray-200">
              <div className="flex items-center justify-between text-gray-700 mb-3">
                <h2 className="text-xl font-semibold">Score & Attempt</h2>
                {statusBadge()}
              </div>
              <div className="space-y-2 text-gray-600">
                {/* <p>
                  <strong>Attempt Score:</strong>{" "}
                  <span className="text-2xl font-bold text-green-400">
                    {scoreData!.score}%
                  </span>
                </p> */}
                <p>
                  <strong>Attempt Time:</strong>{" "}
                  {formatDate(scoreData!.attempt_time)}
                </p>
                <p>
                  <strong>Attempt Status:</strong>{" "}
                  {scoreData!.is_attempted ? "Attempted" : "Not Attempted"}
                </p>
                {/* {proctoring_failures > 0 && (
                <p className="text-yellow-600 font-semibold flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Proctoring Failures: {proctoring_failures}
                </p>
              )} */}
              </div>
            </div>
          </div>

          {scoreData!.is_voided && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-inner flex items-center">
              <X className="h-6 w-6 mr-3 text-red-500" />
              <p className="font-medium">
                This test attempt has been voided and the score is not valid.
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center font-semibold text-base text-gray-600">
          No score data available.
        </p>
      )}
    </div>
  );
}
