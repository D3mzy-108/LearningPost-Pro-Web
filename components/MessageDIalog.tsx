import { Dispatch, SetStateAction, useEffect } from "react";

export interface MessageObject {
  id: string;
  success: boolean;
  messageTxt: string;
}

export function addMessage(
  messages: Array<MessageObject>,
  newMessage: MessageObject
) {
  const newId =
    String(Date.now()) + "-" + Math.random().toString(36).substring(2, 9);

  const messageToAdd: MessageObject = {
    id: newId, // Assign the unique ID here
    success: newMessage.success,
    messageTxt: newMessage.messageTxt,
  };

  // Return a BRAND NEW array with the new message prepended (for "newest on top")
  return [messageToAdd, ...messages];
}

export default function Message({
  messages,
  setMessages,
}: {
  messages: Array<MessageObject>;
  setMessages: Dispatch<SetStateAction<MessageObject[]>>;
}) {
  //   const [displayMessages, setDisplayMessages] = useState(messages);

  function popMessage(id: string) {
    const newMessages = messages.filter((val) => val.id !== id);
    setMessages(newMessages);
    return;
  }

  return (
    <>
      {messages.length > 0 ? (
        <ul className="w-full max-w-sm flex flex-col gap-2 fixed top-4 right-4 z-50">
          {messages.reverse().map((message, index) => {
            return (
              <li
                className={`${
                  message.success ? "bg-green-700/10" : "bg-red-700/10"
                } w-full rounded-xl py-4 px-6 flex items-center gap-3 backdrop-blur-md`}
                key={message.id ?? index}
              >
                <div className="flex-1">
                  <span
                    className={`${
                      message.success ? "text-green-700" : "text-red-700"
                    } text-md`}
                  >
                    {message.messageTxt}
                  </span>
                </div>
                <div className="w-fit">
                  <button
                    onClick={() => popMessage(message.id)}
                    className="w-fit border-none bg-gray-100 px-2 py-0 aspect-square text-lg grid place-items-center"
                  >
                    &times;
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
