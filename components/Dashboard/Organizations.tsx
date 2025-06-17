import { DOMAIN, JOIN_ORGANIZATION_URL } from "@/utils/urls";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { useRouter } from "next/navigation";
import { addMessage, MessageObject } from "../MessageDIalog";

export default function Organizations({
  organizations,
  setMessages,
}: {
  organizations: [];
  setMessages: Dispatch<SetStateAction<MessageObject[]>>;
}) {
  const router = useRouter();
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
    setMessages(
      addMessage([], {
        id: "",
        success: data.success,
        messageTxt: data.message,
      })
    );
  }

  return (
    <>
      <section className="w-full py-4 px-6 bg-transparent rounded-xl backdrop-blur-sm">
        <h3 className="text-black/70 text-md font-bold w-full">
          Followed Groups
        </h3>

        <div className="w-full mt-4">
          <div className="w-full overflow-x-auto">
            <div className="w-fit flex gap-3 px-2">
              {/* ADD ORGANIZATION BTN */}
              <button
                onClick={() => {
                  setShowAddGroup(!showAddGroup);
                }}
                className="w-[80px] flex flex-col items-center gap-[3px] "
                style={{
                  flexShrink: 0, // Prevent items from shrinking
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  padding: "5px",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={`https://placehold.co/60x60/EEE/333333?text=-Add-`}
                  alt={"+"}
                  style={{
                    width: "60px",
                    height: "60px",
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
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80px",
                  }}
                >
                  Join Group
                </p>
              </button>
              {organizations.map((org) => {
                return <OrganizationContainer org={org} key={org["code"]} />;
              })}
            </div>
          </div>

          {/* ADD GROUP FORM */}
          {showAddGroup ? (
            <div className="mt-4">
              <form
                onSubmit={(e: FormEvent) => {
                  joinGroup(e);
                }}
                method="post"
              >
                <legend className="text-md font-bold text-black/60">
                  Join a Group
                </legend>
                <div className="w-full max-w-md flex gap-4">
                  <div className="w-full flex-1">
                    <input
                      type="text"
                      name="cc"
                      id="cc"
                      className="bg-transparent border-b border-b-black/80 placeholder:text-black/60 w-full p-3"
                      placeholder="Type code here..."
                      required
                    />
                  </div>
                  <PrimaryBtn
                    btnWidth="w-fit"
                    onClick={() => {}}
                    type="submit"
                    textContent="Join"
                  />
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
}

function OrganizationContainer({ org }: { org: any }) {
  return (
    <div
      className="w-[80px] flex flex-col items-center gap-[3px] "
      style={{
        flexShrink: 0, // Prevent items from shrinking
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        padding: "5px",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={`${DOMAIN}${org["logo"]}`}
        alt={org["name"] ?? ""}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/60x60/EEE/333333?text=";
        }} // Fallback image
        style={{
          width: "60px",
          height: "60px",
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
          fontSize: "14px",
          color: "#333",
          fontWeight: "500",
          whiteSpace: "nowrap", // Prevent text wrapping
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80px", // Limit text width
        }}
      >
        {org["name"]}
      </p>
    </div>
  );
}
