"use client";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { BOOK_CHAPTERS_URL, DOMAIN } from "@/utils/urls";
import { useEffect, useState } from "react";

export default function BookDetails({ book }: { book: any }) {
  const tabs = [
    {
      tag: "Summary",
      content:
        book["about"].toString().length == 0
          ? "No summary was added."
          : book["about"],
    },
    {
      tag: "About Author",
      content:
        book["about_author"].toString().length == 0
          ? "Nothing's written about the author."
          : book["about_author"],
    },
  ];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [chapters, setChapters] = useState<[]>([]);

  useEffect(() => {
    async function loadChapters() {
      const user = getStoredItem("user");
      if (user == null) return;
      const data = await http.get(
        BOOK_CHAPTERS_URL(user.username, book["bookid"])
      );
      if (data.success) {
        setChapters(data.data.chapters);
      } else {
        setChapters([]);
      }
    }

    loadChapters();
  }, [book]);

  return (
    <div className="flex flex-col gap-6">
      {/* QUEST TITLE */}
      <div className="w-full">
        <img
          src={`${DOMAIN}${book["cover"]}`}
          alt={book["title"]}
          className="w-3/6 aspect-[4/6] rounded-xl bg-gray-100 mx-auto"
        />
        <div className="w-full mt-4 text-center">
          <legend className="font-bold text-black/80 text-xl">
            {book["title"]}
          </legend>
          <p className="text-black/60 text-sm italic">~ {book["author"]} ~</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex">
          {tabs.map((tab, index) => {
            return (
              <button
                key={index}
                type="button"
                className="bg-transparent border-none w-full flex-1 duration-300 active:bg-gray-100 lg:hover:bg-gray-100"
                onClick={() => setActiveTabIndex(index)}
              >
                <div
                  className={`w-fit text-sm py-3 mx-auto duration-300 ${
                    activeTabIndex == index
                      ? "text-black/80 border-b-[2px] border-b-black/80"
                      : "text-black/60"
                  }`}
                >
                  {tab.tag}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-black/80 p-3 text-sm border-y border-y-gray-300">
          <span className="italic">
            {tabs.at(activeTabIndex)?.content ?? ""}
          </span>
        </div>
      </div>

      <div className="w-full">
        <legend>
          <span className="text-sm font-bold text-black/80">Chapters</span>
        </legend>

        <ul className="p-0 m-0 mt-3 flex flex-col gap-3">
          {chapters.map((chapter, index) => {
            return (
              <li
                className="w-full bg-gray-100 rounded-xl p-3 flex"
                style={{
                  lineHeight: "1rem",
                }}
                key={index}
              >
                <div className="w-full flex-1">
                  <span className="text-sm text-[var(--primary)]">
                    Book {index + 1}
                  </span>
                  <br />
                  <span className="text-black/80">{chapter["title"]}</span>
                </div>
                <PrimaryBtn
                  type="button"
                  btnWidth="w-fit"
                  textContent="Read"
                  onClick={() => {}}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
