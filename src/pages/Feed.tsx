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
      nume: "",
      prenume: "",
    },
  ]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e:any) => {
    if (e.key === "Enter") {
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

      <div className="feed-wrapper">
        <div className={"max-w-[500px] w-full relative px-6"}>
          <div className="absolute inset-y-0 left-6 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"></path>
            </svg>
          </div>
          <input
              type="search"
              className="p-2 pl-9 w-full rounded-2xl border-b-2 border-red-800 bg-gray-50 focus:border-red-900"
              placeholder={'Search posts'}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => handleSearch(e)}
          />
        </div>
        <div className="flex flex-col w-fit md:flex-row">
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
