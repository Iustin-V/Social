import { ConfirmationModal } from "../components/ConfirmationModal";
import { UploadImage } from "../tools/UploadImage";
import { messageValidation, nameValidation } from "../utils/inputsValidation";
import Axios from "axios";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const EditProfile = () => {
  document.body.style.background = "#d1aea695";

  const [profileInformations, setProfileInformations] = React.useState({
    prenume: "",
    nume: "",
    descriere: "",
    data_nasterii: "",
    oras: "",
    tara: "",
    poza_profil: "",
    poza_cover: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.get("http://localhost:3002/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setProfileInformations(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [birthdayDate, setBirthdayDate] = React.useState(new Date());
  const [image, getImage] = React.useState("");

  const [errorState, setErrorState] = React.useState(false);
  const [numeError, setNumeError] = React.useState("");
  const [prenumeError, setPrenumeError] = React.useState("");
  const [descriereError, setDescriereError] = React.useState("");
  const [orasError, setOrasError] = React.useState("");
  const [taraError, setTaraError] = React.useState("");
  const [pozaProfilError, setPozaProfilError] = React.useState("");
  const [pozaCoverError, setPozaCoverError] = React.useState("");

  const onChangeHandle = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.id === "prenume") {
      setPrenumeError(nameValidation(e.target.value));
      profileInformations.prenume = e.target.value;
    }

    if (e.target.id === "nume") {
      setNumeError(nameValidation(e.target.value));
      profileInformations.nume = e.target.value;
    }
    if (e.target.id === "descriere") {
      setDescriereError(messageValidation(e.target.value));
      profileInformations.descriere = e.target.value;
    }
    if (e.target.id === "oras") {
      setOrasError(nameValidation(e.target.value));
      profileInformations.oras = e.target.value;
    }
    if (e.target.id === "poza_profil") {
      setPozaProfilError(messageValidation(e.target.value));
      profileInformations.poza_profil = e.target.value;
    }
    if (e.target.id === "poza_cover") {
      setPozaCoverError(messageValidation(e.target.value));
      profileInformations.poza_cover = e.target.value;
    }
  };
  const handleSave = () => {
    if (
      numeError === "" &&
      prenumeError === "" &&
      orasError === "" &&
      taraError === "" &&
      pozaProfilError === "" &&
      pozaCoverError === "" &&
      descriereError === ""
    ) {
      if (
        profileInformations.nume !== "" &&
        profileInformations.prenume !== "" &&
        profileInformations.descriere !== "" &&
        profileInformations.data_nasterii !== "" &&
        profileInformations.oras !== "" &&
        profileInformations.tara !== "" &&
        profileInformations.poza_profil !== "" &&
        profileInformations.poza_cover !== ""
      ) {
        setErrorState(false);
        const token = localStorage.getItem("token");
        Axios.put(
          "http://localhost:3002/api/edit-profile",
          {
            nume: profileInformations.nume,
            prenume: profileInformations.prenume,
            data_nasterii: profileInformations.data_nasterii,
            oras: profileInformations.oras,
            tara: profileInformations.tara,
            poza_profil: profileInformations.poza_profil,
            poza_cover: profileInformations.poza_cover,
            descriere: profileInformations.descriere,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => {
            console.log(response.data.message);
            window.location.href = "/account";
          })
          .catch((error) => {
            console.log(error);
          });

        console.log("bravo coita", profileInformations);
      } else {
        setErrorState(true);
      }
    } else {
      setErrorState(true);
    }
  };
  const deleteButtonFuction = () => {
  };
  const handleDelete = () => {
    const token = localStorage.getItem("token");
    Axios.delete("http://localhost:3002/api/delete-account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        localStorage.removeItem("token");
        window.location.href = "/register";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (

    <div className="bg-white mx-auto max-w-5xl py-16 px-2 sm:px-6 lg:px-8">
      <div>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h1 className="text-4xl font-bold text-red-800">
              Edit your Profile
            </h1>

            <p className="mt-4 text-base leading-6 text-black">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      onChange={onChangeHandle}
                      type="text"
                      name="firstname"
                      id="prenume"
                      defaultValue={profileInformations.prenume}
                      autoComplete="firstname"
                      className="block px-2 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="First Name"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="lastname"
                      id="nume"
                      defaultValue={profileInformations.nume}
                      onChange={onChangeHandle}
                      autoComplete="lastname"
                      className="block px-2 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=" Last Name"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="descriere"
                    name="about"
                    rows={3}
                    onChange={onChangeHandle}
                    className="block px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    defaultValue={profileInformations.descriere}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about yourself.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  Profile Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UploadImage
                    uploadFunction={onChangeHandle}
                    usedImage={`data:image/png;base64,${profileInformations.poza_profil}`}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <UploadImage
                  uploadFunction={onChangeHandle}
                  usedImage={`data:image/png;base64,${profileInformations.poza_cover}`}
                  cover={true}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2">
                  <select
                    onChange={(e) => {
                      profileInformations.tara = e.target.value;
                    }}
                    id="country"
                    name="tare"
                    autoComplete="country-name"
                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option selected={profileInformations.tara === "Romania"}>
                      Romania
                    </option>
                    <option selected={profileInformations.tara === "UK"}>
                      UK
                    </option>
                    <option selected={profileInformations.tara === "Ukraine"}>
                      Ukraine
                    </option>
                    <option selected={profileInformations.tara === "Moldova"}>
                      Moldova
                    </option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-xl font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    onChange={onChangeHandle}
                    type="text"
                    name="city"
                    defaultValue={profileInformations.oras}
                    id="oras"
                    autoComplete="address-level2"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"p-3 h-10"}>
          {errorState && (
            <h2 className={"text-red-500 text-center text-xl md:text-2xl"}>
              All fields must be completed !{" "}
            </h2>
          )}
        </div>
        <div className="mt-6 flex items-center justify-center gap-x-6 sm:justify-between">
          <button
            type="submit"
            className="rounded-md bg-red-800 px-10 py-2 text-xl font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSave}
          >
            Save
          </button>{" "}
          <button
            type="submit"
            className="rounded-md bg-red-800 px-10 py-2 text-xl font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={deleteButtonFuction}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
