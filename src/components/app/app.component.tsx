import React from "react";
import { Routes, Route } from "react-router-dom";

import { Login } from "../auth/login.component";
import { Guest } from "../guest/index.component";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/guest" element={<Guest />} />
    </Routes>
  );
};

export { App };
