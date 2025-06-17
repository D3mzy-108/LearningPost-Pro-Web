import { DOMAIN } from "@/utils/urls";

export default function Books({ books }: { books: [] }) {
  return (
    <section className="w-full py-4 px-6 bg-transparent rounded-xl backdrop-blur-md shadow-md">
      <h3 className="text-black/70 text-md font-bold w-full">Your Books</h3>

      <div className="w-full mt-4">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {books.map((book) => {
            return <BookCover book={book} key={book["bookid"]} />;
          })}
        </div>
      </div>
    </section>
  );
}

function BookCover({ book }: { book: any }) {
  return (
    <div
      className="w-full"
      style={{
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
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
      </p>
    </div>
  );
}
