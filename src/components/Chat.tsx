import Axios from "axios";
import React, { useEffect, useState } from "react";

interface ChatInterface {
  chatData: {
    conversation: {
      id: number;
      user_id1: number;
      user_id2: number;
      created_at: string;
    };
    messages: [
      {
        chat_id: number;
        content: string;
        created_at: string;
        id: number;
        nume: string;
        poza_profil: "";
        prenume: string;
        sender_id: number;
      }
    ];
  };
  setRefresh?: any;
  openChat?: boolean;
  setOpenChat?: any;
  setChatData?: any;
}
export const Chat = (props: ChatInterface) => {
  const [comment, setComment] = useState("");
  const [localRefresj, setLocalRefresh] = useState(false);

  const useChatScroll = (
    dep: {
      chat_id: number;
      content: string;
      created_at: string;
      id: number;
      nume: string;
      poza_profil: "";
      prenume: string;
      sender_id: number;
    }[]
  ) => {
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref;
  };
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const friendID = localStorage.getItem("friendID");

    Axios.get(`http://localhost:3002/api/conversations/${friendID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        props.setChatData(response.data);
        console.log("conv", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [localRefresj]);
  const ref = useChatScroll(props?.chatData?.messages);
  useEffect(() => {
    console.log(props?.chatData?.messages);
  }, [props.chatData]);
  const messagetList = props?.chatData?.messages?.map((message) => {
    return (
      <div className=" dark:bg-gray-800 text-black dark:text-gray-200 px-2 py-1 antialiased flex max-w-lg">
        <img
          className="rounded-full h-8 w-8 mr-2 mt-1 object-cover "
          src={`data:image/png;base64,${message.poza_profil}`}
        />
        <div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-1 pb-2">
            <div className="font-semibold text-sm leading-relaxed">
              {message.nume} {message.prenume}
            </div>
            <div className="text-normal leading-snug md:leading-normal">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  });

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    //
    // Axios.post(
    //   "http://localhost:3002/api/messages",
    //   {
    //     chat_id: props.chatData.conversation.id,
    //     content: comment,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // )
    //   .then((response) => {
    //     // setRefresh(!refresh);
    //     setComment("");
    //     setLocalRefresh(!localRefresj);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  return (
    <>
      {props.openChat && (
        <div
          className={
            "chatWrapper md:flex flex-col rounded-t-2xl overflow-hidden justify-end z-[60] bg-[#e3bbb2] border-4 border-red-900  w-[400px] h-[500px] items-start fixed right-[60px] bottom-0"
          }
        >
          <button
            onClick={() => {
              props.setOpenChat(false)
              localStorage.removeItem('friendID')
            }}
            className={"absolute top-2 right-8 "}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="darkred"
              className="w-8 h-8 hover:stroke-red-700"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <div
            className={"overflow-y-auto w-full"}
            //@ts-ignore
            ref={ref}
          >
            {messagetList}
          </div>
          <div className="flex justify-center items-center w-full">
            <div className=" px-2 w-full bg-white p-1 shadow-md border">
              <textarea
                id="continut"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-10 px-3 text-sm py-1 mt-2 outline-none border-gray-300 w-full resize-none border rounded-lg placeholder:text-sm"
                placeholder="Type your message"
              />

              <div className="flex justify-between mt-1">
                <button
                  onClick={handleSubmit}
                  className="h-8 w-[150px] bg-red-900 hover:bg-red-700 text-sm text-white rounded-lg transition-all cursor-pointer hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
