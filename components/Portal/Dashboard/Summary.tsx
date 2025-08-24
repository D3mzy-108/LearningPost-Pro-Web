import {
  BookOpen,
  ChartPieIcon,
  NotebookPenIcon,
  TimerResetIcon,
} from "lucide-react";

export default function DashboardSummary({
  moduleCount,
  questionsAnsweredCount,
  avgProgress,
  pendingTestCount,
}: {
  moduleCount: number;
  questionsAnsweredCount: number;
  avgProgress: number;
  pendingTestCount: number;
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MODULE COUNT */}
        <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300 space-y-3">
          <div className="w-full flex gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            <p className="text-sm text-gray-500 font-medium">Modules</p>
          </div>
          <div className="pl-1">
            <p className="text-2xl font-bold text-gray-800">{moduleCount}</p>
          </div>
        </div>

        {/* AVERAGE MODULE PROGRESS */}
        <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300 space-y-3">
          <div className="w-full flex gap-2">
            <NotebookPenIcon className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-gray-500 font-medium">
              Questions Answered
            </p>
          </div>
          <div className="pl-1">
            <p className="text-2xl font-bold text-gray-800">
              {questionsAnsweredCount}
            </p>
          </div>
        </div>

        {/* AVERAGE MODULE PROGRESS */}
        <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300 space-y-3">
          <div className="w-full flex gap-2">
            <ChartPieIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm text-gray-500 font-medium">Progress</p>
          </div>
          <div className="pl-1">
            <p className="text-2xl font-bold text-gray-800">{avgProgress}%</p>
          </div>
        </div>

        {/* PENDING TEST COUNT */}
        <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300 space-y-3">
          <div className="w-full flex gap-2">
            <TimerResetIcon className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-500 font-medium">Pending Tests</p>
          </div>
          <div className="pl-1">
            <p className="text-2xl font-bold text-gray-800">
              {pendingTestCount}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
