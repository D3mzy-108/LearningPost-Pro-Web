"use client";
import LearningTracks from "@/components/Portal/Dashboard/LearningTracks";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { LEARNING_TRACKS } from "@/utils/urls";
import React, { useEffect, useState } from "react";

export default function Portal() {
  const { showToast } = useToast();
  const [learningTracks, setLearningTracks] = useState<[]>([]);

  useEffect(() => {
    async function loadPageData() {
      const user = getStoredItem("user");
      const data = await http.get(LEARNING_TRACKS(`${user.username ?? ""}`));
      if (data.success) {
        setLearningTracks(data.data.learning_tracks);
      } else {
        showToast(data.message, "error");
      }
    }

    loadPageData();
  }, [showToast]);

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-6">
        <LearningTracks learningTracks={learningTracks} />
      </div>
    </>
  );
}
