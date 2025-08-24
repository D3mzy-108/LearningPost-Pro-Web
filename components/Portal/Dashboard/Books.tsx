import { DOMAIN } from "@/utils/urls";
import BookDetails from "../Books/BookDetails";
import Image from "next/image";

export default function Books({
  books,
  showDetailsComponent,
}: {
  books: [];
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  return (
    <section className="w-full md:px-2 lg:px-4 bg-transparent rounded-xl backdrop-blur-sm">
      <div className="w-full px-2 overflow-auto">
        <div className="w-fit mx-auto flex gap-4">
          {books.map((book) => {
            return (
              <button
                type="button"
                key={book["bookid"]}
                className="cursor-pointer border-none bg-transparent text-start min-w-72 max-w-72 sm:min-w-80 sm:max-w-80"
                onClick={() =>
                  showDetailsComponent(<BookDetails book={book} />)
                }
              >
                <BookCover book={book} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookCover({ book }: { book: any }) {
  return (
    <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300">
      <div className="w-full flex items-center gap-4">
        {/* BOOK COVER */}
        <Image
          src={`${DOMAIN}${book["cover"]}`}
          alt={book["title"]}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/50x50/EEE/333333?text=";
          }}
          width={80}
          height={0}
          className="aspect-[4/6] rounded-[8px]"
        />

        {/* BOOK DETAILS */}
        <div className="w-full flex-1 flex flex-col gap-2">
          <legend
            className="text-[18px] text-[#333] line-clamp-1"
            style={{ fontWeight: 600 }}
          >
            {book["title"]}
          </legend>
          <span className="text-black/50 text-sm">{book["author"]}</span>

          {/* BOOK TAGS */}
          <div className="w-full flex flex-wrap gap-2">
            <div className="w-fit bg-blue-600/10 text-blue-600 rounded-full text-xs py-1 px-3">
              E-Book
            </div>
            <div className="w-fit bg-blue-600/10 text-blue-600 rounded-full text-xs py-1 px-3">
              EPUB
            </div>
          </div>
        </div>
      </div>
      {/* <img
        src={`${DOMAIN}${book["cover"]}`}
        alt={book["title"]}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/50x50/EEE/333333?text=";
        }}
        className="w-full aspect-[4/6] rounded-xl mb-1"
      />
      <p>
        <span className="text-md font-bold text-black/80">{book["title"]}</span>
        <br />
        <span className="text-sm text-black/60">{book["author"]}</span>
      </p> */}
    </div>
  );
}
