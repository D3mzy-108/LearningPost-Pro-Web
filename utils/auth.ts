import { useRouter } from "next/router";
import { getStoredItem } from "./local_storage_utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function __isLastLoginToday() {
  try {
    const user = getStoredItem("user");
    if (user == null) return;

    // Split the date string into day, month, year parts
    const parts = user.lastLogin.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    // Create a Date object for the target date
    // Note: We set hours, minutes, seconds, milliseconds to 0 to compare just the date part
    const targetDate = new Date(year, month, day, 0, 0, 0, 0);

    // Get the current date and time
    const now = new Date();

    // Create a Date object for the current day at the very beginning (00:00:00.000)
    // This ensures we're only comparing the date, not the time of day
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

    return targetDate.getTime() == today.getTime();
  } catch (e) {
    console.log(e);
    return false;
  }
}
