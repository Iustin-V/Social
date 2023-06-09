import redEclipseLogo from "../images/RedEclipse.webp";
import backgroundImg from "../images/back5.gif";
import { emailValidation, passwordValidation } from "../utils/inputsValidation";
import Axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const [errorState, setErrorState] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const onChangeHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.id === "email") {
      setEmailError(emailValidation(e.target.value));
      credentials.email = e.target.value;
    }

    if (e.target.id === "password") {
      setPasswordError(passwordValidation(e.target.value));
      credentials.password = e.target.value;
    }
  };

  React.useEffect(() => {
    if (emailError === "" && passwordError === "") {
      if (credentials.email !== "" && credentials.password !== "") {
        setErrorState(false);
      } else {
        setErrorState(true);
      }
    } else {
      setErrorState(true);
    }
  }, [emailError, passwordError]);

  React.useEffect(() => {
    if (localStorage.token) {
      window.location.href = `/`;
    }
  }, []);
  const handleLogin = () => {

    Axios.post("http://localhost:3002/api/login", {
      email: credentials.email,
      parola: credentials.password,
    })
      .then((response) => {
        console.log(response.data.message);
        localStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        setErrorState(true);
      });
    setTimeout(() => {
      const token = localStorage.getItem("token");

      Axios.get("http://localhost:3002/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          response.data.length === 0
            ? (window.location.href = "/create-your-profile")
            : (window.location.href = "/");
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);
  };



  return (
    <>
      {!localStorage.token ? (
          <div className={"flex flex-col items-center justify-center p-10 h-full sm:h-screen sm:p-0"}
               style={{
                 background: `url(${backgroundImg})`,
                 backgroundSize: "cover",
                 backgroundRepeat: "no-repeat",
               }}>
        <div
          className="flex rounded-3xl animated-enter overflow-hidden shadow-lg shadow-gray-400 flex-col items-center justify-center lg:flex-row"
        >
          <div className=" bg-white flex flex-col items-center justify-center h-full bg-opacity-50 pt-6 sm:pt-8 lg:pt-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="flex justify-center relative h-16 md:h-40 md:mx-9">
                <img
                  src={redEclipseLogo}
                  loading="lazy"
                  alt="Red Eclipse logo"
                  className="absolute w-64 object-cover object-center mx-auto md:w-full"
                />
              </div>
              <div className=" my-4 md:my-3">
                <p className="mx-auto max-w-screen-md text-center text-black md:text-lg">
                  Join the Red Eclipse Net community and connect with people
                  from around the world, anytime, anywhere. Our platform is
                  designed to break down barriers and bring people together,
                  fostering meaningful conversations and enriching experiences.
                  Experience the power of global connectivity with Red Eclipse
                  Net..{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white w-full lg:w-fit pb-6 sm:pt-8 bg-opacity-50 lg:pt-12 min-w-[350px] md:min-w-[474px]">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
                Login
              </h2>

              <div className="red-background animated-enter-right mx-auto max-w-lg rounded-lg border-2 border-red-900">
                <div className="flex flex-col p-4 md:p-8">
                  <div className="relative pb-4">
                    <label className="mb-2 inline-block text-sm text-black sm:text-base">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      onChange={onChangeHandle}
                      name="email"
                      className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 mb-4 transition duration-100 focus:ring"
                    />
                    {emailError && (
                      <p className={"absolute bottom-1 text-red-500"}>
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="relative pb-8 md:pb-4">
                    <label className="mb-2 inline-block text-sm text-black sm:text-base">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      onChange={onChangeHandle}
                      name="password"
                      className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 mb-4 transition duration-100 focus:ring"
                    />
                    {passwordError && (
                      <p
                        className={"absolute bottom-0 md:bottom-1 text-red-500"}
                      >
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleLogin}
                    className="block my-3 rounded-lg bg-red-900 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-red-700 focus-visible:ring active:bg-gray-600 md:text-base"
                  >
                    Log in
                  </button>
                </div>

                <div className="flex items-center justify-center rounded-lg border bg-gray-100 p-4">
                  <p className="text-center text-sm text-black">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Register
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div></div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Login;
