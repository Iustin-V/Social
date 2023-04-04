import { Menu } from "@headlessui/react";
import Axios from "axios";
import React, { useEffect, useState } from "react";

export const FriendList = (props: {
  setChatData?: any;
  notification?: boolean;
}) => {
  const [friends, setFriends] = useState([
    {
      id: 0,
      nume: "",
      acceptat: "false",
      prenume: "",
      poza_profil: "",
      user_id1: 0,
      user_id2: 0,
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.get("http://localhost:3002/api/chat/friend", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setFriends(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const friendNotifications = friends.map((friend) => {
    return (
      <Menu.Item>
          <div className="flex flex-row items-center gap-2 justify-between bg-[#e3bbb2] p-2 hover:cursor-pointer hover:bg-red-800 hover:text-white ">
            <div className="flex flex-row items-center gap-2 justify-start">
              <img
              alt={`${friend.nume}${friend.prenume}_poza_profil`}
              src={`data:image/png;base64,${friend.poza_profil}`}
              className="shadow-xl rounded-full  h-10 w-10 object-cover  border-none   max-w-150-px"
            />
            <div className={"flex flex-row gap-1"}>
              <div>{friend.nume}</div>
              <div>{friend.prenume}</div>
            </div>
          </div>
          <div>
            <button>yes</button>
            <button>no</button>
          </div>
          </div>
      </Menu.Item>
    );
  });

  const friendList = friends.map((friend) => {
    if (friend.acceptat === "true") {
      return (
        <div
          className="flex flex-row items-center rounded-3xl gap-2 justify-start bg-[#e3bbb2] p-2 hover:cursor-pointer hover:bg-red-800 hover:text-white "
          onClick={() => {
            props.setChatData(friend);
          }}
        >
          <img
            alt={`${friend.nume}${friend.prenume}_poza_profil`}
            src={`data:image/png;base64,${friend.poza_profil}`}
            className="shadow-xl rounded-full  h-10 w-10 object-cover  border-none   max-w-150-px"
          />
          <div className={"flex flex-row gap-1"}>
            <div>{friend.nume}</div>
            <div>{friend.prenume}</div>
          </div>
        </div>
      );
    }
  });
  // return <div className="flex flex-col fixed h-screen">{friendList}</div>;
  if (props.notification) {
    return <>{friendNotifications}</>;
  }
  return (
    <>
      <div
        id="docs-sidebar"
        className="hs-overlay pl-2 sidebar hs-overlay-open:translate-x-0 border-0 -translate-x-full transition-all duration-300 transform fixed bottom-0 left-0 z-20 w-52 bg-white pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 "
      >
        <div className="px-3">
          <h2 className="flex-none text-2xl font-semibold text-red-800 pb-3">
            Friends
          </h2>
        </div>
        <div className="hs-accordion-group w-full flex flex-col flex-wrap">
          <ul className="space-y-1.5 flex flex-col gap-2">{friendList}</ul>
        </div>
      </div>
    </>
  );
};
