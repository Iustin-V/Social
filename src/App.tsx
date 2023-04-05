import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { Account } from "./pages/Account";
import { CreateProfile } from "./pages/CreateProfile";
import { EditProfile } from "./pages/EditProfile";
import { Feed } from "./pages/Feed";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import React, { useEffect } from "react";
import { useJwt } from "react-jwt";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {PostPage} from "./pages/PostPage";

function App() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if(!window.location.href.includes("/login") && !window.location.href.includes("/register")  && !token){
      window.location.href='/login'
    }
  }, []);

  return (
    <>
      {localStorage.token &&
      !window.location.href.includes("/create-your-profile") ? (
        <Navigation />
      ) : (
        <></>
      )}
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Feed />} />
          <Route path={`/account`} element={<Account />} />
          <Route path={`/page/user/:id`} element={<Account />} />
          <Route path={`/post/:id`} element={<PostPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-your-profile" element={<CreateProfile />} />
          <Route path="/edit-your-profile" element={<EditProfile />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/*<Footer />*/}
    </>
  );
}

export default App;
