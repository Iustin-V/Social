import { CreatePost } from "../components/CreatePost";
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
    },
  ]);
  useEffect(() => {
    Axios.get("http://localhost:3002/api/posts/all").then((data) => {
      setPosts(data.data);
      console.log(data.data);
    });
  }, []);
  const postListEven = posts.map((post, index) => {
    if (index % 2 === 0) {
      console.log(index)
      return (
        <PostCard
          userId={post.userId}
          content={post.continut}
          date={post.data_postarii}
          imagine={post.imagine}
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
        />
      );
    }
  });
  return (
    <div className="feed-wrapper">
      <div className="feed-column-wrapper">
        <div className="feed-column">
          <CreatePost />

          {postListEven}
        </div>
        <div className="feed-column">{postListOdd}</div>
      </div>
    </div>
  );
};
