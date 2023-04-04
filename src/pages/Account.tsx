import { CreatePost } from "../components/CreatePost";
import { PostCard } from "../components/PostCard";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Navigation} from "../components/Navigation";

export const Account = () => {
  const [profilData, setProfilData] = useState({
    id: 0,
    nume: "",
    prenume: "",
    data_nasterii: "",
    data_creare_cont: "",
    oras: "",
    tara: "",
    user_id: 0,
    poza_profil: "",
    poza_cover: "",
    descriere: "",
  });
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
  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.get("http://localhost:3002/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setProfilData(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    Axios.get("http://localhost:3002/api/your-posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const postListEven = posts.map((post) => {
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
  });
  return (
    <>
      <main className="profile-page">
        <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
        />
        <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
        />
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover profile-cover"
            style={{
              backgroundImage: `url(data:image/png;base64,${profilData.poza_cover})`,
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0px)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt={`${profilData.nume}${profilData.prenume}_poza_profil`}
                        src={`data:image/png;base64,${profilData.poza_profil}`}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          22
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Friends
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          10
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Photos
                        </span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          89
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Comments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {profilData.prenume} {profilData.nume}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {profilData.oras}, {profilData.tara}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {profilData.descriere}
                      </p>
                      <a href="#pablo" className="font-normal text-pink-500">
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="feed-wrapper">{postListEven}</div>
    </>
  );
};
