import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import {Register} from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
