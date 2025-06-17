"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import React, { useEffect, useState } from "react";
import { LOGIN_URL } from "@/utils/urls";
import http from "@/utils/http";
import Message, { addMessage, MessageObject } from "@/components/MessageDIalog";
import { storeItem } from "@/utils/local_storage_utils";
import { __isLastLoginToday } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = (formData.get("email") ?? "").toString();
      const password = (formData.get("password") ?? "").toString();
      const data = await http.post(LOGIN_URL, {
        email: email,
        password: password,
      });

      setMessages(
        addMessage(messages, {
          id: "",
          success: data.success,
          messageTxt: data.message,
        })
      );

      if (data.success) {
        storeItem("user", data.data.user);
        router.push("/portal");
      }
    } catch (e) {
      setMessages(
        addMessage(messages, {
          id: "",
          success: false,
          messageTxt: "Request failed.",
        })
      );
    }
  }

  useEffect(() => {
    function autoLogin() {
      const loginSessionActive = __isLastLoginToday();
      if (loginSessionActive) {
        router.push("/portal");
      }
    }

    autoLogin();
  }, []);

  return (
    <>
      <section className="w-full bg-white min-h-screen lg:p-12">
        <div className="w-full max-w-lg py-6 px-2">
          <Image
            src={logo}
            alt="LearningPost Logo"
            width={220.0}
            // className="mx-auto"
          />
          <form
            method="post"
            onSubmit={(e) => {
              login(e);
            }}
            className="px-3 mt-3 flex flex-col gap-4"
          >
            <input
              type="email"
              name="email"
              id="email"
              className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
              placeholder="Email Address:"
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
              placeholder="Password:"
              required
            />
            <div className="w-4/6 mx-auto mt-2">
              <PrimaryBtn
                type="submit"
                textContent="Login"
                btnWidth="w-full"
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </section>
      <Message messages={messages} setMessages={setMessages} />
    </>
  );
}
