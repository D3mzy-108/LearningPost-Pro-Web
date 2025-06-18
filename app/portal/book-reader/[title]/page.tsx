"use client";
import BookReader from "@/components/Portal/Books/BookReader";
import { DOMAIN } from "@/utils/urls";
import { useParams, useSearchParams } from "next/navigation";

export default function ReadBook() {
  const { title } = useParams();
  const searchParams = useSearchParams();
  const file = searchParams.get("f");

  return <BookReader title={`${title}`} file={`${DOMAIN}${file}`} />;
}
