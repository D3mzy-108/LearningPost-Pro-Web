export default function QuestProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full py-4 px-4">
      <div className="w-full h-[14px] rounded-full bg-gray-200">
        <div
          className={`h-[14px] rounded-full bg-green-700`}
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
