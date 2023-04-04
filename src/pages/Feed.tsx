import { Chat } from "../components/Chat";
import { CreatePost } from "../components/CreatePost";
import { FriendList } from "../components/FriendList";
import { PostCard } from "../components/PostCard";
import Axios from "axios";
import { useEffect, useState } from "react";

export const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 0,
      userId: 0,
      continut: "",
      data_postarii: "",
      imagine: "",
      nume: "",
      prenume: "",
    },
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [chatData, setChatData] = useState({
    nume: "",
    prenume: "",
    user_id: 0,
  });

  const handleSearch = (e: any) => {
    if (e.key === "Enter" && searchValue) {
      Axios.get("http://localhost:3002/api/posts/search", {
        headers: {
          Body: `${searchValue}`,
        },
      }).then((data) => {
        setPosts(data.data);
        console.log(data.data);
      });
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:3002/api/posts/all").then((data) => {
      setPosts(data.data);
      console.log(data.data);
    });
  }, []);
  const postListEven = posts.map((post, index) => {
    if (index % 2 === 0) {
      console.log(index);
      return (
        <PostCard
          userId={post.userId}
          content={post.continut}
          date={post.data_postarii}
          imagine={post.imagine}
          nume={post.nume}
          prenume={post.prenume}
        />
      );
    }
  });
  const postListOdd = posts.map((post, index) => {
    if (index % 2 !== 0) {
      return (
        <PostCard
          userId={post.userId}
          content={post.continut}
          date={post.data_postarii}
          imagine={post.imagine}
          nume={post.nume}
          prenume={post.prenume}
        />
      );
    }
  });
  return (
    <>
      <div>
        {chatData.user_id !== 0 && <Chat chatData={chatData} />}
        <FriendList setChatData={setChatData} />
        <input
          className="p-5 bg-amber-50"
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => handleSearch(e)}
        />
      </div>
      <div className="feed-wrapper">
        <div className="feed-column-wrapper">
          <div className="feed-column">
            <CreatePost />

            {postListEven}
          </div>
          <div className="feed-column">{postListOdd}</div>
        </div>
      </div>
    </>
  );
};
