import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { Feed } from "./pages/Feed";
import Login from "./pages/Login";
import {Register} from "./pages/Register";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {localStorage.token ? <Navigation /> : <></>}
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/*<Footer /> */}
    </>
  );
}

export default App;
