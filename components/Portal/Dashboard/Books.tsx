import { DOMAIN } from "@/utils/urls";
import BookDetails from "../Books/BookDetails";

export default function Books({
  books,
  showDetailsComponent,
}: {
  books: [];
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  return (
    <section className="w-full py-4 px-4 bg-transparent rounded-xl backdrop-blur-sm">
      <h3 className="text-black/70 text-xl font-bold w-full">
        Learning Resources
      </h3>

      <div className="w-full mt-4 px-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => {
            return (
              <button
                type="button"
                key={book["bookid"]}
                className="cursor-pointer border-none bg-transparent text-start"
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
        <img
          src={`${DOMAIN}${book["cover"]}`}
          alt={book["title"]}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/50x50/EEE/333333?text=";
          }}
          className="w-[80px] aspect-[4/6] rounded-[8px]"
        />

        {/* BOOK DETAILS */}
        <div className="w-full flex-1 flex flex-col gap-2">
          <legend
            className="text-[18px] text-[#333]"
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
