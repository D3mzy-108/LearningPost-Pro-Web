"use client";
import Books from "@/components/Portal/Dashboard/Books";
import Courses from "@/components/Portal/Dashboard/Courses";
import Header from "@/components/Portal/Dashboard/Header";
import Organizations from "@/components/Portal/Dashboard/Organizations";
import Tests from "@/components/Portal/Dashboard/Tests";
import Drawer from "@/components/PopUps/Drawer";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { PRO_BOOKS_URL, PRO_QUESTS_URL, PRO_TESTS_URL } from "@/utils/urls";
import React from "react";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

export default function Dashboard() {
  const { showToast } = useToast();
  const [quests, setQuests] = useState<[]>([]);
  const [organizations, setOrganizations] = useState<[]>([]);
  const [books, setBooks] = useState<[]>([]);
  const [tests, setTests] = useState<[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [drawerChild, setDrawerChild] = useState<React.ReactElement>(<></>);

  useEffect(() => {
    async function loadPageData() {
      const user = getStoredItem("user");
      const data = await http.get(PRO_QUESTS_URL(`${user.username ?? ""}`));
      if (data.success) {
        setQuests(data.data.quests);
        setOrganizations(data.data.organizations);
      } else {
        showToast(data.message, "error");
      }
      const data2 = await http.get(PRO_BOOKS_URL(`${user.username ?? ""}`));
      if (data2.success) {
        setBooks(data2.data.books);
      } else {
        showToast(data2.message, "error");
      }
      const data3 = await http.get(PRO_TESTS_URL(`${user.username ?? ""}`));
      if (data3.success) {
        setTests(data3.data.tests);
      } else {
        showToast(data3.message, "error");
      }
    }

    loadPageData();
  }, []);

  function updateDrawerState(newDrawerChild: React.ReactElement) {
    setDrawerChild(newDrawerChild);
    setShowDrawer(true);
  }

  return (
    <div className="relative">
      <div className="w-full h-screen overflow-auto">
        <Header />
        <div className="w-full p-3 mt-3 flex flex-col gap-6">
          <Organizations organizations={organizations} />
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
          />
        </div>
      </div>
      <Drawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        child={drawerChild}
      />
    </div>
  );
}
