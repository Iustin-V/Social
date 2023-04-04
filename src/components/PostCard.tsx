import ConfirmationModal from "./ConfirmationModal";
import { CreatePostModal } from "./CreatePostModal";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";

interface PostCardInterface {
  id: number;
  userId: number;
  content: string;
  date: string;
  imagine: string;
  nume: string;
  prenume: string;
}

export const PostCard = (props: PostCardInterface) => {
  const token = localStorage.getItem("token");
  const { decodedToken, isExpired } = useJwt(token || "");
  // @ts-ignore
  const loggedInUserId = decodedToken?.id;
  console.log(loggedInUserId, props.userId);

  const [openModal, setOpenModal] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  const src = "data:image/png;base64," + props.imagine;

  useEffect(() => {
    Axios.get(`http://localhost:3002/api/comments/count/${props.id}`)
      .then((data) => {
        setNumberOfComments(data.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
    Axios.get(`http://localhost:3002/api/likes/count/${props.id}`)
      .then((data) => {
        setNumberOfLikes(data.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  const handleLike = () => {
    const token = localStorage.getItem("token");

    Axios.post(
      "http://localhost:3002/api/like-post",
      {
        post_id: props.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        setRefresh(!refresh);
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
        Body: `${props.id}`,
      },
    })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-4 relative md:w-96">
      <CreatePostModal
        open={openEditModal}
        setOpened={setOpenEditModal}
        isEdit={true}
        modelData={{ description: props.content, image: props.imagine }}
        id={props.id}
        confirmHandle={() => {
          console.log("merge");
        }}
      />
      <ConfirmationModal
        open={openModal}
        setOpened={setOpenModal}
        confirmHandle={handleDelete}
      />
      {loggedInUserId === props.userId && (
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
        {props.imagine && (
          <img
            className=" w-full object-cover object-center"
            src={src}
            alt="post_image"
          />
        )}
        <div className="p-6">
          <p className="leading-relaxed  text-xl font-bold">
            {props.nume} {props.prenume}
          </p>

          <p className="leading-relaxed mb-3">{props.content}</p>
          <div className="flex items-center flex-wrap ">
            <a
              href={`/post/${props.id}`}
              className="text-red-400 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-400 hover:underline"
            >
              See post
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
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
  );
};
