"use client";
import Books from "@/components/Portal/Dashboard/Books";
import Courses from "@/components/Portal/Dashboard/Courses";
import Tests from "@/components/Portal/Dashboard/Tests";
import Drawer from "@/components/PopUps/Drawer";
import loadingImg from "@/assets/images/loading.png";
import http from "@/utils/http";
import { getStoredItem, storeItem } from "@/utils/local_storage_utils";
import { PRO_BOOKS_URL, PRO_QUESTS_URL, PRO_TESTS_URL } from "@/utils/urls";
import React from "react";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import DashboardSummary from "@/components/Portal/Dashboard/Summary";
import { get } from "http";

export default function Dashboard() {
  const { showToast } = useToast();
  const [quests, setQuests] = useState<[]>([]);
  const [books, setBooks] = useState<[]>([]);
  const [tests, setTests] = useState<[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [drawerChild, setDrawerChild] = useState<React.ReactElement>(<></>);
  const searchQueries = useSearchParams();
  const trackCode = searchQueries.get("tc");
  const pageTypes = ["dashboard", "modules"];

  function getPageType() {
    if (pageTypes.includes(searchQueries.get("page") ?? "")) {
      return searchQueries.get("page");
    } else {
      return "dashboard";
    }
  }

  useEffect(() => {
    async function loadPageData() {
      console.log(trackCode);
      const user = getStoredItem("user");
      const data = await http.get(
        PRO_QUESTS_URL(`${user.username ?? ""}`, `${trackCode ?? ""}`)
      );
      if (data.success) {
        setQuests(data.data.quests);
        let completedQuests: boolean[] = (
          data.data.quests as any[]
        ).map<boolean>((quest) => {
          const answered = quest["answered_count"];
          const questions = quest["question_count"];

          function calculateProgress() {
            if (answered == 0 || questions == 0) {
              return 0;
            } else {
              try {
                return Math.floor((answered / questions) * 100);
              } catch (error) {
                return 0;
              }
            }
          }
          const progress = calculateProgress();
          return progress >= 100;
        });
        storeItem("isTestLocked", completedQuests.includes(false));
      } else {
        showToast(data.message, "error");
      }
      const data2 = await http.get(
        PRO_BOOKS_URL(`${user.username ?? ""}`, `${trackCode ?? ""}`)
      );
      if (data2.success) {
        setBooks(data2.data.books);
      } else {
        showToast(data2.message, "error");
      }
      const data3 = await http.get(
        PRO_TESTS_URL(`${user.username ?? ""}`, `${trackCode ?? ""}`)
      );
      if (data3.success) {
        setTests(data3.data.tests);
      } else {
        showToast(data3.message, "error");
      }
    }

    loadPageData();
  }, [showToast, trackCode]);

  // TODO: CHANGE THE DRAWER TO A DIALOG
  function updateDrawerState(newDrawerChild: React.ReactElement) {
    setDrawerChild(newDrawerChild);
    setShowDrawer(true);
  }

  function getAttemptedQuestionsCount() {
    let answeredQuestionsCountList = quests.map(
      (quest) => quest["answered_count"] as number
    );
    return answeredQuestionsCountList.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }

  function getAvgProgress() {
    let progressList = quests.map((quest) => {
      const answered = quest["answered_count"];
      const questions = quest["question_count"];
      function calculateProgress() {
        if (answered == 0 || questions == 0) {
          return 0;
        } else {
          try {
            return Math.floor((answered / questions) * 100);
          } catch (error) {
            return 0;
          }
        }
      }
      return calculateProgress();
    });
    return parseFloat(
      (
        progressList.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / progressList.length
      ).toFixed(2)
    );
  }

  // RENDER LOADING IMAGE
  if (quests.length === 0 && books.length === 0 && tests.length === 0) {
    return (
      <>
        <div className="w-full h-screen grid place-items-center">
          <Image src={loadingImg} alt="Loading..." width={300} height={300} />
        </div>
      </>
    );
  }

  // RENDER PAGE CONTENT
  return (
    <div className="relative">
      <div className="w-full">
        {getPageType() === "dashboard" && (
          <div className="w-full p-3 lg:p-4 mt-3 flex flex-col gap-6">
            <DashboardSummary
              moduleCount={quests.length}
              questionsAnsweredCount={getAttemptedQuestionsCount()}
              avgProgress={getAvgProgress()}
              pendingTestCount={
                tests.filter((test) => !test["is_attempted"]).length
              }
            />
            <div className="w-full space-y-6">
              <h3 className="text-black text-xl font-bold w-full lg:pl-4">
                Continue Learning :
              </h3>
              <Courses
                quests={quests}
                showDetailsComponent={(child: React.ReactElement) => {
                  updateDrawerState(child);
                }}
              />
              <div className="">
                <Tests isLocked={getStoredItem("isTestLocked")} />
              </div>
            </div>
          </div>
        )}
        {getPageType() === "modules" && (
          <div className="w-full p-3 space-y-4 mt-3">
            <h3 className="text-black text-xl font-bold w-full lg:pl-4">
              Your Modules :
            </h3>
            <div className="w-full flex flex-col gap-8">
              <Books
                books={books}
                showDetailsComponent={(child: React.ReactElement) => {
                  updateDrawerState(child);
                }}
              />
              <Courses
                quests={quests}
                showDetailsComponent={(child: React.ReactElement) => {
                  updateDrawerState(child);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Drawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        child={drawerChild}
      />
    </div>
  );
}
