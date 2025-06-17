"use client";
import Books from "@/components/Dashboard/Books";
import Courses from "@/components/Dashboard/Courses";
import Header from "@/components/Dashboard/Header";
import Organizations from "@/components/Dashboard/Organizations";
import Tests from "@/components/Dashboard/Tests";
import Message, { addMessage, MessageObject } from "@/components/MessageDIalog";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { PRO_BOOKS_URL, PRO_QUESTS_URL, PRO_TESTS_URL } from "@/utils/urls";
import React from "react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [quests, setQuests] = useState<[]>([]);
  const [organizations, setOrganizations] = useState<[]>([]);
  const [books, setBooks] = useState<[]>([]);
  const [tests, setTests] = useState<[]>([]);
  useEffect(() => {
    async function loadPageData() {
      const user = getStoredItem("user");
      const data = await http.get(PRO_QUESTS_URL(`${user.username ?? ""}`));
      if (data.success) {
        setQuests(data.data.quests);
        setOrganizations(data.data.organizations);
      } else {
        setMessages(
          addMessage(messages, {
            id: "",
            success: false,
            messageTxt: data.message,
          })
        );
      }
      const data2 = await http.get(PRO_BOOKS_URL(`${user.username ?? ""}`));
      if (data2.success) {
        setBooks(data2.data.books);
      } else {
        setMessages(
          addMessage(messages, {
            id: "",
            success: false,
            messageTxt: data.message,
          })
        );
      }
      const data3 = await http.get(PRO_TESTS_URL(`${user.username ?? ""}`));
      if (data3.success) {
        setTests(data3.data.tests);
      } else {
        setMessages(
          addMessage(messages, {
            id: "",
            success: false,
            messageTxt: data.message,
          })
        );
      }
    }

    loadPageData();
  }, []);

  return (
    <>
      <div className="w-full p-3 flex flex-col gap-6">
        <Header />
        <Organizations
          organizations={organizations}
          setMessages={setMessages}
        />
        <Courses quests={quests} />
        <Books books={books} />
        <Tests tests={tests} />
      </div>
      <Message messages={messages} setMessages={setMessages} />
    </>
  );
}
