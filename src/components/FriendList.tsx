import { fireEvent } from "@testing-library/react";
import Axios from "axios";
import React, { useEffect, useState } from "react";

export const FriendList = (props: { setChatData: any }) => {
  const [friends, setFriends] = useState([
    { nume: "", prenume: "", poza_profil: "", user_id1: 0, user_id2: 0 },
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
  const friendList = friends.map((friend) => {
    return (
      <div
        className="flex flex-row feed-wrapper bg-amber-400"
        onClick={() => {
          console.log("friend", friend);

          return props.setChatData(friend);
        }}
      >
        <img
          alt={`${friend.nume}${friend.prenume}_poza_profil`}
          src={`data:image/png;base64,${friend.poza_profil}`}
          className="shadow-xl rounded-full  h-10 w-10 object-cover  border-none   max-w-150-px"
        />
        <div>{friend.nume}</div>;<div>{friend.prenume}</div>;
        <div>{friend.user_id1 ? friend.user_id1 : friend.user_id2}</div>;
      </div>
    );
  });
  return <div className="flex flex-col fixed h-screen">{friendList}</div>;
};
