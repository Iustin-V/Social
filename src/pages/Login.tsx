import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import "./login.css";
import redEclipseLogo from "../images/RedEclipse.webp"

const Login = () => {
    return (
        <div>
            <div className="bg-white pt-6 sm:pt-8 lg:pt-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

                    <div className="flex justify-center h-16 mb-6 md:h-32">
                            <img
                                src={redEclipseLogo}
                                loading="lazy" alt="Red Eclipse logo"
                                className="absolute w-64 object-cover object-center mx-auto md:w-96"/>
                    </div>
                    <div className=" my-4 md:my-0">
                        <p className="mx-auto max-w-screen-md text-center text-black md:text-lg">Bun venit pe RedEclipse - locul unde pasiunile, interesele și ideile tale se întâlnesc cu o comunitate vibrantă și plină de energie. Fie că ești aici pentru a-ți conecta cu prietenii și familia, pentru a-ți extinde rețeaua de contacte sau pentru a explora comunități și culturi noi, suntem încântați să te avem alături de noi. </p>
                    </div>
                </div>
            </div>
            <div className="bg-white pb-6 sm:pt-8 lg:pt-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Login</h2>

                    <form className="red-background mx-auto max-w-lg rounded-lg border-2 border-red-900">
                        <div className="flex flex-col gap-4 p-4 md:p-8">
                            <div>
                                <label htmlFor="email"
                                       className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                                <input name="email"
                                       className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"/>
                            </div>

                            <div>
                                <label htmlFor="password"
                                       className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
                                <input name="password"
                                       className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"/>
                            </div>

                            <button
                                className="block rounded-lg bg-red-900 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-red-700 focus-visible:ring active:bg-gray-600 md:text-base">Log
                                in
                            </button>
                        </div>

                        <div className="flex items-center justify-center rounded-lg border bg-gray-100 p-4">
                            <p className="text-center text-sm text-black">Don't have an account? <a href="#"
                                                                                                       className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Register</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
