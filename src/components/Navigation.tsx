import Logo from "../images/Red-Eclipse-logo.webp";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Axios from "axios";
import React,{ Fragment, useEffect, useState } from "react";
import {FriendList} from "./FriendList";



function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Navigation = () => {
  const [navigation,updateNav ]= React.useState([
    {
      name: "Your Feed",
      href: "/",
      current: window.location.href === "http://localhost:3000/",
    },
    { name: "Account", href: "/account", current:  window.location.href.includes("account") },
  ])

  React.useEffect(() => {

   updateNav([
     {
       name: "Your Feed",
       href: "/",
       current: window.location.href === "http://localhost:3000/",
     },

     {
       name: "Account",
       href: "/account",
       current: window.location.href.includes("account"),
     },
   ])
  }, [window.location.href]);
  const [profilePic, setProfilePic] = useState({poza_profil:''});
  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.get("http://localhost:3002/api/user-profile-picture", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data)
        setProfilePic(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
      <div className={"fixed w-screen z-40"}>
    <Disclosure as="nav" className="red-background ">
      <>
        <div className="mx-auto max-w-7xl px-1.5 md:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className=" hover:bg-red-500 inline-flex items-center justify-center  rounded-md p-2 text-gray-400  hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden">
                <span className="sr-only ">Open main menu</span>
                {false ? (
                  <XMarkIcon className="block h-6 w-6 text-black hover:bg-red" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6 text-black " aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-10 w-auto lg:hidden"
                  src={Logo}
                  alt="Your Company"
                />
                <img
                  className="hidden h-10 w-auto lg:block"
                  src={Logo}
                  alt="Your Company"
                />
              </div>
              <div className="md:flex items-center hidden md:ml-6 lg:block ">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-[#a11b21] text-white"
                          : "bg-white hover:text-white hover:bg-red-500",
                        "rounded-md px-3 py-2 text-sm font-medium text-black "
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">

              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">View notifications</span>
                    <BellIcon
                        className="h-6 w-6 text-white bg-transparent"
                        aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className=" bg-[#e3bbb2] absolute right-0 z-10 mt-2 w-96 origin-top-right border-2 border-red-800 rounded-md  py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <FriendList notification={true}/>
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={`data:image/png;base64,${profilePic.poza_profil}`}
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/account"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/edit-your-profile"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Edit Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/login"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                          onClick={() => {
                            localStorage.removeItem("token");
                          }}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <Disclosure.Panel className=" block md:block md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-[#a11b21] text-white"
                    : "bg-white hover:text-white hover:bg-red-500",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </Disclosure.Panel>
      </>
    </Disclosure>
      </div>
  );
};
