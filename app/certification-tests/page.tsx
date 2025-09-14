"use client";
import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react"; // Note: You'll need to install lucide-react: npm install lucide-react
import http from "@/utils/http";
import { DOMAIN, PRO_TESTS_URL } from "@/utils/urls";
import { getStoredItem } from "@/utils/local_storage_utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";
import TestScore from "@/components/Portal/Test/TestResults";
import ConfirmStartTest from "@/components/Portal/Test/ConfirmStartTest";

interface Test {
  testid: number | string;
  title: string;
  cover: string;
  time: number;
  about: string;
  instructions: string;
  is_locked: boolean;
  is_attempted: boolean;
  status: string;
  question_count: number;
}

export default function CertificationTests() {
  // State for managing the score modal visibility and data
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showModalContent, setShowModalContent] =
    useState<React.ReactElement | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const searchQueries = useSearchParams();
  const trackCode = searchQueries.get("tc");
  const router = useRouter();

  // Function to open the score modal with a specific test's data
  const openScoreModal = (child: React.ReactElement) => {
    setShowModal(true);
    setShowModalContent(child);
  };

  // Function to close the score modal
  const closeScoreModal = () => {
    setShowModalContent(null);
    setShowModal(false);
  };

  // Handler for the download certificate button
  //   const handleDownload = () => {
  //     if (selectedTest?.is_passed) {
  //       openMessageBox(
  //         "Certificate for '" + selectedTest.name + "' is downloading..."
  //       );
  //       // In a real application, you would trigger a file download here.
  //     } else {
  //       openMessageBox("You must pass the exam to download the certificate.");
  //     }
  //   };

  useEffect(() => {
    async function loadTests() {
      const user = getStoredItem("user");
      const response = await http.get(
        PRO_TESTS_URL(`${user.username ?? ""}`, `${trackCode ?? ""}`)
      );

      if (response.success) {
        setTests(response.data.tests);
      } else {
        showToast("Failed to fetch certification tests", "error");
        showToast(response.message, "error");
      }
    }

    loadTests();
  }, [showToast, trackCode]);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center md:px-4">
      {/* Main Application Container */}
      <div className="bg-white p-6 md:p-10 max-w-4xl w-full">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Certification Tests
          </h1>
          <p className="text-gray-500 mt-0">------------</p>
        </header>

        {/* Exam List */}
        <div
          id="test-list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tests.map((test) => (
            <TestCard
              key={test.testid}
              test={test}
              showDetailsComponent={openScoreModal}
            />
          ))}
        </div>
      </div>

      {/* View Score Modal */}
      {showModal && showModalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[85vh] overflow-auto w-full shadow-2xl relative">
            <button
              onClick={closeScoreModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={28} />
            </button>
            {showModalContent}
            {/* <button
              onClick={() => {}}
              disabled={!selectedTest.is_passed}
              className={`flex items-center justify-center gap-2 w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 transform active:scale-95 shadow-lg
                                ${
                                  selectedTest.is_passed
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
            >
              <Download size={20} />
              Download Certificate
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

function TestCard({
  test,
  showDetailsComponent,
}: {
  test: Test;
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  const doNotAllowInteraction = test["is_locked"] && !test["is_attempted"];
  const testAttempted = test["is_attempted"];

  function startTestOrShowResults() {
    if (testAttempted) {
      // TODO: DISPLAY THE RESULTS OF THE TEST
      showDetailsComponent(<TestScore test={test} />);
    } else {
      showDetailsComponent(<ConfirmStartTest test={test} />);
    }
  }

  return (
    <div
      className={`${
        doNotAllowInteraction ? "opacity-50 pointer-events-none" : ""
      }
        w-full max-w-xl bg-white/40 rounded-lg p-4 flex flex-col gap-2 border border-gray-300`}
    >
      <div className="w-full flex-1 flex flex-col items-start">
        <Image
          src={`${DOMAIN}${test.cover}`}
          alt={`${test.title}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/60x60/cccccc/333333?text=";
          }} // Fallback image
          width={60}
          height={60}
          style={{
            marginRight: "20px",
            borderRadius: "10px",
          }}
        />
        <div className="w-full flex-1">
          <legend
            className="text-[18px] text-[#333]"
            style={{ fontWeight: 600 }}
          >
            {test.title}
          </legend>
          <p style={{ fontSize: "16px", color: "#666", margin: "5px 0" }}>
            {test.question_count} Questions
          </p>
        </div>
        <div className="w-fit flex flex-col gap-2">
          <button
            className="px-4 py-3 rounded-[8px] text-md border-none mt-3"
            style={{
              backgroundColor: `${
                test.is_attempted ? "#ca8a04" : "var(--primary)"
              }`,
              color: "#fff",
              cursor: "pointer",
              transition:
                "background-color 0.3s ease-in-out, transform 0.1s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = `${
                test.is_attempted ? "#eab308 " : "#0056b3"
              }`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = `${
                test.is_attempted ? "#ca8a04" : "var(--primary)"
              }`)
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => startTestOrShowResults()}
          >
            {test.is_attempted ? "Show Results" : "Start Test"}
          </button>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              margin: 0,
              textAlign: "center",
            }}
          >
            {test.status}
          </p>
        </div>
      </div>
    </div>
  );
}
