"use client";
import BookReader from "@/components/Portal/Books/BookReader";
import { useToast } from "@/context/ToastContext";
import { DOMAIN } from "@/utils/urls";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ReadBook() {
  const router = useRouter();
  const { showToast } = useToast();
  const { title } = useParams();
  const searchParams = useSearchParams();
  const file = searchParams.get("f");

  function validateParam(param: any) {
    if (param === null || param.trim() === "") {
      return false;
    }
    return true;
  }

  useEffect(() => {
    function validateScreenParams() {
      if (validateParam(title) && validateParam(file)) {
        return;
      } else {
        router.push("/portal");
        showToast("Book credentials are invalid.", "error");
      }
    }

    validateScreenParams();
  }, []);

  return <BookReader title={`${title}`} file={`${DOMAIN}${file}`} />;
}
