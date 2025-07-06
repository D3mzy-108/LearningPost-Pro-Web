"use client";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import React, { useEffect, useState } from "react";
import { LOGIN_URL, SIGNUP_URL } from "@/utils/urls";
import http from "@/utils/http";
import { storeItem } from "@/utils/local_storage_utils";
import { __isLastLoginToday } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showSignUpForm, setShowSignUpForm] = useState(false);

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

      showToast(data.message, data.success ? "success" : "error");
      console.log("----");

      if (data.success) {
        storeItem("user", data.data.user);
        router.push("/portal");
      }
    } catch (e) {
      showToast("Failed to connect to service provider.", "error");
    }
  }

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const first_name = (formData.get("first_name") ?? "").toString();
      const last_name = (formData.get("last_name") ?? "").toString();
      const email = (formData.get("email") ?? "").toString();
      const password = (formData.get("password") ?? "").toString();
      const password2 = (formData.get("password2") ?? "").toString();
      const year_of_birth = (formData.get("year_of_birth") ?? "").toString();
      if (password === password2) {
        const data = await http.post(SIGNUP_URL, {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          year_of_birth: year_of_birth,
        });

        showToast(data.message, data.success ? "success" : "error");
        console.log("----");

        if (data.success) {
          setShowSignUpForm(false);
        }
      } else {
        showToast("Passwords do not match.", "warning");
      }
    } catch (e) {
      showToast("Failed to connect to service provider.", "error");
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
  }, [router]);

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
          {showSignUpForm ? (
            <>
              <SignUpForm formComponents={{ onSubmit: signup }} />
            </>
          ) : (
            <>
              <LoginForm formComponents={{ onSubmit: login }} />
            </>
          )}
          <div className="w-full text-center mt-2">
            <button
              type="button"
              onClick={() => setShowSignUpForm(!showSignUpForm)}
              className="bg-transparent border-none text-md text-black/60 p-2"
            >
              {showSignUpForm ? (
                <>
                  <span>{"Already have an account? "}</span>
                  <span className="text-blue-600">Login</span>
                </>
              ) : (
                <>
                  <span>{"Don't yet have an account? "}</span>
                  <span className="text-blue-600">Create Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
      {/* <Message messages={messages} setMessages={setMessages} /> */}
    </>
  );
}

interface AuthFormComponentProps {
  onSubmit: (e: React.FormEvent) => void;
}

function LoginForm({
  formComponents,
}: {
  formComponents: AuthFormComponentProps;
}) {
  return (
    <>
      <form
        method="post"
        onSubmit={(e) => {
          formComponents.onSubmit(e);
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
    </>
  );
}

function SignUpForm({
  formComponents,
}: {
  formComponents: AuthFormComponentProps;
}) {
  return (
    <>
      <form
        method="post"
        onSubmit={(e) => {
          formComponents.onSubmit(e);
        }}
        className="px-3 mt-3 flex flex-col gap-4"
      >
        <div className="w-full flex gap-4">
          <input
            type="text"
            name="first_name"
            id="first_name"
            className="w-full flex-1 bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="last_name"
            id="last_name"
            className="w-full flex-1 bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
            placeholder="Last Name"
            required
          />
        </div>
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
          placeholder="Set Password:"
          minLength={8}
          required
        />
        <input
          type="password"
          name="password2"
          id="password2"
          className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
          placeholder="Confirm Password:"
          minLength={8}
          required
        />
        <input
          type="number"
          name="year_of_birth"
          id="year_of_birth"
          className="w-full bg-gray-200 rounded-lg py-4 px-4 text-black/80 placeholder:text-black/60"
          placeholder="Year of Birth: (e.g. 1994)"
          min={1930}
          max={new Date().getFullYear()}
          required
        />
        <div className="w-4/6 mx-auto mt-2">
          <PrimaryBtn
            type="submit"
            textContent="Sign Up"
            btnWidth="w-full"
            onClick={() => {}}
          />
        </div>
      </form>
    </>
  );
}
