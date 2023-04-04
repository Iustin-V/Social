import { UploadImage } from "../tools/UploadImage";
import { Dialog, Transition } from "@headlessui/react";
import Axios from "axios";
import React, { Fragment } from "react";

export const CreatePostModal = (props: {
  open: boolean;
  setOpened: any;
  confirmHandle: any;
}) => {
  const [postInfo, setPostInfo] = React.useState({
    description: "",
    image: "",
  });
  const [errorState, setErrorState] = React.useState(false);

  const handleCreatePost = () => {
    const token = localStorage.getItem("token");

    console.log("postInfo", postInfo);
    if (!postInfo.description && !postInfo.image) {
      setErrorState(true);
    } else {
      setErrorState(false);
      Axios.post(
        "http://localhost:3002/api/create-post",
        {
          continut: postInfo.description,
          imagine: postInfo.image || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          setPostInfo({
            description: "",
            image: "",
          });
          props.confirmHandle();
          props.setOpened(false);
          console.log("merge");
          window.location.reload()
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  React.useEffect(() => {
    setErrorState(false);
    setPostInfo({
      description: "",
      image: "",
    });
  }, [props.open]);
  const onChangeHandle = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.id === "description") {
      postInfo.description = e.target.value;
    }
    if (e.target.id === "image") {
      postInfo.image = e.target.value;
    }
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.setOpened}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start w-full">
                    <div className="mt-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold leading-6 text-gray-900 mb-2"
                      >
                        Create new post
                      </Dialog.Title>
                      <div className="col-span-full w-full mb-2">
                        <label
                          htmlFor="about"
                          className="block text-lg w-full font-medium leading-6 text-gray-900"
                        >
                          Description
                        </label>
                        <p className="mb-2 text-sm leading-6 text-gray-600">
                          Write your post description here.
                        </p>
                        <div className="mt-2">
                          <textarea
                            onChange={onChangeHandle}
                            id="description"
                            name="about"
                            rows={3}
                            className="block px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="col-span-full w-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-lg font-medium leading-6 text-gray-900"
                        >
                          Photo
                        </label>
                        <UploadImage
                          uploadFunction={onChangeHandle}
                          post={true}
                        />
                      </div>
                      <div className={"p-1 h-6"}>
                        {errorState && (
                          <h2
                            className={
                              "text-red-500 text-center text-base bg-red-200"
                            }
                          >
                            You must complete at least one field !
                          </h2>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-900 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleCreatePost();
                    }}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setPostInfo({
                        description: "",
                        image: "",
                      });
                      props.setOpened(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
