"use client";

export default function PrimaryBtn({
  type,
  textContent,
  btnWidth,
  onClick,
}: {
  type: "button" | "reset" | "submit";
  textContent: string;
  btnWidth: string;
  onClick: () => void;
}) {
  return (
    <>
      <button
        type={type}
        onClick={() => {
          if (onClick == null) {
            return;
          }
          onClick();
        }}
        className={`${btnWidth} primary py-3 px-8 rounded-full bg-[var(--primary)] text-white font-medium`}
      >
        {textContent}
      </button>
    </>
  );
}
