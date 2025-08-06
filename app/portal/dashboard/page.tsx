"use client";
import Books from "@/components/Portal/Dashboard/Books";
import Courses from "@/components/Portal/Dashboard/Courses";
import Header from "@/components/Portal/Dashboard/Header";
import Tests from "@/components/Portal/Dashboard/Tests";
import Drawer from "@/components/PopUps/Drawer";
import loadingImg from "@/assets/images/loading.png";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { PRO_BOOKS_URL, PRO_QUESTS_URL, PRO_TESTS_URL } from "@/utils/urls";
import React from "react";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const { showToast } = useToast();
  const [quests, setQuests] = useState<[]>([]);
  const [books, setBooks] = useState<[]>([]);
  const [tests, setTests] = useState<[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [lockTests, setLockTests] = useState<boolean>(false);
  const [drawerChild, setDrawerChild] = useState<React.ReactElement>(<></>);
  const searchQueries = useSearchParams();
  const trackCode = searchQueries.get("tc");

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
        setLockTests(completedQuests.includes(false));
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

  function updateDrawerState(newDrawerChild: React.ReactElement) {
    setDrawerChild(newDrawerChild);
    setShowDrawer(true);
  }

  return (
    <div className="relative">
      <div className="w-full h-screen overflow-auto">
        <Header />
        {quests.length === 0 && books.length === 0 && tests.length === 0 ? (
          <>
            <div className="w-full h-screen grid place-items-center">
              <Image
                src={loadingImg}
                alt="Loading..."
                width={300}
                height={300}
              />
            </div>
          </>
        ) : (
          <div className="w-full p-3 mt-3 flex flex-col gap-6">
            <Courses
              quests={quests}
              showDetailsComponent={(child: React.ReactElement) => {
                updateDrawerState(child);
              }}
            />
            <Books
              books={books}
              showDetailsComponent={(child: React.ReactElement) => {
                updateDrawerState(child);
              }}
            />
            <Tests
              tests={tests}
              showDetailsComponent={(child: React.ReactElement) => {
                updateDrawerState(child);
              }}
              isLocked={lockTests}
            />
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
