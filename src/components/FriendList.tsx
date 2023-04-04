import { Menu, Transition } from "@headlessui/react";
import Axios from "axios";
import React, { Fragment, useEffect, useState } from "react";

export const FriendList = (props: {
  setChatData?: any;
  notification?: boolean;
  refresh?: boolean;
  openChat?:boolean
  setOpenChat?:any
}) => {
  const [friends, setFriends] = useState([
    {
      id: 0,
      nume: "",
      acceptat: "false",
      prenume: "",
      poza_profil: "",
      user_id: 0,
    },
  ]);
  const [myRequestsFriends, setMyRequestsFriends] = useState([
    {
      id: 0,
      nume: "",
      acceptat: "false",
      prenume: "",
      poza_profil: "",
      user_id: 0,
    },
  ]);
  const [otherRequestsFriends, setOtherRequestsFriends] = useState([
    {
      id: 0,
      nume: "",
      acceptat: "false",
      prenume: "",
      poza_profil: "",
      user_id: 0,
    },
  ]);
  const [suggestions, setSuggestions] = useState([
    {
      id: 0,
      nume: "",
      prenume: "",
      poza_profil: "",
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
        setMyRequestsFriends(response.data.result2);
        setOtherRequestsFriends(response.data.result1);
        setFriends(response.data.mergedResults);
      })
      .catch((error) => {
        console.error(error);
      });

    Axios.get("http://localhost:3002/api/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("response.data", response.data);
        setSuggestions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleAccept = (id: number) => {
    Axios.put("http://localhost:3002/api/friend/update", {
      prietenieId: id,
      stare: "true",
    })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleReject = (id: number) => {
    Axios.delete("http://localhost:3002/api/friend/delete-request", {
      headers: {
        Body: id,
      },
    })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const friendNotifications = otherRequestsFriends.map((friend) => {
    if (friend.acceptat === "false") {
      return (
        <Menu.Item>
          <div className="flex flex-row items-center gap-2 justify-between bg-[#e3bbb2] p-2  ">
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
              <button
                className={"h-10 w-10 hover:scale-125"}
                onClick={() => handleAccept(friend.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="green"
                  className="w-10 h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                className={"h-10 w-10 hover:scale-125"}
                onClick={() => handleReject(friend.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="red"
                  className="w-10 h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Menu.Item>
      );
    }
  });

  const handleNewChat = (friendID: number) => {
    const token = localStorage.getItem("token");

    Axios.post(
      "http://localhost:3002/api/conversations",
      {
        user_id1: friendID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });

    Axios.get(`http://localhost:3002/api/conversations/${friendID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        props.setChatData(response.data);
        props.setOpenChat(true)
        console.log("conv", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const friendList = friends.map((friend) => {
    if (friend.acceptat === "true") {
      return (
        <Menu as="div" className="relative">
          <Menu.Button className="flex relative flex-row items-center rounded-3xl w-full gap-2 justify-start bg-[#e3bbb2] p-2 hover:cursor-pointer hover:bg-red-800 hover:text-white ">
            <img
              alt={`${friend.nume}${friend.prenume}_poza_profil`}
              src={`data:image/png;base64,${friend.poza_profil}`}
              className="shadow-xl rounded-full  h-10 w-10 object-cover  border-none   max-w-150-px"
            />
            <div className={"flex flex-row gap-1"}>
              <div>{friend.nume}</div>
              <div>{friend.prenume}</div>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={
                "flex flex-row justify-center items-center -translate-y-1/4 w-full gap-2"
              }
            >
              <Menu.Item>
                <button
                  className={
                    "w-fit px-2 py-1 bg-red-800  text-white rounded-2xl border-2 border-black  bg-opacity-70 hover:bg-opacity-100"
                  }
                  onClick={() => {
                    handleNewChat(friend.id);
                    props.setChatData(friend);
                  }}
                >
                  Chat
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  className={
                    "w-fit px-2 py-1 bg-red-800 text-white rounded-2xl bg-opacity-70 border-2 border-black hover:bg-opacity-100"
                  }
                  onClick={() =>
                    (window.location.href = `/page/user/${friend.user_id}`)
                  }
                >
                  Profile
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      );
    }
  });
  const suggestionsList = suggestions.map((suggestion) => {
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="flex relative flex-row items-center rounded-3xl w-full gap-2 justify-start bg-[#e3bbb2] p-2 hover:cursor-pointer hover:bg-red-800 hover:text-white ">
          <img
            alt={`${suggestion.nume}${suggestion.prenume}_poza_profil`}
            src={`data:image/png;base64,${suggestion.poza_profil}`}
            className="shadow-xl rounded-full  h-10 w-10 object-cover  border-none   max-w-150-px"
          />
          <div className={"flex flex-row gap-1"}>
            <div>{suggestion.nume}</div>
            <div>{suggestion.prenume}</div>
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={
              "flex flex-row justify-center items-center -translate-y-1/4 w-full gap-2"
            }
          >
            <Menu.Item>
              <button
                className={
                  "w-fit px-2 py-1 bg-red-800 text-white rounded-2xl bg-opacity-70 border-2 border-black hover:bg-opacity-100"
                }
                onClick={() =>
                  (window.location.href = `/page/user/${suggestion.id}`)
                }
              >
                Profile
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  });

  if (props.notification) {
    return <>{friendNotifications}</>;
  }
  return (
    <>
      <div
        id="docs-sidebar"
        className="hs-overlay pl-2 sidebar hs-overlay-open:translate-x-0 border-0 -translate-x-full transition-all duration-300 transform fixed bottom-0 left-0 z-[2] w-52 bg-white pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 "
      >
        <div className="px-3">
          <h2 className="flex-none text-2xl font-semibold text-red-800 pb-3">
            Friends:
          </h2>
        </div>
        <div className="hs-accordion-group w-full flex flex-col flex-wrap">
          <ul className="space-y-1.5 flex flex-col gap-2">{friendList}</ul>
        </div>
        <div className="px-3 mt-3">
          <h2 className="flex-none text-2xl font-semibold text-red-800 pb-3">
            Suggestions:
          </h2>
        </div>
        <div className="hs-accordion-group w-full flex flex-col flex-wrap">
          <ul className="space-y-1.5 flex flex-col gap-2">{suggestionsList}</ul>
        </div>
      </div>
    </>
  );
};
