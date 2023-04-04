import ConfirmationModal from "../components/ConfirmationModal";
import { CreatePostModal } from "../components/CreatePostModal";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useParams } from "react-router-dom";

export const PostPage = () => {
  const token = localStorage.getItem("token");

  const { decodedToken, isExpired } = useJwt(token || "");
  // @ts-ignore
  const loggedInUserId = decodedToken?.id;

  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);

  const [comment, setComment] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [post, setPost] = useState({
    id: 0,
    user_id: 0,
    continut: "",
    data_postarii: "",
    imagine: "",
    nume: "",
    prenume: "",
  });
  const [comments, setComments] = useState([
    {
      id: 0,
      user_id: 0,
      post_id: 0,
      continut: "",
      nume: "",
      prenume: "",
      poza_profil: "",
    },
  ]);
  const src = "data:image/png;base64," + post.imagine;
  let params = useParams();
  useEffect(() => {
    if (params.id) {
      Axios.get(`http://localhost:3002/api/posts/${params.id}`)
        .then((data) => {
          setPost(data.data[0]);
        })
        .catch((error) => {
          console.error(error);
        });
      Axios.get(`http://localhost:3002/api/comments/${params.id}`)
        .then((data) => {
          console.log(data.data);
          setComments(data.data);
        })
        .catch((error) => {
          console.error(error);
        });

      Axios.get(`http://localhost:3002/api/comments/count/${params.id}`)
        .then((data) => {
          setNumberOfComments(data.data.count);
        })
        .catch((error) => {
          console.error(error);
        });
      Axios.get(`http://localhost:3002/api/likes/count/${params.id}`)
        .then((data) => {
          setNumberOfLikes(data.data.count);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [refresh]);

  const useChatScroll = (
    dep: {
      post_id: number;
      user_id: number;
      continut: string;
      prenume: string;
      id: number;
      poza_profil: string;
      nume: string;
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
  const ref = useChatScroll(comments);

  const commentList = comments.map((comment) => {
    return (
      <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 px-2 py-1 antialiased flex max-w-lg">
        <img
          className="rounded-full h-8 w-8 mr-2 mt-1 object-cover "
          src={`data:image/png;base64,${comment.poza_profil}`}
        />
        <div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
            <div className="font-semibold text-sm leading-relaxed">
              {comment.nume} {comment.prenume}
            </div>
            <div className="text-normal leading-snug md:leading-normal">
              {comment.continut}
            </div>
          </div>
        </div>
      </div>
    );
  });
  const handleSubmit = () => {
    const token = localStorage.getItem("token");

    Axios.post(
      "http://localhost:3002/api/post/create-comment",
      {
        post_id: params.id,
        continut: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        setRefresh(!refresh);
        setComment("");
        console.log("merge");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLike = () => {
    const token = localStorage.getItem("token");

    Axios.post(
      "http://localhost:3002/api/like-post",
      {
        post_id: params.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        setRefresh(!refresh);
        setComment("");
        console.log("merge");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    Axios.delete("http://localhost:3002/api/delete-post", {
      headers: {
        Authorization: `Bearer ${token}`,
        Body: `${params.id}`,
      },
    })
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      className={
        "relative md:fixed flex flex-col height-calculat items-center md:border-2 md:rounded-2xl md:border-red-800 justify-between w-full max-w-[1280px] px-0 md:px-[32px] py-0 md:py-[64px] md:left-1/2  top-[64px] md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:flex-row"
      }
    >
      <div className="p-4 relative w-[100%] md:w-[50%]">
        <CreatePostModal
          open={openEditModal}
          setOpened={setOpenEditModal}
          isEdit={true}
          modelData={{ description: post.continut, image: post.imagine }}
          id={post.id}
          confirmHandle={() => {
            console.log("merge");
          }}
        />
        <ConfirmationModal
          open={openModal}
          setOpened={setOpenModal}
          confirmHandle={handleDelete}
        />
        {loggedInUserId === post.user_id && (
          <>
            <button
              onClick={() => setOpenEditModal(true)}
              className="absolute inset-y-0 top-6 right-32 z-10 hover:bg-red-800 hover:text-white h-fit text-sm flex bg-red-50 rounded-lg items-center p-2 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="absolute inset-y-0 top-6 right-6 z-10 hover:bg-red-800 hover:text-white h-fit text-sm flex bg-red-50 rounded-lg items-center p-2 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </button>
          </>
        )}
        <div className="h-full relative  border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
          {post.imagine && (
            <img
              className=" w-full object-cover object-center"
              src={src}
              alt="post_image"
            />
          )}
          <div className="p-6">
            <p className="leading-relaxed  text-xl font-bold">
              {post.nume} {post.prenume}
            </p>

            <p className="leading-relaxed mb-3">{post.continut}</p>
            <div className="flex items-center flex-wrap ">
              <span
                onClick={handleLike}
                className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {numberOfLikes}
              </span>
              <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
                {numberOfComments}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-h-[600px]  items-start justify-center  w-[100%] md:w-[45%] bg-white dark:bg-gray-800">
        <div
            //@ts-ignore
          ref={ref}
          className={
            "flex flex-col w-full max-h-[600px] overflow-y-auto items-start"
          }
        >
          {commentList}
        </div>
        <div className="flex justify-center items-center mt-3 w-full">
          <div className=" px-2 w-full rounded-[12px] bg-white p-3 shadow-md border">
            <p className="text-xl font-semibold text-blue-900 cursor-pointer transition-all hover:text-black">
              Add Comment
            </p>
            <textarea
              id="continut"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-10 px-3 text-sm py-1 mt-5 outline-none border-gray-300 w-full resize-none border rounded-lg placeholder:text-sm"
              placeholder="Add your comments here"
            />

            <div className="flex justify-between mt-2">
              <button
                onClick={handleSubmit}
                className="h-8 w-[150px] bg-blue-400 text-sm text-white rounded-lg transition-all cursor-pointer hover:bg-blue-600"
              >
                Submit comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
