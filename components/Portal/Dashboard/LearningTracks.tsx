import { DOMAIN, JOIN_ORGANIZATION_URL } from "@/utils/urls";
import React, { FormEvent, useState } from "react";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import http from "@/utils/http";
import { getStoredItem, storeItem } from "@/utils/local_storage_utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

export default function LearningTracks({
  learningTracks,
}: {
  learningTracks: [];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showAddGroup, setShowAddGroup] = useState<boolean>(false);

  async function joinGroup(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const user = getStoredItem("user");
    const data = await http.post(JOIN_ORGANIZATION_URL, {
      username: user.username,
      cc: `${formData.get("cc")}`,
    });
    if (data.success) {
      router.refresh();
    }
    showToast(data.message, data.success ? "success" : "error");
  }

  function openDashboard(trackCode: string) {
    storeItem("lessonTrack", trackCode);
    router.push(`/portal/dashboard?tc=${trackCode}`);
  }

  return (
    <>
      <section className="w-full">
        <h3 className="text-black/70 text-xl font-bold w-full py-3">
          Learning Tracks
        </h3>

        <div className="w-full mt-1 px-2">
          <div className="w-full flex flex-col divide-y-2">
            {/* ADD ORGANIZATION BTN */}
            <button
              onClick={() => {
                setShowAddGroup(!showAddGroup);
              }}
              className="w-full flex items-center gap-6 py-3"
              style={{
                flexShrink: 0, // Prevent items from shrinking
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.15s ease-in-out",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.99)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Image
                src={`https://placehold.co/60x60/EEE/777777?text='Add'`}
                alt={""}
                width={57.5}
                height={57.5}
                className="p-1"
                style={{
                  borderRadius: "12px", // Slightly rounded corners for logos
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  background: "#EEE",
                }}
              />
              <p
                className="truncate"
                style={{
                  marginTop: "8px",
                  fontSize: "17px",
                  color: "#222",
                  fontWeight: "500",
                  whiteSpace: "nowrap", // Prevent text wrapping
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%", // Limit text width
                }}
              >
                Add Learning Track
              </p>
            </button>

            {/* ADD GROUP FORM */}
            <div className={`w-full px-2 ${!showAddGroup && "hidden"}`}>
              <form
                onSubmit={(e: FormEvent) => {
                  joinGroup(e);
                }}
                method="post"
                className="w-full flex flex-col"
              >
                <div className="w-full flex gap-6">
                  <div className="w-full flex-1">
                    <input
                      type="text"
                      name="cc"
                      id="cc"
                      className="bg-transparent border-b border-b-black/80 placeholder:text-black/60 w-full p-3"
                      placeholder="Enter track code..."
                      required
                    />
                  </div>
                  <PrimaryBtn
                    btnWidth="w-fit"
                    onClick={() => {}}
                    type="submit"
                    textContent="Track"
                  />
                </div>
              </form>
            </div>

            {learningTracks.map((track) => {
              return (
                <OrganizationContainer
                  key={track["code"]}
                  org={track}
                  openDashboard={openDashboard}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function OrganizationContainer({
  org,
  openDashboard,
}: {
  org: any;
  openDashboard: (trackCode: string) => void;
}) {
  return (
    <button
      className="w-full flex items-center gap-6 py-3"
      style={{
        flexShrink: 0, // Prevent items from shrinking
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.15s ease-in-out",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => openDashboard(`${org["code"]}`)}
    >
      <Image
        src={`${DOMAIN}${org["logo"]}`}
        alt={org["name"] ?? ""}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/60x60/EEE/333333?text=";
        }} // Fallback image
        width={57.5}
        height={57.5}
        className="p-1"
        style={{
          borderRadius: "12px",
          objectFit: "cover",
          border: "1px solid #ddd",
          background: "#EEE",
        }}
      />
      <p
        className="truncate"
        style={{
          fontSize: "17px",
          color: "#222",
          fontWeight: "500",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {org["name"]}
      </p>
    </button>
  );
}
