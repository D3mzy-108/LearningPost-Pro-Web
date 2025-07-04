import { DOMAIN, JOIN_ORGANIZATION_URL } from "@/utils/urls";
import React, { FormEvent, useState } from "react";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import http from "@/utils/http";
import { getStoredItem, storeItem } from "@/utils/local_storage_utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

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
      <section className="w-full py-4 px-4 bg-transparent rounded-3xl backdrop-blur-sm shadow-lg">
        <h3 className="text-black/70 text-md font-bold w-full">
          Learning Tracks
        </h3>

        <div className="w-full mt-4 px-2">
          <div className="w-full flex flex-col gap-3">
            {/* ADD ORGANIZATION BTN */}
            <button
              onClick={() => {
                setShowAddGroup(!showAddGroup);
              }}
              className="w-full flex items-center gap-6"
              style={{
                flexShrink: 0, // Prevent items from shrinking
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                padding: "5px",
                alignSelf: "flex-start",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={`https://placehold.co/60x60/DDD/777777?text=- Add -`}
                alt={"+"}
                style={{
                  width: "57.5px",
                  height: "57.5px",
                  borderRadius: "15px", // Slightly rounded corners for logos
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  background: "#EEE",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
            {showAddGroup ? (
              <div className="w-full px-2">
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
            ) : (
              <></>
            )}

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
      className="w-full flex items-center gap-6"
      style={{
        flexShrink: 0, // Prevent items from shrinking
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        padding: "5px",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => openDashboard(`${org["code"]}`)}
    >
      <img
        src={`${DOMAIN}${org["logo"]}`}
        alt={org["name"] ?? ""}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/60x60/EEE/333333?text=";
        }} // Fallback image
        style={{
          width: "57.5px",
          height: "57.5px",
          borderRadius: "15px", // Slightly rounded corners for logos
          objectFit: "cover",
          border: "1px solid #ddd",
          background: "#EEE",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
        {org["name"]}
      </p>
    </button>
  );
}
