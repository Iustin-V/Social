import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { Account } from "./pages/Account";
import { CreateProfile } from "./pages/CreateProfile";
import { EditProfile } from "./pages/EditProfile";
import { Feed } from "./pages/Feed";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {localStorage.token && window.location.href!=="/create-your-profile" ? <Navigation /> : <></>}
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Feed />} />
          <Route path={`/account`} element={<Account />} />
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
